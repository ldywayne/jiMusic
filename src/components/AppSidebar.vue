<script setup lang="ts">
import AppIcon from './soundboard/AppIcon.vue'
import { sounds } from '@/data/sounds'
</script>

<template>
  <aside class="sidebar">
    <a class="brand" href="#main-content"
      ><span class="brand-mark"><AppIcon name="music" /></span>鸡乐盒<span class="brand-pro"
        >pro</span
      ></a
    >
    <nav class="navigation" aria-label="主要导航">
      <a class="nav-link current" href="#main-content" aria-current="page"
        ><AppIcon name="disc" />发现声音</a
      >
      <a class="nav-link" href="#signature-section"><AppIcon name="grid" />经典四连</a>
      <a class="nav-link" href="#sound-library"><AppIcon name="headphones" />音效库</a>
    </nav>
    <div class="library-summary">
      <span class="summary-icon"><AppIcon name="music" /></span><strong>你的快乐音效库</strong
      ><span>{{ sounds.length }} 个声音，点击即播</span>
    </div>
    <p class="sidebar-note">喜欢的声音可以收藏<br />收藏保存在此设备</p>
  </aside>
</template>

<style scoped>
.sidebar {
  overflow-y: auto;
  position: fixed;
  inset: 0 auto 90px 0;
  width: 208px;
  display: flex;
  flex-direction: column;
  padding: 26px 16px;
  background: #f7f7f9;
  border-right: 1px solid var(--line);
}
.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 7px;
  white-space: nowrap;
  font-size: 22px;
  font-weight: 800;
}
.brand-mark {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--accent);
  color: white;
}
.brand-pro {
  align-self: flex-start;
  font-size: 10px;
  color: var(--muted);
  margin-top: 2px;
}
.navigation {
  display: grid;
  gap: 6px;
  margin-top: 36px;
}
.nav-link {
  display: flex;
  align-items: center;
  gap: 11px;
  min-height: 44px;
  padding: 11px 16px;
  border-radius: 9px;
  font-size: 14px;
  color: #62636b;
}
.nav-link.current {
  background: var(--accent-soft);
  color: var(--accent);
  font-weight: 650;
}
.nav-link:hover:not(.current) {
  background: #ebebef;
  color: var(--ink);
}
.nav-link :deep(svg) {
  width: 18px;
  height: 18px;
}
.library-summary {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 9px;
  margin: 32px 12px 0;
  padding-top: 24px;
  border-top: 1px solid var(--line);
}
.summary-icon {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border: 1px solid #e5d9d9;
  border-radius: 10px;
  background: #f2e5e2;
  color: #a56c65;
}
.library-summary strong {
  margin-top: 2px;
  font-size: 13px;
  font-weight: 600;
}
.library-summary > span:last-child {
  font-size: 11px;
  color: var(--muted);
}
.sidebar-note {
  margin: auto 12px 8px;
  padding-top: 24px;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.9;
}
@media (max-width: 900px) {
  .sidebar {
    display: none;
  }
}
</style>
