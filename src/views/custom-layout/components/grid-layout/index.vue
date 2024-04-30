
<template>
  <grid-layout
    v-model:layout="layout"
    :col-num="cols"
    :row-height="rowHeight"
    :margin="[gap, gap]"
    :vertical-compact="false"
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
        @move="move"
        @moved="moved"
        @resize="resize"
        @resized="resized"
      >
      <div class="wh-100 layout-item" @click="onClickItem($event, item)" :class="{'active': compId && item.i == compId.i}">
        <div v-if="!item.path" class="comp-plus" :style="{width: 0.5 * Math.min(colWidth, rowHeight) + 'px', height: 0.5 * Math.min(colWidth, rowHeight) + 'px'}"></div>
        <div class=" close" @click="delItem($event, item)">{{ item.i }}<el-icon><Close /></el-icon></div>
        <component :is="item.loadComp" />
      </div>
      </grid-item>
    </template>
  </grid-layout>
  <CompLibDlg
    :show-dlg="showDlg"
    @close-dlg="onCloseDlg"
    @confirm-dlg="onConfirmDlg"
  />
</template>

<script setup>
import { onMounted, ref, getCurrentInstance, defineAsyncComponent } from 'vue'
import { Close } from '@element-plus/icons-vue'
// import ChartDemo from '../ChartDemo.vue'
// vue3-drr-grid-layout 中文文档
// https://www.itxst.com/vue3-drr-grid-layout/tutorial.html

// https://www.itxst.com/vue3-drr-grid-layout/attrs.html

import { GridLayout, GridItem } from "vue3-drr-grid-layout"
import "vue3-drr-grid-layout/dist/style.css"

import { customLayoutStore } from '@/stores'
import { cloneDeep } from 'lodash'
import CompLibDlg from '../CompLibDlg.vue'
import {compact} from './hooks.js'

const props = defineProps({
  rowHeight: {
    type: Number,
  },
  colWidth: {
    type: Number,
  }
})
const emits = defineEmits(['layout-add','layout-change'])
// to do
// layout 更新 ok
// 删除/移动没有更新布局 ok
// 拖拽没有平级放置 :vertical-compact="false" ok
// 监听rows cols 变化 x
// 拖拽交换 x
// 新增 滚动 ok
// 缩放超出页面范围 default
// 图表缩放 ok -- 页面中不可存在相同图表
const store = customLayoutStore()
const cols = computed(() => {
  return store.cols
})
const rows = computed(() => {
  return store.rows
})
const gap = computed(() => {
  return store.gap
})
const layout = ref([])
const showDlg = ref(false)
const compId = ref()

const resizeMark = ref(false)
const moveMark = ref(false)

// 监听layout数组长度变化
watch(
  () => [...store.layout],
  (val) => {
    if(val.length > layout.value.length){
      emits('layout-add')
      
      let diffArr = val.slice(layout.value.length,)
      layout.value = layout.value.concat(diffArr)
    }
  },
)

watch(
  () => store.templateId,
  () => {
    layout.value = cloneDeep([...store.layout])
    if(layout.value.length){
      initComp()
    }
  }
)

onMounted(() => {
  layout.value = cloneDeep([...store.layout])
  initComp()
})

const initComp = () => {
  layout.value.forEach((item) => {
    let resComp = markRaw(loadComponent(item.path))
    item.loadComp = resComp
  })
}

// 引入组件
const loadComponent = (path) => {
  return defineAsyncComponent(() =>
    import(path)
  )
}

// 删除item
const delItem = (e, item) => {
  e.preventDefault()
  e.stopPropagation()

  let delIndex = layout.value.findIndex(el => item.i == el.i), delTarget = {...layout.value[delIndex]}
  layout.value.splice(delIndex, 1)
  layout.value = [].concat(layout.value)
  store.deleteLayout(item)
  // compactLayout()
  compact(layout.value)
}

//单元格移动后的事件
const move = (i, newX, newY) => {
  moveMark.value = true
}

//单元格移动后的事件
const moved = (i, newX, newY) => {
  emits('layout-change')
}

const resize = (i, newH, newW, newHPx, newWPx) => {
  resizeMark.value = true
}

const resized = (i, newH, newW, newHPx, newWPx) => {
  compact(layout.value)
  emits('layout-change')
}

const onClickItem = (e, target) => {
  console.log('click item>>>>>>>>>>>>>')
  if(!moveMark.value){
    e.preventDefault()
    e.stopPropagation()
    compId.value = target
    showDlg.value = true
  }else{
    // compactLayout()
    compact(layout.value)
    // resizeMark.value = false
    moveMark.value = false
  }
}

const onCloseDlg = () => {
  showDlg.value = false
}

const onConfirmDlg = (e) => {
  showDlg.value = false
  let idx = layout.value.findIndex((item) => item.i == compId.value.i)
  layout.value[idx].path = e
  layout.value[idx].loadComp = markRaw(loadComponent(e))
  store.refreshLayout(layout.value[idx])
  compId.value = null
}

</script>

<style lang="scss" scoped>
.read-the-docs {
  color: #888;
}
.outer-boundary{
  width: 100%;
  height: 100%;
  // overflow: auto;
  .grid-item-custom{
    border: 1px solid #f5f7fa;
    position: relative;
    .layout-item{
      position: relative;
      background-color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      &.active{
        border: 2px dashed #aad0f7;
      }
      .comp-plus{
        background-image: url('@/assets/images/plus.jpg');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center;
      }
      .close{
        position: absolute;
        top: 5px;
        right: 10px;
        z-index: 9;
        cursor: pointer;
        color: #000;
        font-size: 15px;
        &:hover {
            // color: #fff;
            background-color: #f3f3f3
        }
      }
    }
  }
}
:deep(.vue-grid-item.vue-grid-placeholder){
  border-radius: 8px;
  // background-color: #16ba67;
  background-color: #dfdfdf;
  opacity: 0.3;
}
::-webkit-scrollbar {
  display: none;
}
:deep(.vue-grid-layout) {
  height: 100% !important;
  background: transparent;
}
</style>