<script setup lang="ts">
import AppIcon from './soundboard/AppIcon.vue'
</script>
<template>
  <header class="header">
    <div class="header-inner">
      <a class="brand" href="#main-content" aria-label="鸡乐盒首页"
        ><span class="brand-mark"><AppIcon name="music" /></span
        ><span>鸡乐盒<span class="brand-pro">pro</span></span></a
      >
      <a class="library-link" href="#sound-library">音效库</a
      ><span class="header-tagline">一点声音，很多快乐</span>
    </div>
  </header>
</template>
<style scoped>
.header {
  border-bottom: 1px solid var(--line);
  background: #ffffff;
}
.header-inner {
  max-width: 1180px;
  padding: 0 32px;
  min-height: 76px;
  margin: auto;
  display: flex;
  align-items: center;
  gap: 56px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 800;
  color: var(--ink);
}
.brand-mark {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 11px;
  background: var(--accent);
  color: white;
}
.brand-pro {
  font-size: 10px;
  font-weight: 600;
  color: var(--accent);
  margin-left: 6px;
  background: #efeafb;
  padding: 3px 6px;
  border-radius: 5px;
  vertical-align: middle;
}
.library-link {
  font-size: 13px;
  font-weight: 600;
  color: var(--accent);
  align-self: stretch;
  display: flex;
  align-items: center;
  border-bottom: 2px solid var(--accent);
  padding: 2px 6px 0;
}
.header-tagline {
  margin-left: auto;
  font-size: 11px;
  color: #97929f;
}
@media (max-width: 600px) {
  .header-inner {
    min-height: 65px;
    padding: 0 20px;
    gap: 25px;
  }
  .header-tagline {
    display: none;
  }
  .library-link {
    margin-left: auto;
  }
}
</style>
