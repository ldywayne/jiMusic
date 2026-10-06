<script setup lang="ts">
import { computed } from 'vue'
import type { Sound } from '@/data/sounds'
import type { PlaybackStatus } from '@/composables/useSoundPlayer'
import AppIcon from './AppIcon.vue'
const props = defineProps<{
  sound: Sound | null
  status: PlaybackStatus
  currentTime: number
  duration: number
  volume: number
  error: string
}>()
defineEmits<{ toggle: []; stop: []; seek: [value: number]; volume: [value: number] }>()
const statusText = computed(
  () =>
    ({
      idle: props.sound ? '播放已结束 / 已停止' : '点击一个音效，开始快乐',
      loading: '正在加载…',
      playing: '正在播放',
      paused: '已暂停',
      error: '播放失败，点击重试',
    })[props.status],
)
const isActive = computed(() => props.status === 'playing' || props.status === 'loading')
function formatTime(seconds: number) {
  const value = Math.max(0, Math.floor(seconds))
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`
}
function inputNumber(event: Event) {
  return Number((event.target as HTMLInputElement).value)
}
</script>

<template>
  <aside class="player-shell" aria-label="音效播放器">
    <p v-if="error" class="playback-error" role="alert">{{ error }}</p>
    <div class="player">
      <div class="now-playing">
        <span class="album-art"><AppIcon name="music" /></span>
        <div class="track-text">
          <strong>{{ sound?.name ?? '还没选好？随便听听' }}</strong
          ><span role="status">{{ statusText }}</span>
        </div>
      </div>
      <div class="transport">
        <button
          class="play-button"
          :disabled="!sound"
          :aria-label="isActive ? '暂停播放' : '继续播放'"
          @click="$emit('toggle')"
        >
          <AppIcon :name="isActive ? 'pause' : 'play'" />
        </button>
        <button class="stop-button" :disabled="!sound" aria-label="停止播放" @click="$emit('stop')">
          <AppIcon name="stop" />
        </button>
      </div>
      <div class="timeline">
        <span>{{ formatTime(currentTime) }}</span
        ><input
          type="range"
          min="0"
          :max="duration || 1"
          step="0.1"
          :value="currentTime"
          :disabled="!duration || status === 'error'"
          aria-label="播放进度"
          @input="$emit('seek', inputNumber($event))"
        /><span>{{ formatTime(duration) }}</span>
      </div>
      <div class="volume-control">
        <AppIcon name="volume" /><input
          type="range"
          min="0"
          max="1"
          step="0.01"
          :value="volume"
          aria-label="音量"
          @input="$emit('volume', inputNumber($event))"
        />
      </div>
    </div>
  </aside>
</template>

<style scoped>
.player-shell {
  position: fixed;
  z-index: 5;
  inset: auto 0 0;
  background: #ffffff;
  border-top: 1px solid var(--line);
  box-shadow: 0 -4px 25px #30204a05;
  padding-bottom: env(safe-area-inset-bottom);
}
.player {
  max-width: 1180px;
  margin: auto;
  padding: 17px 32px;
  display: flex;
  align-items: center;
  gap: 24px;
}
.now-playing {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 260px;
  min-width: 0;
}
.album-art {
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  background: #eee8fc;
  border-radius: 11px;
  color: var(--accent);
  display: grid;
  place-items: center;
}
.track-text {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}
.track-text strong {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 13px;
  font-weight: 650;
}
.track-text span {
  font-size: 11px;
  color: var(--muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.transport {
  display: flex;
  align-items: center;
  gap: 12px;
}
.play-button,
.stop-button {
  width: 40px;
  height: 40px;
  border: 0;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border-radius: 50%;
}
.play-button {
  background: var(--accent);
  color: white;
}
.stop-button {
  background: #f4f3f8;
  color: #747080;
}
.stop-button :deep(svg) {
  width: 15px;
  height: 15px;
}
.timeline {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}
.timeline span {
  font-size: 10px;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}
.timeline input {
  width: 100%;
  min-width: 40px;
}
.volume-control {
  display: flex;
  align-items: center;
  gap: 11px;
  width: 125px;
}
.volume-control :deep(svg) {
  width: 17px;
  height: 17px;
  color: #807b91;
}
.volume-control input {
  width: 85px;
}
input[type='range'] {
  accent-color: var(--accent);
  height: 24px;
  cursor: pointer;
}
.playback-error {
  padding: 10px 20px;
  text-align: center;
  color: #a63b3b;
  background: #fff0ee;
  font-size: 12px;
}
@media (max-width: 850px) {
  .player {
    gap: 15px;
  }
  .now-playing {
    width: 210px;
  }
  .volume-control {
    display: none;
  }
}
@media (max-width: 600px) {
  .player {
    padding: 12px 20px 8px;
    flex-wrap: wrap;
    gap: 8px;
  }
  .now-playing {
    flex: 1;
  }
  .transport {
    gap: 10px;
  }
  .timeline {
    flex-basis: 100%;
    gap: 10px;
  }
  .album-art {
    width: 38px;
    height: 38px;
  }
}
</style>
