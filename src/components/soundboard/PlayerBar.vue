<script setup lang="ts">
import { computed } from 'vue'
import type { Sound } from '@/data/sounds'
import type { PlaybackStatus } from '@/composables/useSoundPlayer'
import AppIcon from './AppIcon.vue'
import PlaybackTimeline from './PlaybackTimeline.vue'

const props = defineProps<{
  sound: Sound | null
  status: PlaybackStatus
  currentTime: number
  duration: number
  volume: number
  error: string
}>()
defineEmits<{ toggle: []; stop: []; seek: [value: number]; volume: [value: number]; random: [] }>()
const statusText = computed(
  () =>
    ({
      idle: props.sound ? '播放已结束 / 已停止' : '选择一个声音开始播放',
      loading: '正在加载…',
      playing: '正在播放',
      paused: '已暂停',
      error: '播放失败，点击重试',
    })[props.status],
)
const isActive = computed(() => props.status === 'playing' || props.status === 'loading')
function inputNumber(event: Event) {
  return Number((event.target as HTMLInputElement).value)
}
</script>

<template>
  <aside
    class="player-shell"
    :class="{ 'is-playing': status === 'playing' }"
    aria-label="音效播放器"
  >
    <p v-if="error" class="playback-error" role="alert">{{ error }}</p>
    <div class="player">
      <div class="now-playing">
        <span class="album-art"><AppIcon name="music" /></span>
        <div class="track-text">
          <strong>{{ sound?.name ?? '鸡乐盒' }}</strong
          ><span role="status">{{ statusText }}</span>
        </div>
      </div>
      <div class="playback-controls">
        <div class="transport">
          <button
            class="secondary-button"
            :disabled="!sound"
            aria-label="停止播放"
            @click="$emit('stop')"
          >
            <AppIcon name="stop" />
          </button>
          <button
            class="play-button"
            :disabled="!sound"
            :aria-label="isActive ? '暂停播放' : status === 'error' ? '重试播放' : '播放'"
            @click="$emit('toggle')"
          >
            <AppIcon :name="isActive ? 'pause' : 'play'" />
          </button>
          <button class="secondary-button" aria-label="随机播放" @click="$emit('random')">
            <AppIcon name="shuffle" />
          </button>
        </div>
        <PlaybackTimeline
          :current-time="currentTime"
          :duration="duration"
          :disabled="status === 'error'"
          :sound-id="sound?.id"
          @seek="$emit('seek', $event)"
        />
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
  border-top: 1px solid var(--line);
  background: var(--surface);
  padding-bottom: env(safe-area-inset-bottom);
}
.player {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(220px, 480px) minmax(100px, 1fr);
  align-items: center;
  gap: 28px;
  min-height: 90px;
  padding: 10px 28px;
}
.now-playing {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.album-art {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 9px;
  background: #f1ded9;
  color: #95645b;
}
.is-playing .album-art {
  background: var(--accent-soft);
  color: var(--accent);
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 11px;
  color: var(--muted);
}
.is-playing .track-text span {
  color: var(--accent);
}
.playback-controls {
  min-width: 0;
}
.transport {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 4px;
}
.play-button,
.secondary-button {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border: 0;
  border-radius: 50%;
}
.play-button {
  width: 36px;
  height: 36px;
  background: var(--accent);
  color: white;
}
.play-button:hover:not(:disabled) {
  background: var(--accent-hover);
}
.play-button :deep(svg) {
  width: 18px;
  height: 18px;
}
.secondary-button {
  width: 32px;
  height: 32px;
  background: transparent;
  color: #62636d;
}
.secondary-button:hover:not(:disabled) {
  color: var(--accent);
  background: var(--accent-soft);
}
.secondary-button :deep(svg) {
  width: 16px;
  height: 16px;
}
.volume-control {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
}
.volume-control :deep(svg) {
  width: 17px;
  height: 17px;
  color: var(--muted);
}
.volume-control input {
  width: 84px;
  accent-color: var(--accent);
  height: 24px;
  cursor: pointer;
}
.playback-error {
  padding: 8px 20px;
  background: #fff0ee;
  color: #a63b3b;
  font-size: 12px;
  text-align: center;
}
@media (max-width: 1000px) {
  .player {
    grid-template-columns: minmax(0, 210px) minmax(180px, 1fr) 100px;
    gap: 20px;
    padding: 10px 20px;
  }
}
@media (max-width: 600px) {
  .player {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 10px 16px 6px;
  }
  .now-playing {
    flex: 1;
    padding-right: 120px;
  }
  .album-art {
    width: 40px;
    height: 40px;
  }
  .playback-controls {
    width: 100%;
  }
  .transport {
    position: absolute;
    top: 12px;
    right: 12px;
    gap: 5px;
    margin: 0;
  }
  .play-button {
    width: 36px;
    height: 36px;
  }
  .volume-control {
    display: none;
  }
}
</style>
