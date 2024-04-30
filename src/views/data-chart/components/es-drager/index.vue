<template>
  <div class="outer-boundary">
    <!-- <Drager
      class="item"
      v-for="item, index in dragList"
      :key="index"
      :left="120"
      :top="index * 120 + 30"
      v-bind="item"
      :style="{ color: item.color }"
    >
    {{ item.text }}
    </Drager> -->
    <Drager
      v-for="(item, index) in dragList"
      :key="index"
      :width="100"
      :height="100"
      :left="120"
      :top="index * 150 + 30"
      v-bind="item"
      :style="{ color: item.color }"
    >
      {{ item.text }}
    </Drager>
    <!-- <Drager class="item" resizable>Drager</Drager> -->
  </div>

</template>

<script setup>
import Drager from 'es-drager'
import { ref } from 'vue'
// https://zhuanlan.zhihu.com/p/645501475
// https://vangleer.github.io/es-drager/#/menu

const dragList = ref([
  { text: '移动', resizable: false, boundary: true, markline: true },
  { color: '#00c48f', text: '移动+缩放', boundary: true },
  { color: '#ff9f00', text: '旋转', rotatable: true, resizable: false, boundary: true },
  { color: '#f44336', text: '旋转+缩放', rotatable: true, boundary: true }
])
</script>

<style lang="scss" scoped>
.outer-boundary{
  width: 600px;
  height: 600px;
  border: 1px solid #ccc;
  position: relative;
  .item{
    position: absolute;
    width: 100px;
    height: 100px;
    border: 1px solid #000;
  }
}
</style>