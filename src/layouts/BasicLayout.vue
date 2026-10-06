<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import ChickenBox from '@/components/ChickenBox.vue'
</script>

<template>
  <a class="skip-link" href="#main-content">跳到音效面板</a>
  <AppSidebar />
  <div class="workspace">
    <AppHeader />
    <main id="main-content" class="main-content" tabindex="-1"><ChickenBox /></main>
    <footer class="footer">鸡乐盒 pro · 仅供娱乐，快乐共享</footer>
  </div>
</template>

<style scoped>
.workspace {
  margin-left: 208px;
}
.main-content {
  width: 100%;
  max-width: 1240px;
  margin: auto;
  padding: 28px 36px 0;
}
.footer {
  padding: 8px 20px calc(132px + env(safe-area-inset-bottom));
  text-align: center;
  color: var(--muted);
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
@media (max-width: 900px) {
  .workspace {
    margin-left: 0;
  }
}
@media (max-width: 600px) {
  .main-content {
    padding: 20px 16px 0;
  }
  .footer {
    padding-bottom: calc(154px + env(safe-area-inset-bottom));
  }
}
</style>
