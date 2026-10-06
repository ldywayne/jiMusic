import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
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
    mount: () => mounted.forEach((callback) => callback()),
    unmount: () => unmounted.forEach((callback) => callback()),
    warm: () => [...timers].forEach((callback) => callback()),
  }
}
const flush = async () => {
  await Promise.resolve()
  await Promise.resolve()
}

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
