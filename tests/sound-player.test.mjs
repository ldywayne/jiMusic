import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { test } from 'node:test'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'

// Execute the actual TypeScript composable with a controllable media boundary.
// Play promises can complete in any order, as they do during rapid real clicks.
const source = readFileSync(
  new URL('../src/composables/useSoundPlayer.ts', import.meta.url),
  'utf8',
)
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText
const sound = (id) => ({ id, name: id, category: '经典语录', url: `/assets/${id}.mp3` })

function setup(connection = {}) {
  const audios = []
  const mounted = []
  const unmounted = []
  const timers = new Set()
  const frames = new Map()
  const visibilityListeners = new Set()
  const document = {
    hidden: false,
    addEventListener: (name, callback) => {
      if (name === 'visibilitychange') visibilityListeners.add(callback)
    },
    removeEventListener: (name, callback) => visibilityListeners.delete(callback),
  }
  let frameId = 0
  class FakeAudio {
    src = ''
    currentTime = 0
    duration = Number.NaN
    volume = 1
    paused = true
    ended = false
    error = null
    loadCount = 0
    pending = []
    constructor() {
      audios.push(this)
    }
    play() {
      this.paused = false
      this.ended = false
      return new Promise((resolve, reject) => this.pending.push({ resolve, reject }))
    }
    pause() {
      this.paused = true
      this.onpause?.()
    }
    load() {
      this.loadCount++
      this.error = null
    }
    removeAttribute(name) {
      if (name === 'src') this.src = ''
    }
    metadata(duration) {
      this.duration = duration
      this.onloadedmetadata?.()
    }
  }
  const exports = {}
  runInNewContext(compiled, {
    exports,
    Audio: FakeAudio,
    DOMException,
    navigator: { connection },
    document,
    requestAnimationFrame: (callback) => {
      frames.set(++frameId, callback)
      return frameId
    },
    cancelAnimationFrame: (id) => frames.delete(id),
    setTimeout: (callback) => {
      timers.add(callback)
      return callback
    },
    clearTimeout: (callback) => timers.delete(callback),
    require: (name) => {
      if (name === 'vue')
        return {
          shallowRef: (value) => ({ value }),
          readonly: (value) => value,
          onMounted: (callback) => mounted.push(callback),
          onUnmounted: (callback) => unmounted.push(callback),
        }
      if (name === '@/data/sounds') return { featuredSounds: ['j', 'n', 't', 'm'].map(sound) }
      throw new Error(`Unexpected import: ${name}`)
    },
  })
  const player = exports.useSoundPlayer()
  return {
    player,
    audios,
    timers,
    frames,
    frame: () => {
      const pending = [...frames.values()]
      frames.clear()
      pending.forEach((callback) => callback())
    },
    visibility: (hidden) => {
      document.hidden = hidden
      visibilityListeners.forEach((callback) => callback())
    },
    mount: () => mounted.forEach((callback) => callback()),
    unmount: () => unmounted.forEach((callback) => callback()),
    warm: () => [...timers].forEach((callback) => callback()),
  }
}
const flush = async () => {
  await Promise.resolve()
  await Promise.resolve()
}

// FFmpeg 7.1 decoded every source file to 48 kHz mono PCM on 2026-10-06.
// Hashes ensure these duration fixtures are not silently reused for different audio.
const auditedClips = JSON.parse(
  readFileSync(new URL('./fixtures/audio-audit.json', import.meta.url), 'utf8'),
)

test('all 59 decoded sources keep matching hashes and correct container extensions', () => {
  const resourceDir = new URL('../src/res/', import.meta.url)
  const files = readdirSync(resourceDir).filter((file) => /\.(mp3|m4a|wav)$/.test(file))
  assert.equal(files.length, 59)
  assert.equal(auditedClips.length, files.length)
  for (const clip of auditedClips) {
    assert.ok(files.includes(clip.file), clip.file)
    const bytes = readFileSync(new URL(clip.file, resourceDir))
    assert.equal(createHash('sha256').update(bytes).digest('hex'), clip.sha256, clip.file)
    assert.ok(clip.decodedSeconds > 0 && Number.isFinite(clip.decodedSeconds), clip.file)
    if (clip.file.endsWith('.wav')) {
      assert.equal(bytes.toString('ascii', 0, 4), 'RIFF', clip.file)
      assert.equal(bytes.toString('ascii', 8, 12), 'WAVE', clip.file)
    } else if (clip.file.endsWith('.m4a')) {
      assert.equal(bytes.toString('ascii', 4, 8), 'ftyp', clip.file)
    } else {
      assert.ok(
        bytes.toString('ascii', 0, 3) === 'ID3' || (bytes[0] === 255 && (bytes[1] & 224) === 224),
        clip.file,
      )
    }
  }
})

