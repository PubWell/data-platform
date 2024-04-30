
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

const props = defineProps({
  rowHeight: {
    type: Number,
  },
  colWidth: {
    type: Number,
  }
})
const emits = defineEmits(['layout-change'])
// to do
// layout 更新 ok
// 缩放超出页面范围
// 删除/移动没有更新布局
// 拖拽没有平级放置 :vertical-compact="false" ok
// 监听rows cols 变化 x
// 拖拽交换 x
// 新增 滚动 ok
// 缩放 图表缩放
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
    // let dom = document.querySelector('.v-page-grid-layout'),
    // { height } = dom.getBoundingClientRect()
    if(val.length > layout.value.length){
      // nextTick(() => {
        // dom.scrollTo({
        //   top: dom.scrollHeight - height,
        //   smooth: true
        // })
      // })
      emits('layout-change')
      
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
  compactLayout()
  // let sortedRowCol = sortLayoutItemsByRowCol(layout.value),
  // sortedRow = sortLayoutItemsByRow(layout.value),
  // sortedCol = sortLayoutItemsByCol(sortedRow)
  // layout.value = [...sortedRowCol]
  // console.log(layout.value)
  
  // const fun = (target, a) => {
  //   let arr1 = a.filter((item) => item.x > target.x && item.y + item.h <= target.y + target.h && item.x == target.x + target.w),
  //   arr2 = a.filter((item) => item.y > target.y && item.x + item.w <= target.x + target.w && item.y == target.y + target.h)

  //   console.log('arr1>>>>>>>>>', arr1)
  //   if(arr1.length){
  //     let emptyArr = []
  //     arr1.forEach((item) => {
  //       let idx = a.findIndex((origin) => origin.i == item.i)
        
  //       let empty = {
  //         x: item.x + item.w - target.x - target.w,
  //         y: item.y,
  //         w: item.w + item.x - target.w,
  //         h: item.h,
  //       }
  //       emptyArr.push(empty)
  //       a[idx].x = target.x

  //     })
  //     emptyArr.forEach((empty) => fun(empty, a))
  //     return
  //   }

  //   console.log('arr2>>>>>>>>>', arr2)
  //   if(arr2.length){
  //     let emptyArr = []
  //     arr2.forEach((item) => {
  //       let idx = a.findIndex((origin) => origin.i == item.i)
        
  //       let empty = {
  //         x: item.x,
  //         y: item.y + item.h - target.y - target.h,
  //         w: item.w,
  //         h: item.y + item.h - target.h,
  //       }
  //       emptyArr.push(empty)
  //       a[idx].y = target.y

  //     })
  //     emptyArr.forEach((empty) => fun(empty, a))
  //     return
  //   }

  //   // a.reduce((pre, cur) => {
  //   //   if(cur.x - pre.x - pre.w > 0){
  //   //     let empty = {
  //   //       x: pre.w + pre.x + 1,
  //   //       y: cur.y,
  //   //       w: cur.w,
  //   //       h: cur.h,
  //   //     }
  //   //     fun(empty, a)
  //   //   }
  //   //   return cur
  //   // },a[0])

  // }
  // fun(delTarget, layout.value)
}

// 根据行对元素重新排列
const sortLayoutItemsByRow = (layoutdata) => {
    return [].concat(layoutdata).sort(function (a, b) {
        if (a.y === b.y && a.x === b.x) {
            return 0;
        }
        if (a.y > b.y || (a.y === b.y && a.x > b.x)) {
            return 1;
        }
        return -1;
    });
}
// 根据列对元素重新排列
const sortLayoutItemsByCol = (layoutdata) => {
    return [].concat(layoutdata).sort(function (a, b) {
        
        if (a.x === b.x && a.y > b.y) {
            return 1;
        }
        return 0;
    });
}

//单元格移动事件
const move = (i, newX, newY) => {
  // console.log("移动中 i=" + i + ", X=" + newX + ", Y=" + newY)
  // emits('layout-change')
  
  // console.log('moved>>>>>>>>>>>>', layout.value, sortLayoutItemsByRowCol(layout.value))
}

//单元格移动后的事件
const moved = (i, newX, newY) => {
  console.log("移动结束 i=" + i + ", X=" + newX + ", Y=" + newY)
  // emits('layout-change')
  
  console.log('moved>>>>>>>>>>>>', layout.value)
  compactLayout()
}

const resize = (i, newH, newW, newHPx, newWPx) => {
  // console.log("缩放中 i=" + i + ", X=" + newHPx + ", Y=" + newWPx)
  // nextTick(() => {
  //   chartRef.value[i].update()
  // })
  // emits('layout-change')
}

const resized = (i, newH, newW, newHPx, newWPx) => {
  // console.log("缩放结束 i=" + i + ", X=" + newHPx + ", Y=" + newWPx)
  // nextTick(() => {
  //   chartRef.value[i].update()
  // })
  // emits('layout-change')
  console.log('resized>>>>>>>>>>>>', sortLayoutItemsByRowCol(layout.value))
}

