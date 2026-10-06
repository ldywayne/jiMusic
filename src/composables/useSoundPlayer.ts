import { onMounted, onUnmounted, readonly, shallowRef } from 'vue'
import { featuredSounds, type Sound } from '@/data/sounds'

export type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error'

export function useSoundPlayer() {
  const currentSound = shallowRef<Sound | null>(null)
  const status = shallowRef<PlaybackStatus>('idle')
  const currentTime = shallowRef(0)
  const duration = shallowRef(0)
  const volume = shallowRef(0.8)
  const error = shallowRef('')
  const cache = new Map<string, HTMLAudioElement>()
  let active: HTMLAudioElement | null = null
  let request = 0
  let warmupTimer: ReturnType<typeof setTimeout> | undefined
  let progressFrame: number | undefined

  function cancelProgress() {
    if (progressFrame !== undefined) cancelAnimationFrame(progressFrame)
    progressFrame = undefined
  }

  function syncTimeline(audio: HTMLAudioElement) {
    if (audio !== active) return
    duration.value = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 0
    const time = Number.isFinite(audio.currentTime) ? Math.max(0, audio.currentTime) : 0
    currentTime.value = duration.value ? Math.min(time, duration.value) : time
  }

  function trackProgress(audio: HTMLAudioElement) {
    cancelProgress()
    // Read the media clock; never estimate elapsed playback from wall-clock time.
    const tick = () => {
      progressFrame = undefined
      if (audio !== active || audio.paused || audio.ended || status.value !== 'playing') return
      syncTimeline(audio)
      if (!document.hidden) progressFrame = requestAnimationFrame(tick)
    }
    tick()
  }

  function onVisibilityChange() {
    if (!active) return
    syncTimeline(active)
    if (document.hidden) cancelProgress()
    else if (status.value === 'playing') trackProgress(active)
  }

  function dispose(audio: HTMLAudioElement) {
    audio.onplaying = audio.onpause = audio.onended = audio.ontimeupdate = null
    audio.onloadedmetadata = audio.ondurationchange = audio.onwaiting = audio.onerror = null
    audio.onseeking = audio.onseeked = null
    audio.pause()
    audio.removeAttribute('src')
    audio.load()
  }

  function getAudio(sound: Sound) {
    const existing = cache.get(sound.id)
    if (existing) {
      cache.delete(sound.id)
      cache.set(sound.id, existing)
      return existing
    }
    // Keep only eight native elements. Long tracks load on demand.
    if (cache.size >= 8) {
      for (const [id, audio] of cache) {
        if (audio !== active) {
          dispose(audio)
          cache.delete(id)
          break
        }
      }
    }
    const audio = new Audio()
    audio.preload = 'none'
    audio.src = sound.url
    audio.volume = volume.value
    audio.onplaying = () => {
      if (audio === active && !audio.paused && !audio.ended) {
        status.value = 'playing'
        trackProgress(audio)
      }
    }
    audio.onwaiting = () => {
      if (audio === active && !audio.paused) {
        cancelProgress()
        syncTimeline(audio)
        status.value = 'loading'
      }
    }
    audio.onpause = () => {
      if (audio === active && audio.paused) {
        cancelProgress()
        syncTimeline(audio)
        if (status.value === 'playing' || status.value === 'loading') status.value = 'paused'
      }
    }
    audio.onended = () => {
      if (audio === active && audio.ended) {
        cancelProgress()
        syncTimeline(audio)
        status.value = 'idle'
        currentTime.value = duration.value || currentTime.value
      }
    }
    audio.ontimeupdate = () => {
      syncTimeline(audio)
    }
    audio.onloadedmetadata = () => {
      syncTimeline(audio)
    }
    audio.ondurationchange = () => syncTimeline(audio)
    audio.onseeking = () => {
      if (audio !== active) return
      cancelProgress()
      syncTimeline(audio)
    }
    audio.onseeked = () => {
      if (audio !== active) return
      syncTimeline(audio)
      if (!audio.paused && status.value === 'playing') trackProgress(audio)
    }
    audio.onerror = () => {
      if (audio === active && (status.value === 'loading' || status.value === 'playing')) {
        cancelProgress()
        status.value = 'error'
        error.value = '音频加载失败，请检查网络后点击重试。'
      }
    }
    cache.set(sound.id, audio)
    return audio
  }

  async function start(audio: HTMLAudioElement) {
    const token = ++request
    error.value = ''
    status.value = 'loading'
    try {
      await audio.play()
      if (token === request && audio === active && !audio.paused && !audio.ended) {
        status.value = 'playing'
        trackProgress(audio)
      }
    } catch (cause) {
      if (token !== request) return
      if (cause instanceof DOMException && cause.name === 'AbortError') return
      cancelProgress()
      status.value = 'error'
      error.value = '无法播放，请点击音效重试，或检查浏览器的声音权限。'
    }
  }

  function play(sound: Sound) {
    ++request
    cancelProgress()
    active?.pause()
    const audio = getAudio(sound)
    active = audio
    currentSound.value = sound
    currentTime.value = 0
    duration.value = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 0
    audio.volume = volume.value
    if (audio.error) audio.load()
    audio.currentTime = 0
    void start(audio)
  }

  function stop() {
    ++request
    cancelProgress()
    active?.pause()
    if (active) active.currentTime = 0
    currentTime.value = 0
    status.value = 'idle'
    error.value = ''
  }

  function toggle() {
    if (!active) return
    if (status.value === 'playing' || status.value === 'loading') {
      ++request
      cancelProgress()
      active.pause()
      syncTimeline(active)
      status.value = 'paused'
    } else {
      if (active.ended || status.value === 'idle') {
        active.currentTime = 0
        currentTime.value = 0
      }
      if (active.error) active.load()
      void start(active)
    }
  }

  function setVolume(value: number) {
    if (!Number.isFinite(value)) return
    volume.value = Math.min(1, Math.max(0, value))
    if (active) active.volume = volume.value
  }

  function seek(value: number) {
    if (!active || !duration.value || !Number.isFinite(value)) return
    active.currentTime = Math.min(duration.value, Math.max(0, value))
    currentTime.value = active.currentTime
  }

  onMounted(() => {
    document.addEventListener('visibilitychange', onVisibilityChange)
    // Only warm the four short signature samples, after the first render.
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
    ).connection
    if (connection?.saveData || ['slow-2g', '2g'].includes(connection?.effectiveType ?? '')) return
    warmupTimer = setTimeout(() => {
      featuredSounds.forEach((sound) => {
        const audio = getAudio(sound)
        if (audio !== active) {
          audio.preload = 'auto'
          audio.load()
        }
      })
    }, 1200)
  })

  onUnmounted(() => {
    ++request
    cancelProgress()
    document.removeEventListener('visibilitychange', onVisibilityChange)
    clearTimeout(warmupTimer)
    active = null
    cache.forEach(dispose)
    cache.clear()
  })

  return {
    currentSound: readonly(currentSound),
    status: readonly(status),
    currentTime: readonly(currentTime),
    duration: readonly(duration),
    volume: readonly(volume),
    error: readonly(error),
    play,
    stop,
    toggle,
    setVolume,
    seek,
  }
}
