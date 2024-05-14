<template>
  <div class="layout-wrapper flex-column">
    <Header />
    <div class="layout-content wh-100 flex-item">
      <div class="menu-box">
        <Menu />
      </div>
      <div class="main-box">
        <AppMain />
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from './components/header/index.vue'
import Menu from './components/menu/index.vue'
import AppMain from './components/app-main/index.vue'
</script>

<style lang="scss" scoped>
.layout-wrapper{
  width: 100vw;
  height: 100vh;
  .layout-content{
    overflow: hidden;
  }
  .menu-box{
    position: absolute;
    top: 50px;
    left: 0;
    // z-index: 9;
    width: 50px;
    height: calc(100% - 50px);
  }
  .main-box{
    padding-left: 50px;
    height: 100%;
  }
}
</style>