test('all audited short and long clips retain fractional progress, seek and finish correctly', async () => {
  const { player, audios, frames, frame } = setup()
  for (const clip of auditedClips) {
    player.play(sound(clip.file))
    const audio = audios.at(-1)
    audio.metadata(clip.decodedSeconds)
    audio.pending[0].resolve()
    await flush()
    for (const fraction of [0.1, 0.5, 0.9]) {
      audio.currentTime = clip.decodedSeconds * fraction
      frame()
      assert.equal(player.currentTime.value, audio.currentTime, clip.file)
      assert.equal(player.duration.value, clip.decodedSeconds, clip.file)
    }
    player.seek(clip.decodedSeconds * 0.37)
    assert.equal(player.currentTime.value, clip.decodedSeconds * 0.37, clip.file)
    audio.currentTime = clip.decodedSeconds
    audio.ended = true
    audio.onended()
    assert.equal(player.currentTime.value, clip.decodedSeconds, clip.file)
    assert.equal(frames.size, 0, clip.file)
    player.stop()
    assert.equal(player.currentTime.value, 0, clip.file)
  }
})

test('buffering and hidden tabs suspend frames, returning resynchronizes with audio', async () => {
  const { player, audios, frames, frame, mount, visibility, unmount } = setup()
  mount()
  player.play(sound('long'))
  const audio = audios[0]
  audio.metadata(120)
  audio.pending[0].resolve()
  await flush()
  audio.currentTime = 3.2
  frame()
  audio.onwaiting()
  assert.equal(player.status.value, 'loading')
  assert.equal(frames.size, 0)
  audio.onplaying()
  assert.equal(frames.size, 1)
  visibility(true)
  assert.equal(frames.size, 0)
  audio.currentTime = 23.4
  visibility(false)
  assert.equal(player.currentTime.value, 23.4)
  assert.equal(frames.size, 1)
  unmount()
  assert.equal(frames.size, 0)
  assert.equal(audio.ondurationchange, null)
  assert.equal(audio.onseeked, null)
})

test('old track events and invalid durations cannot overwrite the current timeline', async () => {
  const { player, audios, frames, frame } = setup()
  player.play(sound('old'))
  audios[0].metadata(120)
  audios[0].pending[0].resolve()
  await flush()
  player.play(sound('new'))
  audios[1].metadata(0.26)
  audios[1].pending[0].resolve()
  await flush()
  audios[0].currentTime = 70
  audios[0].ontimeupdate()
  audios[0].ondurationchange()
  audios[0].onseeked()
  audios[1].currentTime = 0.12
  frame()
  assert.equal(player.duration.value, 0.26)
  assert.equal(player.currentTime.value, 0.12)
  assert.equal(frames.size, 1)
  audios[1].duration = Infinity
  audios[1].ondurationchange()
  assert.equal(player.duration.value, 0)
  player.seek(NaN)
  assert.equal(audios[1].currentTime, 0.12)
})

test('a browser pause before play resolves keeps the progress paused', async () => {
  const { player, audios, frames } = setup()
  player.play(sound('j'))
  audios[0].pause()
  audios[0].pending[0].resolve()
  await flush()
  assert.equal(player.status.value, 'paused')
  assert.equal(frames.size, 0)
})

test('short timestamps display hundredths instead of a misleading zero duration', () => {
  const exports = {}
  const source = readFileSync(new URL('../src/utils/playbackTime.ts', import.meta.url), 'utf8')
  runInNewContext(
    ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText,
    { exports },
  )
  const format = exports.formatPlaybackTime
  assert.equal(format(0, 0.261), '0:00.00')
  assert.equal(format(0.12, 0.261), '0:00.12')
  assert.equal(format(0.261, 0.261), '0:00.26')
  assert.equal(format(9.99, 9.999), '0:09.99')
  assert.equal(format(69.2, 145), '1:09')
  assert.equal(format(NaN, 0.261), '0:00.00')
})

test('repeated clicks rewind and reuse the same loaded audio', async () => {
  const { player, audios } = setup()
  player.play(sound('j'))
  audios[0].pending[0].resolve()
  await flush()
  audios[0].currentTime = 3
  player.play(sound('j'))
  assert.equal(audios.length, 1)
  assert.equal(audios[0].currentTime, 0)
  assert.equal(audios[0].loadCount, 0)
})

test('short audio advances between sparse timeupdate events using the media clock', async () => {
  const { player, audios, frames, frame } = setup()
  player.play(sound('j'))
  audios[0].metadata(0.3657)
  audios[0].pending[0].resolve()
  await flush()
  audios[0].currentTime = 0.12
  frame()
  assert.equal(player.currentTime.value, 0.12)
  assert.equal(frames.size, 1)
  player.toggle()
  assert.equal(frames.size, 0)
  frame()
  assert.equal(player.currentTime.value, 0.12)
})

