<template>
  <div class="layout">
    <header>
      <div class="header-content">
        <div class="logo">
          <img src="@/assets/logo.svg" alt="logo" />
        </div>
        <div class="nav">
          <ul>
            <li>
              <RouterLink to="/">首页</RouterLink>
            </li>
            <li>
              <RouterLink to="/music">音乐</RouterLink>
            </li>
            <li>
              <RouterLink to="/video">视频</RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">

</script>




<style scoped></style>
