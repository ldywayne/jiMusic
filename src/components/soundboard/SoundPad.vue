<script setup lang="ts">
import AppIcon from './AppIcon.vue'
import type { Sound } from '@/data/sounds'
defineProps<{
  sound: Sound
  active: boolean
  playing: boolean
  favorite?: boolean
  featured?: boolean
}>()
defineEmits<{ play: [sound: Sound]; favorite: [id: string] }>()
</script>

<template>
  <div
    class="sound-pad"
    :class="[
      { active, featured, playing: active && playing },
      sound.category === '鬼畜音效' ? 'mint' : sound.category === '整活单曲' ? 'lavender' : 'peach',
    ]"
  >
    <button
      class="pad-trigger"
      :aria-label="`播放 ${sound.name}`"
      :aria-pressed="active"
      @click="$emit('play', sound)"
    >
      <template v-if="featured">
        <span class="pad-key">{{ sound.shortcut }}</span>
        <span class="signature">{{ sound.name }}</span>
        <span class="pad-caption"
          >{{ active && playing ? '正在播放' : '点击播放'
          }}<AppIcon :name="active && playing ? 'volume' : 'play'"
        /></span>
      </template>
      <template v-else>
        <span class="sound-cover">
          <span class="cover-stamp">{{ sound.category }}</span>
          <span class="cover-record"
            ><span class="cover-monogram">{{ sound.name.slice(0, 2) }}</span></span
          >
          <span class="cover-play"><AppIcon :name="active && playing ? 'volume' : 'play'" /></span>
        </span>
        <span class="sound-name" :title="sound.name">{{ sound.name }}</span>
        <span class="sound-category">{{ active && playing ? '正在播放' : sound.category }}</span>
      </template>
    </button>
    <button
      v-if="!featured"
      class="favorite-button"
      :class="{ saved: favorite }"
      :aria-label="`${favorite ? '取消收藏' : '收藏'} ${sound.name}`"
      :aria-pressed="!!favorite"
      @click="$emit('favorite', sound.id)"
    >
      <AppIcon name="heart" />
    </button>
  </div>
</template>

<style scoped>
.sound-pad {
  --cover-tint: #f0d9d0;
  --cover-ink: #845d50;
  position: relative;
  min-width: 0;
}
.sound-pad.mint {
  --cover-tint: #cde8e5;
  --cover-ink: #3f706b;
}
.sound-pad.lavender {
  --cover-tint: #dfdced;
  --cover-ink: #6c6185;
}
.pad-trigger {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 0 0 4px;
  border: 0;
  background: transparent;
  text-align: left;
  border-radius: 10px;
}
.sound-cover {
  position: relative;
  display: grid;
  place-items: center;
  width: 100%;
  aspect-ratio: 1.3;
  border-radius: 12px;
  background: var(--cover-tint);
  overflow: hidden;
}
.cover-stamp {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 1;
  color: var(--cover-ink);
  font-size: 10px;
  font-weight: 650;
}
.cover-record {
  display: grid;
  place-items: center;
  width: 69%;
  aspect-ratio: 1;
  margin-top: 16%;
  border: 5px solid #2d2d31;
  border-radius: 50%;
  background: repeating-radial-gradient(circle, #2d2d31 0 2px, #444449 3px 4px);
  transform: rotate(-12deg);
}
.cover-monogram {
  display: grid;
  place-items: center;
  width: 48%;
  aspect-ratio: 1;
  padding: 4px;
  border-radius: 50%;
  background: var(--cover-tint);
  color: var(--cover-ink);
  font-size: clamp(14px, 1.6vw, 21px);
  font-weight: 800;
  white-space: nowrap;
}
.cover-play {
  position: absolute;
  right: 10px;
  bottom: 10px;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: var(--accent);
  background: white;
}
.cover-play :deep(svg) {
  width: 16px;
  height: 16px;
}
.sound-name {
  max-width: 100%;
  margin-top: 11px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
}
.sound-category {
  margin-top: 3px;
  color: var(--muted);
  font-size: 11px;
}
.sound-pad.active .sound-cover {
  box-shadow: inset 0 0 0 2px var(--accent);
}
.sound-pad.active .sound-name,
.playing .sound-category {
  color: var(--accent);
}
.pad-trigger:hover .sound-name {
  color: var(--accent);
}
.playing .cover-play {
  color: white;
  background: var(--accent);
}
.favorite-button {
  position: absolute;
  top: 4px;
  right: 4px;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--cover-ink);
}
.favorite-button :deep(svg) {
  width: 16px;
  height: 16px;
}
.favorite-button:hover,
.favorite-button.saved {
  color: var(--accent);
  background: #ffffffc7;
}
.favorite-button.saved :deep(path) {
  fill: var(--accent);
}
.featured {
  border: 1px solid var(--line);
  border-radius: 12px;
  background: #f9f9fb;
}
.featured .pad-trigger {
  position: relative;
  height: 126px;
  padding: 16px 20px;
  border-radius: inherit;
}
.featured:hover {
  border-color: #e4bfc2;
}
.featured.active {
  border-color: var(--accent);
  background: var(--accent-soft);
}
.pad-key {
  position: absolute;
  top: 14px;
  right: 16px;
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border: 1px solid #e5e5e9;
  border-radius: 5px;
  background: white;
  color: var(--muted);
  font-size: 11px;
}
.signature {
  font-size: 44px;
  font-weight: 800;
  line-height: 1.3;
}
.pad-caption {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: auto;
  color: var(--muted);
  font-size: 11px;
  white-space: nowrap;
}
.pad-caption :deep(svg) {
  width: 14px;
  height: 14px;
}
.featured.active .signature,
.featured.active .pad-caption {
  color: var(--accent);
}
@media (max-width: 700px) {
  .featured .pad-trigger {
    height: 112px;
    padding: 12px 14px;
  }
  .signature {
    font-size: 38px;
  }
  .pad-key {
    top: 9px;
    right: 9px;
    width: 18px;
    height: 18px;
    font-size: 10px;
  }
  .pad-caption {
    font-size: 10px;
  }
}
@media (max-width: 420px) {
  .featured .pad-trigger {
    height: 106px;
    padding: 10px;
  }
  .pad-key {
    position: static;
    width: 16px;
    height: 16px;
    font-size: 9px;
  }
  .signature {
    font-size: 33px;
    line-height: 1.3;
  }
  .pad-caption :deep(svg) {
    display: none;
  }
  .cover-stamp {
    top: 10px;
    left: 10px;
  }
  .sound-name {
    font-size: 13px;
  }
}
</style>
