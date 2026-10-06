<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { featuredSounds, sounds } from '@/data/sounds'
import { useSoundPlayer } from '@/composables/useSoundPlayer'
import SoundPad from './soundboard/SoundPad.vue'
import SoundLibrary from './soundboard/SoundLibrary.vue'
import PlayerBar from './soundboard/PlayerBar.vue'
import AppIcon from './soundboard/AppIcon.vue'

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
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-copy">
        <span class="welcome"><span class="welcome-dot"></span>你的快乐，随时在线</span>
        <h1 id="hero-title">把快乐，按出来。</h1>
        <p class="hero-description">熟悉的声音，全新的快乐。<br />点一下，给生活加点 BGM。</p>
        <button class="random-button" @click="playRandom">
          <AppIcon name="shuffle" />随便听听
        </button>
      </div>
      <div class="hero-art" aria-hidden="true">
        <span class="art-note note-one">♪</span><span class="art-note note-two">♫</span>
        <div class="record-sleeve">
          <div class="record">
            <div class="record-label"><AppIcon name="music" /></div>
          </div>
          <span class="sleeve-label">快乐制造机</span>
          <div class="sleeve-stripes"><i></i><i></i><i></i><i></i><i></i></div>
        </div>
        <span class="art-caption">生活需要一点节奏</span>
      </div>
    </section>
    <section class="signature-section" aria-labelledby="signature-title">
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
    />
  </div>
</template>

<style scoped>
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 34px 28px 0;
  min-height: 250px;
}
.welcome {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #727186;
}
.welcome-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #8774c9;
}
.hero-copy h1 {
  margin: 18px 0 15px;
  font-size: clamp(30px, 4vw, 48px);
  font-weight: 800;
  letter-spacing: -1.8px;
  line-height: 1.25;
}
.hero-description {
  color: #858193;
  font-size: 14px;
  line-height: 1.9;
}
.random-button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: white;
  background: var(--accent);
  border: 0;
  border-radius: 10px;
  padding: 13px 21px;
  margin-top: 22px;
  font-size: 13px;
  font-weight: 600;
}
.random-button:hover {
  background: #5645af;
}
.random-button :deep(svg) {
  width: 17px;
  height: 17px;
}
.hero-art {
  width: 320px;
  height: 220px;
  position: relative;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.record-sleeve {
  width: 194px;
  height: 202px;
  position: relative;
  background: #b9ace9;
  border: 5px solid #c8bdef;
  border-radius: 16px;
  transform: rotate(10deg);
  box-shadow:
    12px 18px 0 #e8e3f6,
    0 18px 25px #5949811a;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.record {
  width: 132px;
  height: 132px;
  border-radius: 50%;
  background: repeating-radial-gradient(circle, #39344b 0 2px, #494258 3px 4px);
  display: grid;
  place-items: center;
  border: 6px solid #39344b;
}
.record-label {
  border: 4px solid #39344b;
  display: grid;
  place-items: center;
  width: 54px;
  height: 54px;
  background: #f5e4bc;
  border-radius: 50%;
  color: #5d5266;
}
.record-label :deep(svg) {
  width: 21px;
  height: 21px;
}
.sleeve-label {
  font-size: 9px;
  font-weight: 700;
  color: #504563;
  margin-top: 11px;
  letter-spacing: 3px;
}
.sleeve-stripes {
  position: absolute;
  right: 11px;
  top: 9px;
  display: flex;
  gap: 3px;
  align-items: flex-end;
  height: 13px;
}
.sleeve-stripes i {
  width: 2px;
  height: 7px;
  background: #7f70ad;
}
.sleeve-stripes i:nth-child(2),
.sleeve-stripes i:nth-child(4) {
  height: 13px;
}
.art-note {
  position: absolute;
  color: #9a8ac7;
  font-size: 38px;
  font-weight: 700;
}
.note-one {
  left: 9px;
  top: 57px;
  transform: rotate(-16deg);
}
.note-two {
  right: 0;
  bottom: 65px;
  transform: rotate(13deg);
}
.art-caption {
  position: absolute;
  bottom: -4px;
  color: #92879f;
  font-size: 10px;
  letter-spacing: 2px;
}
.signature-section {
  margin-top: 14px;
}
.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  gap: 10px;
}
.section-heading h2 {
  font-size: 21px;
  font-weight: 750;
}
.keyboard-tip {
  color: #92909f;
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 5px;
}
.keyboard-tip kbd {
  border: 1px solid #e1dfe8;
  border-radius: 4px;
  background: white;
  padding: 2px 5px;
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
  margin-top: 34px;
  padding: 24px 0;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid var(--line);
  color: #9591a1;
  font-size: 11px;
}
@media (max-width: 700px) {
  .hero {
    padding: 22px 0 30px;
  }
  .hero-art {
    width: 220px;
    transform: scale(0.85);
    margin-right: -20px;
  }
  .keyboard-tip {
    display: none;
  }
  .mobile-tip {
    display: block;
  }
  .signature-grid {
    gap: 9px;
  }
  .board-note span {
    display: none;
  }
}
@media (max-width: 540px) {
  .hero-art {
    display: none;
  }
  .hero {
    min-height: 225px;
  }
  .hero-copy h1 {
    font-size: clamp(28px, 8.4vw, 36px);
    margin-top: 16px;
  }
  .hero-description br {
    display: none;
  }
  .hero-description {
    font-size: 12px;
  }
}
</style>
