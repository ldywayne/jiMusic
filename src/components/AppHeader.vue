<script setup lang="ts">
import AppIcon from './soundboard/AppIcon.vue'
</script>

<template>
  <header class="header">
    <div class="header-inner">
      <a class="mobile-brand" href="#main-content">
        <span class="brand-mark"><AppIcon name="music" /></span>鸡乐盒
      </a>
      <span class="page-title">发现声音</span>
      <span class="header-tagline"><AppIcon name="headphones" />戴上耳机，听点快乐</span>
    </div>
  </header>
</template>

<style scoped>
.header {
  background: var(--surface);
  border-bottom: 1px solid var(--line);
}
.header-inner {
  max-width: 1240px;
  min-height: 72px;
  padding: 0 36px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}
.page-title {
  font-size: 17px;
  font-weight: 700;
}
.header-tagline {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  font-size: 12px;
}
.header-tagline :deep(svg) {
  width: 16px;
  height: 16px;
}
.mobile-brand {
  display: none;
  align-items: center;
  gap: 9px;
  font-size: 20px;
  font-weight: 800;
}
.brand-mark {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--accent);
  color: white;
}
@media (max-width: 900px) {
  .mobile-brand {
    display: flex;
  }
  .page-title {
    display: none;
  }
}
@media (max-width: 600px) {
  .header-inner {
    min-height: 64px;
    padding: 0 18px;
  }
  .header-tagline {
    font-size: 11px;
  }
}
</style>
