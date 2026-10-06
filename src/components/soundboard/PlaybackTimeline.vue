<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'
import { formatPlaybackTime } from '@/utils/playbackTime'

const props = defineProps<{
  currentTime: number
  duration: number
  disabled: boolean
  soundId?: string
}>()
const emit = defineEmits<{ seek: [value: number] }>()
const previewTime = shallowRef<number | null>(null)
const displayedTime = computed(() => previewTime.value ?? props.currentTime)
const elapsedLabel = computed(() => formatPlaybackTime(displayedTime.value, props.duration))
const durationLabel = computed(() =>
  props.duration > 0 ? formatPlaybackTime(props.duration, props.duration) : '—:—',
)
const progressStyle = computed(() => ({
  '--progress': `${props.duration > 0 ? Math.min(100, Math.max(0, (displayedTime.value / props.duration) * 100)) : 0}%`,
}))
function seek(event: Event) {
  const value = Number((event.target as HTMLInputElement).value)
  if (previewTime.value !== null) previewTime.value = value
  emit('seek', value)
}
function finishPreview() {
  previewTime.value = null
}
watch(() => props.soundId, finishPreview)
watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) finishPreview()
  },
)
</script>

<template>
  <div class="timeline">
    <span class="time-label">{{ elapsedLabel }}</span>
    <input
      class="progress-slider"
      type="range"
      min="0"
      :max="duration || 1"
      step="any"
      :value="displayedTime"
      :style="progressStyle"
      :disabled="disabled || !duration"
      :aria-valuetext="`${elapsedLabel} / ${durationLabel}`"
      aria-label="播放进度"
      @pointerdown="previewTime = currentTime"
      @input="seek"
      @change="finishPreview"
      @pointerup="finishPreview"
      @pointercancel="finishPreview"
      @blur="finishPreview"
    />
    <span class="time-label">{{ durationLabel }}</span>
  </div>
</template>

<style scoped>
.timeline {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  width: 100%;
}
.time-label {
  flex-shrink: 0;
  color: var(--muted);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
}
.progress-slider {
  appearance: none;
  background: transparent;
  width: 100%;
  min-width: 30px;
  height: 24px;
  margin: 0;
  cursor: pointer;
}
.progress-slider::-webkit-slider-runnable-track {
  height: 4px;
  border-radius: 4px;
  background: linear-gradient(to right, var(--accent) var(--progress), #e5e5e8 var(--progress));
}
.progress-slider::-moz-range-track {
  height: 4px;
  border-radius: 4px;
  background: linear-gradient(to right, var(--accent) var(--progress), #e5e5e8 var(--progress));
}
.progress-slider::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  margin-top: -4px;
  border: 2px solid white;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 1px #d9d9dd;
}
.progress-slider::-moz-range-thumb {
  width: 8px;
  height: 8px;
  border: 2px solid white;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 1px #d9d9dd;
}
.progress-slider:disabled {
  cursor: default;
  opacity: 0.5;
}
</style>
