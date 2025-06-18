<template>
  <div class="layout">
    <a-layout>
      <a-layout-header>
        <Header />
      </a-layout-header>
      <a-layout-content>
        <div class="content-wrapper">
          <ChickenBox />
        </div>
      </a-layout-content>
      <a-layout-footer>
        <div class="footer-content">
          <div class="copyright">
            <span>©2025 鸡乐盒pro</span>
          </div>
        </div>
      </a-layout-footer>
    </a-layout>

  </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import ChickenBox from '@/components/ChickenBox.vue'

</script>




<style scoped>
.layout {
  min-height: 100vh;
}

.content-wrapper {
  padding: 20px;
  min-height: calc(100vh - 120px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: #f0f2f5;
}

.footer-content {
  text-align: center;
  padding: 10px 0;
}

.copyright {
  color: #666;
  font-size: 14px;
}
</style>
