<script setup lang="ts">
import AppIcon from './AppIcon.vue'
defineProps<{ playing: boolean }>()
defineEmits<{ random: [] }>()
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero-copy">
      <h1 id="hero-title">今天，听点有意思的。</h1>
      <p class="hero-description">
        经典语录、鬼畜音效、整活单曲。<br />熟悉的声音，都在你的音乐空间。
      </p>
      <button class="random-button" @click="$emit('random')">
        <AppIcon name="play" />随便听听
      </button>
    </div>
    <div class="hero-art" :class="{ playing }" aria-hidden="true">
      <div class="record">
        <div class="record-label"><AppIcon name="music" /><span>鸡乐盒</span></div>
      </div>
      <div class="record-sleeve">
        <span>快乐<br />正在发声</span><AppIcon name="headphones" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  min-height: 270px;
  padding: 36px;
  border-radius: 16px;
  background: #252629;
  color: white;
  overflow: hidden;
}
.hero-copy {
  min-width: 0;
  position: relative;
  z-index: 1;
}
.hero-copy h1 {
  font-size: clamp(30px, 3.4vw, 44px);
  font-weight: 800;
  line-height: 1.35;
  letter-spacing: -1px;
}
.hero-description {
  margin-top: 14px;
  color: #c2c3c6;
  font-size: 13px;
  line-height: 1.9;
}
.random-button {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  min-height: 44px;
  margin-top: 24px;
  padding: 11px 21px;
  border: 0;
  border-radius: 24px;
  background: var(--accent);
  color: white;
  font-size: 13px;
  font-weight: 650;
}
.random-button:hover {
  background: var(--accent-hover);
}
.random-button :deep(svg) {
  width: 17px;
  height: 17px;
  fill: currentColor;
}
.hero-art {
  position: relative;
  flex-shrink: 0;
  width: 268px;
  height: 210px;
}
.record {
  position: absolute;
  top: -10px;
  left: -12px;
  display: grid;
  place-items: center;
  width: 220px;
  height: 220px;
  border: 9px solid #121316;
  border-radius: 50%;
  background: repeating-radial-gradient(circle, #17181b 0 3px, #303136 4px 5px);
}
.record-label {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  width: 83px;
  height: 83px;
  border-radius: 50%;
  background: #e74e52;
  color: white;
}
.record-label span {
  font-size: 10px;
  letter-spacing: 2px;
}
.record-label :deep(svg) {
  width: 26px;
  height: 26px;
}
.playing .record {
  animation: spin 8s linear infinite;
}
.record-sleeve {
  position: absolute;
  right: -4px;
  bottom: 1px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 118px;
  height: 150px;
  padding: 18px;
  border-radius: 5px;
  background: #ead9c9;
  color: #39302c;
  transform: rotate(9deg);
  box-shadow: -10px 8px 24px #00000035;
}
.record-sleeve span {
  font-size: 22px;
  font-weight: 800;
  line-height: 1.4;
}
.record-sleeve :deep(svg) {
  width: 22px;
  height: 22px;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@media (max-width: 1100px) {
  .hero-art {
    width: 215px;
    transform: scale(0.85);
  }
}
@media (max-width: 700px) {
  .hero {
    min-height: 240px;
    padding: 26px;
  }
  .hero-art {
    display: none;
  }
  .hero-copy h1 {
    font-size: clamp(28px, 7.3vw, 36px);
  }
  .hero-description {
    font-size: 12px;
  }
  .random-button {
    margin-top: 20px;
  }
}
@media (max-width: 360px) {
  .hero {
    padding: 24px 20px;
  }
}
</style>
