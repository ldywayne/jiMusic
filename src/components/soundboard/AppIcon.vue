<script setup lang="ts">
defineProps<{
  name: 'play' | 'pause' | 'stop' | 'search' | 'heart' | 'volume' | 'shuffle' | 'music' | 'close'
}>()
const paths = {
  play: 'm9 5 11 7-11 7Z',
  pause: 'M8 5v14M16 5v14',
  stop: 'M6 6h12v12H6Z',
  search: 'm21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  heart:
    'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z',
  volume: 'm11 4-6 5H2v6h3l6 5ZM15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14',
  shuffle: 'm18 3 3 3-3 3M18 15l3 3-3 3M3 6h3c5 0 7 12 12 12h3M3 18h3c2 0 4-3 6-6s4-6 6-6h3',
  music: 'M9 18V5l12-2v13M9 5v4l12-2M9 18a3 3 0 1 1-3-3h3M21 16a3 3 0 1 1-3-3h3',
  close: 'm6 6 12 12M6 18 18 6',
}
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path :d="paths[name]" />
  </svg>
</template>

<style scoped>
svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}
</style>
