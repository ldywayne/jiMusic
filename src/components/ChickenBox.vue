<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { featuredSounds, sounds } from '@/data/sounds'
import { useSoundPlayer } from '@/composables/useSoundPlayer'
import SoundPad from './soundboard/SoundPad.vue'
import SoundLibrary from './soundboard/SoundLibrary.vue'
import PlayerBar from './soundboard/PlayerBar.vue'
import SoundHero from './soundboard/SoundHero.vue'

const {
  currentSound,
  status,
  currentTime,
  duration,
  volume,
  error,
  play,
  stop,
  toggle,
  setVolume,
  seek,
} = useSoundPlayer()

function playRandom() {
  const candidates = sounds.filter((sound) => sound.id !== currentSound.value?.id)
  const sound = candidates[Math.floor(Math.random() * candidates.length)]
  if (sound) play(sound)
}
function onKeydown(event: KeyboardEvent) {
  const target = event.target
  if (
    event.repeat ||
    event.ctrlKey ||
    event.altKey ||
    event.metaKey ||
    (target instanceof HTMLElement && target.closest('input, textarea, select, [contenteditable]'))
  )
    return
  const sound = featuredSounds.find((item) => item.shortcut === event.key)
  if (sound) {
    event.preventDefault()
    play(sound)
  } else if (event.code === 'Space' && currentSound.value) {
    // Space keeps its native activation behavior on focused buttons and links.
    if (target instanceof HTMLElement && target.closest('button, a')) return
    event.preventDefault()
    toggle()
  } else if (event.key === 'Escape') stop()
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="soundboard">
    <SoundHero :playing="status === 'playing'" @random="playRandom" />
    <section id="signature-section" class="signature-section" aria-labelledby="signature-title">
      <div class="section-heading">
        <h2 id="signature-title">经典四连</h2>
        <span class="keyboard-tip"
          >键盘 <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> <kbd>4</kbd>，快乐即刻开场</span
        ><span class="mobile-tip">点击即播，再点重播</span>
      </div>
      <div class="signature-grid">
        <SoundPad
          v-for="sound in featuredSounds"
          :key="sound.id"
          :sound="sound"
          featured
          :active="currentSound?.id === sound.id"
          :playing="status === 'playing' && currentSound?.id === sound.id"
          @play="play"
        />
      </div>
    </section>
    <SoundLibrary :active-id="currentSound?.id" :playing="status === 'playing'" @play="play" />
    <p class="board-note">快乐可以很简单。<span>空格暂停 / 继续，Esc 停止播放</span></p>
    <PlayerBar
      :sound="currentSound"
      :status="status"
      :current-time="currentTime"
      :duration="duration"
      :volume="volume"
      :error="error"
      @toggle="toggle"
      @stop="stop"
      @volume="setVolume"
      @seek="seek"
      @random="playRandom"
    />
  </div>
</template>

<style scoped>
.signature-section {
  margin-top: 32px;
}
.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}
.section-heading h2 {
  font-size: 20px;
  font-weight: 750;
  letter-spacing: -0.5px;
}
.keyboard-tip {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--muted);
  font-size: 12px;
}
.keyboard-tip kbd {
  display: grid;
  place-items: center;
  width: 23px;
  height: 24px;
  border: 1px solid #d8deeb;
  border-bottom-width: 2px;
  border-radius: 5px;
  background: var(--surface);
  font-family: inherit;
}
.mobile-tip {
  display: none;
  font-size: 11px;
  color: var(--muted);
}
.signature-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}
.board-note {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 32px;
  padding: 22px 0;
  border-top: 1px solid var(--line);
  color: var(--muted);
  font-size: 12px;
}
@media (max-width: 700px) {
  .signature-section {
    margin-top: 26px;
  }
  .keyboard-tip {
    display: none;
  }
  .mobile-tip {
    display: block;
  }
  .signature-grid {
    gap: 10px;
  }
  .board-note span {
    display: none;
  }
}
@media (max-width: 360px) {
  .signature-grid {
    gap: 7px;
  }
}
</style>
