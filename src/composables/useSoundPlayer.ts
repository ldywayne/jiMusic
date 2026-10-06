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

  function dispose(audio: HTMLAudioElement) {
    audio.onplaying = audio.onpause = audio.onended = audio.ontimeupdate = null
    audio.onloadedmetadata = audio.onwaiting = audio.onerror = null
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
      if (audio === active && !audio.paused) status.value = 'playing'
    }
    audio.onwaiting = () => {
      if (audio === active && !audio.paused) status.value = 'loading'
    }
    audio.onpause = () => {
      if (audio === active && audio.paused && status.value === 'playing') status.value = 'paused'
    }
    audio.onended = () => {
      if (audio === active && audio.ended) {
        status.value = 'idle'
        currentTime.value = duration.value
      }
    }
    audio.ontimeupdate = () => {
      if (audio === active) currentTime.value = audio.currentTime
    }
    audio.onloadedmetadata = () => {
      if (audio === active) duration.value = Number.isFinite(audio.duration) ? audio.duration : 0
    }
    audio.onerror = () => {
      if (audio === active && (status.value === 'loading' || status.value === 'playing')) {
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
      if (token === request) status.value = 'playing'
    } catch (cause) {
      if (token !== request) return
      if (cause instanceof DOMException && cause.name === 'AbortError') return
      status.value = 'error'
      error.value = '无法播放，请点击音效重试，或检查浏览器的声音权限。'
    }
  }

  function play(sound: Sound) {
    ++request
    active?.pause()
    const audio = getAudio(sound)
    active = audio
    currentSound.value = sound
    currentTime.value = 0
    duration.value = Number.isFinite(audio.duration) ? audio.duration : 0
    audio.volume = volume.value
    if (audio.error) audio.load()
    audio.currentTime = 0
    void start(audio)
  }

  function stop() {
    ++request
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
      active.pause()
      status.value = 'paused'
    } else {
      if (active.ended || status.value === 'idle') active.currentTime = 0
      if (active.error) active.load()
      void start(active)
    }
  }

  function setVolume(value: number) {
    volume.value = Math.min(1, Math.max(0, value))
    if (active) active.volume = volume.value
  }

  function seek(value: number) {
    if (!active || !duration.value) return
    active.currentTime = Math.min(duration.value, Math.max(0, value))
    currentTime.value = active.currentTime
  }

  onMounted(() => {
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
