<template>
  <div class="app-main-wrapper">
    <div class="app-main-box">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.app-main-wrapper {
  width: 100%;
  height: 100%;
  padding: 10px;
  background-color: #f8f9fc;
  flex: 1;
  .app-main-box{
    width: 100%;
    height: 100%;
    background-color: #ffffff;
  }
}
</style>
