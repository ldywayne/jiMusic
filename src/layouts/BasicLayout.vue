<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import ChickenBox from '@/components/ChickenBox.vue'
</script>
<template>
  <a class="skip-link" href="#main-content">跳到音效面板</a>
  <AppHeader />
  <main id="main-content" class="main-content" tabindex="-1"><ChickenBox /></main>
  <footer class="footer">鸡乐盒 pro · 仅供娱乐，快乐共享</footer>
</template>
<style scoped>
.main-content {
  width: 100%;
  max-width: 1180px;
  margin: auto;
  padding: 18px 32px 0;
}
.footer {
  padding: 15px 20px 118px;
  text-align: center;
  color: #aaa6b4;
  font-size: 11px;
}
.skip-link {
  position: fixed;
  top: -100px;
  left: 16px;
  z-index: 10;
  padding: 12px 18px;
  background: white;
  color: var(--accent);
  border-radius: 8px;
}
.skip-link:focus {
  top: 10px;
}
@media (max-width: 600px) {
  .main-content {
    padding: 14px 20px 0;
  }
  .footer {
    padding-bottom: 145px;
  }
}
</style>
