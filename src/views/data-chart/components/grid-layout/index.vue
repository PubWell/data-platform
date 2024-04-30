
<template>
  <!-- <div class="outer-boundary">

  </div> -->
  <!-- <div>{{ message }}</div> -->
  <grid-layout
    v-model:layout="layout"
    :col-num="cols"
    :row-height="450"
    class="outer-boundary"
  >
    <template #default="{ gridItemProps }"> 
      <grid-item
        class="grid-item-custom"
        v-for="item in layout"
        :key="item.i"
        v-bind="gridItemProps"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        @resized="resized"
        @moved="moved"
      >
        <!-- {{ item.i }} -->
        <ChartDemo ref="chartDemoRef" :info="item.info"/>
      </grid-item>
    </template>
  </grid-layout>
</template>

<script setup>
import ChartDemo from '../ChartDemo.vue'
// vue3-drr-grid-layout 中文文档
// https://www.itxst.com/vue3-drr-grid-layout/tutorial.html

// https://www.itxst.com/vue3-drr-grid-layout/attrs.html
import { ref } from "vue"
import { GridLayout, GridItem } from "vue3-drr-grid-layout"
import "vue3-drr-grid-layout/dist/style.css"

import { dataChartStore } from '@/stores'

const store = dataChartStore()
let info = {
  x: [],
  y: [],
  fun: 1,
  colorType: 1,
  seriesType: 2,
}
const chartDemoRef = ref(null)
const layout = ref([
  { x: 0, y: 0, w: 1, h: 1, i: 0, info: {...info, id: 1} },
  { x: 1, y: 0, w: 2, h: 1, i: 1, info: {...info, id: 2} },
  { x: 0, y: 1, w: 3, h: 1, i: 2, info: {...info, id: 3} },
])
const cols = ref(3)

watch(
  () => store.chartConfig,
  (val) => {
    let len = layout.value.length, pre = layout.value[len - 1]
    if(cols.value - pre.w - pre.x > 0){
      console.log('watch store chartConfig>>>>>>>>>', layout.value)
      layout.value.push({ x: pre.x + pre.w, y: pre.y, w: 1, h: pre.h, i: len, info: {...val} })
    }else{
      layout.value.push({ x: 0, y: pre.y + 1, w: 1, h: 1, i: len, info: {...val} })
    }
  },
  { deep: true }
)

watch(
  () => store.deleteChartItem,
  (val) => {
    let delTarget = layout.value.findIndex((item) => item.info.id == val.id)
    layout.value.splice(delTarget, 1)
  },
  { deep: true }
)

const resized = (i, newH, newW, newHPx, newWPx) => {
  // console.log("缩放中 i=" + i + ", X=" + newHPx + ", Y=" + newWPx)
  nextTick(() => {
    chartDemoRef.value[i].update()
  })
  console.log('resized>>>>>>>>>>>>', layout.value)
}

//单元格移动后的事件
const moved = (i, newX, newY) => {
  // console.log("移动中 i=" + i + ", X=" + newX + ", Y=" + newY)
  console.log('moved>>>>>>>>>>>>', layout.value)
}
</script>

<style lang="scss" scoped>
.read-the-docs {
  color: #888;
}
.outer-boundary{
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background-color: #fff;
  padding: 5px;
  overflow: auto;
  .grid-item-custom{
    background-color: #ffffff;
    border: 1px solid #f5f7fa;
    border-radius: 8px;
    box-shadow: 0px 0px 3px 2px rgba(245, 247, 250, 0.9);
  }
}
:deep(.vue-grid-item.vue-grid-placeholder){
  border-radius: 8px;
  // background-color: #16ba67;
  background-color: #dfdfdf;
}
::-webkit-scrollbar {
  display: none;
}
</style>