test('duration corrections update the timeline and seek boundaries', () => {
  const { player, audios } = setup()
  player.play(sound('long'))
  audios[0].metadata(30)
  audios[0].duration = 45
  audios[0].ondurationchange?.()
  assert.equal(player.duration.value, 45)
  player.seek(40)
  assert.equal(audios[0].currentTime, 40)
})

test('replay resets a completed timeline immediately and stop cancels frame updates', async () => {
  const { player, audios, frames, frame } = setup()
  player.play(sound('j'))
  audios[0].metadata(0.3657)
  audios[0].pending[0].resolve()
  await flush()
  audios[0].currentTime = 0.3657
  audios[0].ended = true
  audios[0].onended()
  assert.equal(frames.size, 0)
  player.toggle()
  assert.equal(player.currentTime.value, 0)
  audios[0].pending[1].resolve()
  await flush()
  player.stop()
  frame()
  assert.equal(frames.size, 0)
  assert.equal(player.currentTime.value, 0)
})

test('an old rejection cannot overwrite the newest playing sound', async () => {
  const { player, audios } = setup()
  player.play(sound('j'))
  player.play(sound('n'))
  assert.equal(audios[0].paused, true)
  audios[1].pending[0].resolve()
  await flush()
  audios[0].pending[0].reject(new Error('Old media failed'))
  await flush()
  assert.equal(player.currentSound.value.id, 'n')
  assert.equal(player.status.value, 'playing')
  assert.equal(player.error.value, '')
})

test('stop during loading invalidates a pending play and delayed playing event', async () => {
  const { player, audios } = setup()
  player.play(sound('j'))
  player.stop()
  audios[0].pending[0].resolve()
  audios[0].onplaying()
  await flush()
  assert.equal(player.status.value, 'idle')
  assert.equal(player.currentTime.value, 0)
  assert.equal(audios[0].paused, true)
})

test('pause preserves position; resume uses the existing media element', async () => {
  const { player, audios } = setup()
  player.play(sound('long'))
  audios[0].pending[0].resolve()
  await flush()
  audios[0].currentTime = 12
  player.toggle()
  assert.equal(player.status.value, 'paused')
  player.toggle()
  audios[0].pending[1].resolve()
  await flush()
  assert.equal(player.status.value, 'playing')
  assert.equal(audios[0].currentTime, 12)
  assert.equal(audios.length, 1)
})

test('browser-initiated pause is reflected in the player', async () => {
  const { player, audios } = setup()
  player.play(sound('j'))
  audios[0].pending[0].resolve()
  await flush()
  audios[0].pause()
  assert.equal(player.status.value, 'paused')
})

test('play failures show an error and the same sound can be retried', async () => {
  const { player, audios } = setup()
  player.play(sound('j'))
  audios[0].pending[0].reject(new Error('Media unavailable'))
  await flush()
  assert.equal(player.status.value, 'error')
  assert.ok(player.error.value)
  audios[0].error = { code: 2 }
  player.play(sound('j'))
  assert.equal(audios[0].loadCount, 1)
  audios[0].pending[1].resolve()
  await flush()
  assert.equal(player.status.value, 'playing')
  assert.equal(player.error.value, '')
})

test('cache is bounded and eviction detaches and releases old audio', () => {
  const { player, audios } = setup()
  for (let index = 0; index < 12; index++) player.play(sound(String(index)))
  assert.equal(audios.filter((audio) => audio.src).length, 8)
  assert.equal(audios[0].src, '')
  assert.equal(audios[0].onplaying, null)
  assert.equal(audios[11].paused, false)
})

test('only the four short signature samples warm up after mounting', () => {
  const { audios, mount, warm } = setup()
  assert.equal(audios.length, 0)
  mount()
  assert.equal(audios.length, 0)
  warm()
  assert.equal(audios.length, 4)
  assert.ok(audios.every((audio) => audio.preload === 'auto' && audio.loadCount === 1))
})

test('data saver and slow connections do not preload audio', () => {
  for (const connection of [
    { saveData: true },
    { effectiveType: '2g' },
    { effectiveType: 'slow-2g' },
  ]) {
    const { mount, warm, audios } = setup(connection)
    mount()
    warm()
    assert.equal(audios.length, 0)
  }
})

test('seek and volume are bounded; unmount cancels pending work and frees media', async () => {
  const { player, audios, mount, unmount, timers } = setup()
  mount()
  player.play(sound('j'))
  audios[0].metadata(30)
  player.seek(100)
  assert.equal(audios[0].currentTime, 30)
  player.seek(-10)
  assert.equal(audios[0].currentTime, 0)
  player.setVolume(2)
  assert.equal(audios[0].volume, 1)
  player.setVolume(-1)
  assert.equal(audios[0].volume, 0)
  unmount()
  audios[0].pending[0].reject(new Error('Unmounted'))
  await flush()
  assert.equal(timers.size, 0)
  assert.equal(audios[0].src, '')
  assert.equal(player.error.value, '')
})
