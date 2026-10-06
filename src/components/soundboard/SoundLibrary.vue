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
  min-width: 0;
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
  font-size: 22px;
  font-weight: 750;
}
.count {
  color: var(--muted);
  font-size: 12px;
}
.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 260px;
  min-height: 40px;
  padding: 9px 14px;
  border: 1px solid #ededf0;
  border-radius: 24px;
  background: #f7f7f9;
  color: var(--muted);
}
.search-box:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px #d9363e12;
}
.search-box :deep(svg) {
  width: 16px;
  height: 16px;
}
.search-box input {
  min-width: 0;
  width: 100%;
  outline: none;
  border: 0;
  background: transparent;
  font-size: 12px;
}
.search-box input::placeholder {
  color: var(--muted);
}
.filter-row {
  margin: 16px 0 24px;
  border-bottom: 1px solid var(--line);
}
.filters {
  flex-wrap: wrap;
  gap: 24px;
}
.filter-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 44px;
  padding: 10px 0 13px;
  border: 0;
  background: transparent;
  color: var(--muted);
  font-size: 13px;
  white-space: nowrap;
}
.filter-button.selected {
  color: var(--accent);
  font-weight: 700;
}
.filter-button.selected::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 3px;
  border-radius: 3px;
  background: var(--accent);
}
.filter-button:hover:not(.selected) {
  color: var(--ink);
}
.filter-button :deep(svg) {
  width: 14px;
  height: 14px;
}
.filter-button span {
  display: grid;
  place-items: center;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 9px;
  background: var(--accent-soft);
  color: var(--accent);
  font-size: 10px;
}
.result-count {
  color: var(--muted);
  font-size: 11px;
  white-space: nowrap;
}
.sound-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 22px 18px;
}
.empty-state {
  padding: 60px 20px;
  border-radius: 12px;
  background: #f8f8fa;
  text-align: center;
}
.empty-state :deep(svg) {
  width: 30px;
  height: 30px;
  margin-bottom: 13px;
  color: var(--accent);
}
.empty-state h3 {
  margin-bottom: 8px;
  font-size: 18px;
  font-weight: 650;
}
.empty-state p,
.storage-notice {
  color: var(--muted);
  font-size: 13px;
}
.text-button {
  margin-top: 15px;
  padding: 10px;
  color: var(--accent);
  border: 0;
  background: transparent;
}
.storage-notice {
  margin-bottom: 16px;
}
@media (max-width: 1100px) {
  .sound-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
@media (max-width: 700px) {
  .library {
    margin-top: 28px;
  }
  .library-heading {
    align-items: stretch;
    flex-direction: column;
    gap: 16px;
  }
  .search-box {
    width: 100%;
    min-height: 44px;
  }
  .title-group {
    justify-content: space-between;
    gap: 8px;
  }
  .filter-row {
    margin: 12px 0 20px;
  }
  .filters {
    width: 100%;
    flex-wrap: nowrap;
    gap: 22px;
    overflow-x: auto;
    scrollbar-width: thin;
    padding-bottom: 2px;
  }
  .filter-button {
    flex-shrink: 0;
  }
  .result-count {
    display: none;
  }
  .sound-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px 12px;
  }
}
@media (max-width: 480px) {
  .sound-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .count {
    font-size: 11px;
  }
}
</style>