const onClickItem = (e, target) => {
  // e.preventDefault()
  // e.stopPropagation()
  // compId.value = target
  // showDlg.value = true
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

// 处理布局
const compact = (layoutdata) => {
  const compareWith = []
  const sorted = sortLayoutItemsByRowCol(layoutdata);
  const out = Array(sorted.length)

  sorted.forEach((l) => {

    l = compactItem(compareWith, l)
    // 加入对比数组，检测冲突时比较其中的元素
    compareWith.push(l);

    // 放入输出的数组，维持原来的顺序
    out[layoutdata.indexOf(l)] = l;

    // Clear moved flag, if it exists.
    // l.moved = false;
  })
  return out
}
// 根据行列对元素重新排列
const sortLayoutItemsByRowCol = (layoutdata) => {
  return [].concat(layoutdata).sort(function (a, b) {
    if (a.y === b.y && a.x === b.x) {
      return 0;
    }
    if (a.y > b.y || (a.y === b.y && a.x > b.x)) {
      return 1;
    }
    return -1;
  });
}
// 判断每一个元素的冲突情况，无冲突则y=0，有冲突则y=冲突项的y+冲突项的h
const compactItem = (compareWith, item) => {
  while (item.y > 0 && !getFirstCollision(compareWith, item)) {
    item.y--;
  }
  let collides;
  while ((collides = getFirstCollision(compareWith, item))) {
    item.y = collides.y + collides.h;
  }
  return item
}
// 找到第一个冲突的元素
const getFirstCollision = (compareWith, item) => {
  for (let i = 0, len = compareWith.length; i < len; i++) {
    if (collides(compareWith[i], item)) return compareWith[i];
  }
}
// 判断两个元素是否有冲突重叠
const collides = (item1, item2) => {
  if (item1 === item2) return false; // 同一个item
  if (item1.x + item1.w <= item2.x) return false; // item1 在 item2左边
  if (item1.x >= item2.x + item2.w) return false; // item1 在 item2右边
  if (item1.y + item1.h <= item2.y) return false; // item1 在 item2上边
  if (item1.y >= item2.y + item2.h) return false; // item1 在 item2下边
  return true; // 其他情况则是有冲突重叠
}

// 根据行列对元素重新排列
const sortLayoutByRowCol = () => {
  layout.value.sort(function (a, b) {
    if (a.y === b.y && a.x === b.x) {
      return 0;
    }
    if (a.y > b.y || (a.y === b.y && a.x > b.x)) {
      return 1;
    }
    return -1;
  });
}

// 重新排序
const compactLayout = () => {
  sortLayoutByRowCol()
  // let a = [].concat(layout.value)
  nextTick(() => {
    for(let i = 1; i < layout.value.length; i++){
      if(layout.value[i].y > layout.value[i-1].y + layout.value[i-1].h){
        layout.value[i].y = layout.value[i-1].y + layout.value[i-1].h
        layout.value[i].x = 0
        console.log('行修改',i,layout.value)
      }
      if(
        layout.value[i].y < layout.value[i-1].y + layout.value[i-1].h
        && layout.value[i].x >= layout.value[i-1].x + layout.value[i-1].w
        &&
        (
          (
            i < layout.value.length - 1 
            && ( layout.value[i+1].y == layout.value[i].y || layout.value[i+1].y >= layout.value[i].y + layout.value[i].h )
          )
          || i == layout.value.length - 1
        )
      ){
        layout.value[i].y = layout.value[i-1].y
        layout.value[i].x = layout.value[i-1].x + layout.value[i-1].w
        console.log('列修改1',i,layout.value)
      }
      if(
        layout.value[i].y >= layout.value[i-1].y + layout.value[i-1].h
        && layout.value[i-1].x + layout.value[i-1].w + layout.value[i-1].w <= cols.value
      ){
        layout.value[i].y = layout.value[i-1].y
        layout.value[i].x = layout.value[i-1].x + layout.value[i-1].w
        console.log('列修改2',i,layout.value)
      }
    }
    const fun = (a) => {
      for(let i = 1; i < a.length; i++){
        if(a[i].y > a[i-1].y + a[i-1].h){
          a[i].y = a[i-1].y + a[i-1].h
          a[i].x = 0
          console.log('行修改',[].concat(a))
          fun(a)
          break
        }
        if(
          a[i].y < a[i-1].y + a[i-1].h
          && a[i].x > a[i-1].x + a[i-1].w
          && i < a.length - 1 && a[i+1].y <= a[i].y + a[i].h
        ){
          a[i].y = a[i-1].y
          a[i].x = a[i-1].x + a[i-1].w
          console.log('列修改1',[].concat(a))
          fun(a)
          break
        }
        if(
          a[i].y > a[i-1].y + a[i-1].h
          && a[i].x + a[i].w + a[i-1].w <= cols.value
        ){
          a[i].y = a[i-1].y
          a[i].x = a[i-1].x + a[i-1].w
          console.log('列修改2',[].concat(a))
          fun(a)
          break
        }
      }
    }
    // fun(layout.value)
  })
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