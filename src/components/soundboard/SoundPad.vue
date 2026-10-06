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
      { active, featured },
      sound.category === '鬼畜音效' ? 'mint' : sound.category === '整活单曲' ? 'peach' : 'lavender',
    ]"
  >
    <button
      class="pad-trigger"
      :aria-label="`播放 ${sound.name}`"
      :aria-pressed="active"
      @click="$emit('play', sound)"
    >
      <template v-if="featured">
        <span class="pad-key">{{ sound.shortcut }}</span
        ><span class="signature">{{ sound.name }}</span>
        <span class="pad-caption"
          >{{ active && playing ? '正在播放' : '点击播放'
          }}<AppIcon :name="active && playing ? 'volume' : 'play'"
        /></span>
      </template>
      <template v-else>
        <span class="sound-symbol"
          ><AppIcon
            :name="active && playing ? 'volume' : sound.category === '整活单曲' ? 'music' : 'play'"
        /></span>
        <span class="sound-name">{{ sound.name }}</span
        ><span class="sound-category">{{ active && playing ? '正在播放' : sound.category }}</span>
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
  position: relative;
  min-width: 0;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: white;
  transition:
    border-color 120ms,
    background-color 120ms;
}
.sound-pad:hover {
  border-color: #b4a6e7;
}
.sound-pad.active {
  border-color: var(--accent);
  background: #f4f1ff;
  box-shadow: inset 0 0 0 1px var(--accent);
}
.pad-trigger {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  height: 140px;
  padding: 18px;
  border: 0;
  background: transparent;
  text-align: left;
  border-radius: inherit;
}
.sound-symbol {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  color: #7660bf;
  background: #f0ebfc;
  margin-bottom: 13px;
}
.mint .sound-symbol {
  color: #37886d;
  background: #e8f5ef;
}
.peach .sound-symbol {
  color: #b56642;
  background: #fff0e8;
}
.sound-name {
  max-width: 100%;
  font-size: 15px;
  font-weight: 650;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sound-category {
  margin-top: 5px;
  font-size: 11px;
  color: var(--muted);
}
.favorite-button {
  position: absolute;
  top: 9px;
  right: 9px;
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  background: transparent;
  color: #9b9cac;
  border: 0;
  border-radius: 8px;
}
.favorite-button :deep(svg) {
  width: 16px;
  height: 16px;
}
.favorite-button:hover,
.favorite-button.saved {
  color: var(--accent);
  background: #f4f1ff;
}
.favorite-button.saved :deep(path) {
  fill: #e2d9ff;
}
.featured {
  background: #eee9fb;
  border-color: transparent;
}
.featured:nth-child(2) {
  background: #e6edf9;
}
.featured:nth-child(3) {
  background: #e5f2ed;
}
.featured:nth-child(4) {
  background: #fbece3;
}
.featured .pad-trigger {
  height: 160px;
  padding: 18px 22px;
}
.pad-key {
  display: grid;
  place-items: center;
  width: 23px;
  height: 23px;
  border-radius: 5px;
  border: 1px solid #ffffffb3;
  font-size: 11px;
  color: #64657b;
}
.signature {
  align-self: center;
  font-size: 56px;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -3px;
}
.pad-caption {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 11px;
  color: #6d6c80;
  white-space: nowrap;
}
.pad-caption :deep(svg) {
  width: 14px;
  height: 14px;
}
.featured.active {
  border-color: var(--accent);
}
@media (max-width: 600px) {
  .pad-trigger {
    height: 130px;
    padding: 15px;
  }
  .featured .pad-trigger {
    height: 138px;
    padding: 12px;
  }
  .signature {
    font-size: 43px;
  }
  .pad-caption {
    font-size: 10px;
  }
}
@media (max-width: 420px) {
  .featured .pad-trigger {
    padding: 9px;
  }
  .pad-caption {
    font-size: 10px;
  }
  .pad-caption :deep(svg) {
    display: none;
  }
}
</style>
