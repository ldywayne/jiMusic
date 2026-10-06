<script setup lang="ts">
import { computed, onMounted, shallowRef } from 'vue'
import { categories, sounds, type Sound, type SoundCategory } from '@/data/sounds'
import SoundPad from './SoundPad.vue'
import AppIcon from './AppIcon.vue'
defineProps<{ activeId?: string; playing: boolean }>()
defineEmits<{ play: [sound: Sound] }>()
const query = shallowRef('')
const category = shallowRef<SoundCategory | '全部音效' | '我的收藏'>('全部音效')
const favorites = shallowRef<ReadonlySet<string>>(new Set())
const storageNotice = shallowRef('')
const tabs = ['全部音效', ...categories, '我的收藏'] as const
const filteredSounds = computed(() => {
  const search = query.value.trim().toLocaleLowerCase()
  return sounds.filter(
    (sound) =>
      (category.value === '全部音效' ||
        category.value === sound.category ||
        (category.value === '我的收藏' && favorites.value.has(sound.id))) &&
      (!search ||
        `${sound.name} ${sound.id} ${sound.category}`.toLocaleLowerCase().includes(search)),
  )
})
function toggleFavorite(id: string) {
  const next = new Set(favorites.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  favorites.value = next
  try {
    localStorage.setItem('jimusic:favorites', JSON.stringify([...next]))
    storageNotice.value = ''
  } catch {
    storageNotice.value = '浏览器未允许保存收藏，本次打开期间仍可使用。'
  }
}
function resetFilters() {
  query.value = ''
  category.value = '全部音效'
}
onMounted(() => {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem('jimusic:favorites') ?? '[]')
    if (Array.isArray(saved)) {
      const validIds = new Set(sounds.map((sound) => sound.id))
      favorites.value = new Set(
        saved.filter((id): id is string => typeof id === 'string' && validIds.has(id)),
      )
    }
  } catch {
    /* An unavailable or invalid store does not block playback. */
  }
})
</script>

<template>
  <section id="sound-library" class="library" aria-labelledby="library-title">
    <div class="library-heading">
      <div class="title-group">
        <h2 id="library-title">音效库</h2>
        <span class="count">{{ sounds.length }} 个声音，随你发挥</span>
      </div>
      <div class="search-box">
        <AppIcon name="search" /><input
          v-model="query"
          type="search"
          aria-label="搜索音效"
          placeholder="搜索你想听的…"
        />
      </div>
    </div>
    <div class="filter-row">
      <div class="filters" role="group" aria-label="音效分类">
        <button
          v-for="tab in tabs"
          :key="tab"
          class="filter-button"
          :class="{ selected: category === tab }"
          :aria-pressed="category === tab"
          @click="category = tab"
        >
          <AppIcon v-if="tab === '我的收藏'" name="heart" />{{ tab
          }}<span v-if="tab === '我的收藏' && favorites.size">{{ favorites.size }}</span>
        </button>
      </div>
      <span class="result-count" aria-live="polite">{{ filteredSounds.length }} 个音效</span>
    </div>
    <p v-if="storageNotice" class="storage-notice" role="status">{{ storageNotice }}</p>
    <div v-if="filteredSounds.length" class="sound-grid">
      <SoundPad
        v-for="sound in filteredSounds"
        :key="sound.id"
        :sound="sound"
        :active="activeId === sound.id"
        :playing="playing && activeId === sound.id"
        :favorite="favorites.has(sound.id)"
        @play="$emit('play', $event)"
        @favorite="toggleFavorite"
      />
    </div>
    <div v-else class="empty-state">
      <AppIcon :name="category === '我的收藏' ? 'heart' : 'search'" />
      <h3>{{ category === '我的收藏' && !query ? '把喜欢的声音留在这里' : '没有找到这个声音' }}</h3>
      <p>
        {{
          category === '我的收藏' && !query
            ? '点击音效右上角的爱心，下次就能快速找到。'
            : '试试更短的关键词，或看看其他分类。'
        }}
      </p>
      <button class="text-button" @click="resetFilters">查看全部音效</button>
    </div>
  </section>
</template>

<style scoped>
.library {
  margin-top: 36px;
  scroll-margin-top: 24px;
}
.library-heading,
.title-group,
.filter-row,
.filters {
  display: flex;
  align-items: center;
}
.library-heading,
.filter-row {
  justify-content: space-between;
  gap: 20px;
}
.title-group {
  gap: 15px;
}
.title-group h2 {
  font-size: 23px;
  font-weight: 750;
}
.count {
  font-size: 12px;
  color: var(--muted);
}
.search-box {
  display: flex;
  align-items: center;
  gap: 11px;
  background: white;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 10px 13px;
  color: #9695a6;
  width: 270px;
}
.search-box:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px #6554c015;
}
.search-box :deep(svg) {
  width: 17px;
  height: 17px;
}
.search-box input {
  min-width: 0;
  width: 100%;
  outline: none;
  background: transparent;
  border: 0;
  font-size: 12px;
}
.filter-row {
  margin: 22px 0;
}
.filters {
  gap: 7px;
  flex-wrap: wrap;
}
.filter-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  background: transparent;
  border: 0;
  border-radius: 8px;
  padding: 10px 15px;
  color: #727385;
  font-size: 12px;
  white-space: nowrap;
  min-height: 40px;
}
.filter-button.selected {
  background: var(--ink);
  color: white;
}
.filter-button:hover:not(.selected) {
  background: #ebe8f4;
  color: var(--ink);
}
.filter-button :deep(svg) {
  width: 14px;
  height: 14px;
}
.filter-button span {
  font-size: 10px;
}
.result-count {
  font-size: 11px;
  color: var(--muted);
  white-space: nowrap;
}
.sound-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 13px;
}
.empty-state {
  text-align: center;
  padding: 65px 20px;
  border: 1px dashed #d7d1e6;
  border-radius: 16px;
}
.empty-state :deep(svg) {
  color: var(--accent);
  margin-bottom: 13px;
  width: 30px;
  height: 30px;
}
.empty-state h3 {
  font-size: 18px;
  font-weight: 650;
  margin-bottom: 8px;
}
.empty-state p,
.storage-notice {
  font-size: 13px;
  color: var(--muted);
}
.text-button {
  color: var(--accent);
  border: 0;
  background: transparent;
  margin-top: 15px;
  padding: 10px;
}
.storage-notice {
  margin-bottom: 16px;
}
@media (max-width: 1050px) {
  .sound-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
@media (max-width: 700px) {
  .library-heading {
    align-items: stretch;
    flex-direction: column;
    gap: 15px;
  }
  .search-box {
    width: 100%;
    min-height: 44px;
  }
  .title-group {
    justify-content: space-between;
  }
  .filter-row {
    align-items: flex-start;
    gap: 8px;
    margin: 16px 0;
  }
  .filter-button {
    padding: 9px 11px;
  }
  .result-count {
    display: none;
  }
  .sound-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
  }
}
@media (max-width: 420px) {
  .sound-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .count {
    font-size: 11px;
  }
}
</style>
