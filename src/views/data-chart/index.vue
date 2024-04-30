<template>
  <div class="data-chart-wrapper wh-100 flex">
    <DataConfig class="action-container" />
    <GridLayout class="flex-item ml-10" />
    <!-- <VueDraggable class="flex-item ml-10"/> -->
  </div>
  <!-- <MoveableEle ></MoveableEle> -->
</template>

<script setup>
import DataConfig from './components/data-config/index.vue'
import MoveableEle from './components/moveable/index.vue'
import GridLayout from './components/grid-layout/index.vue'
import VueDraggable from './components/vue-draggable/index.vue'
</script>

<style lang="scss" scoped>
.data-chart-wrapper{
  overflow: hidden;
  // background-color: transparent;
  .action-container{
    width: 300px;
    height: 100%;
  }
}
</style>
