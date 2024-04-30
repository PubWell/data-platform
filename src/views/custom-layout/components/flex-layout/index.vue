<template>
  <div class="flex-layout-wrapper wh-100">

    <div class="flex-layout">

      <div class="flex-comp"
           ref="flexCompRef"
           v-for="item in layout"
           :key="item.i"
           :style="{
            'margin-left': gap + 'px',
            'margin-top': gap + 'px',
            'width': colWidth * item.w + gap * (item.w-1) + 'px',
            'height': rowHeight * item.h + gap * (item.h-1) + 'px',
           }"
           :class="{'active': compId && item.i == compId.i}"
           :draggable="!!item.path"
           @drag="drag"
           @dragstart="dragstart($event, item)"
           @dragend="dragend"
           @click="onCompClick(item)"
      >
        <div v-if="!item.path" class="comp-plus" :style="{width: 0.5 * Math.min(colWidth, rowHeight) + 'px', height: 0.5 * Math.min(colWidth, rowHeight) + 'px'}"></div>
        <div class=" close" @click="delItem($event, item)"><el-icon><Close /></el-icon></div>
        <!-- <Volt class="wh-100"/> -->
        <component :is="item.loadComp" :interaction="false"/>

      </div>

    </div>

  </div>
  <CompLibDlg
    :show-dlg="showDlg"
    @close-dlg="onCloseDlg"
    @confirm-dlg="onConfirmDlg"
  />
</template>

<script setup>
import { onMounted, ref, getCurrentInstance, defineAsyncComponent } from 'vue'
import { Close } from '@element-plus/icons-vue'
import CompLibDlg from '../CompLibDlg.vue'
import { customLayoutStore } from '@/stores'
import { cloneDeep } from 'lodash'

// to do
// scroll ok
// dialog style
// drag drop style
// comp init shot
// template
// leave alert
const props = defineProps({
  rowHeight: {
    type: Number,
  },
  colWidth: {
    type: Number,
  }
})
const emits = defineEmits(['layout-change'])

const flexCompRef = ref()
const store = customLayoutStore()

const gap = computed(() => {
  return store.gap
})
const layout = ref([])
let mouseXY = {
  x: null,
  y: null
}
let curComp = null
let targetComp = null

const showDlg = ref(false)
const compId = ref()

// 监听layout数组长度变化
watch(
  () => [...store.layout],
  (val) => {
    let dom = document.querySelector('.flex-layout-wrapper'),
    { height } = dom.getBoundingClientRect()
    if(val.length > layout.value.length){
      nextTick(() => {
        dom.scrollTo({
          top: dom.scrollHeight - height,
          smooth: true
        })
        emits('layout-change')
      })
      
      let diffArr = val.slice(layout.value.length,)
      layout.value = layout.value.concat(diffArr)
      // listener
      initDom()
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

// watch(
//   () => store.rows,
//   (newVal, oldVal) => {
//     let key = newVal / oldVal
//     layout.value.forEach((item) => {
//       item.h = Math.round(item.h * key)
//     })
//   }
// )

// watch(
//   () => store.cols,
//   (newVal, oldVal) => {
//     let key = newVal / oldVal
//     layout.value.forEach((item) => {
//       item.w = Math.round(item.w * key)
//     })
//   }
// )

onMounted(() => {
  layout.value = cloneDeep([...store.layout])
  initComp()
})

const initComp = () => {
  layout.value.forEach((item) => {
    let resComp = markRaw(loadComponent(item.path))
    item.loadComp = resComp
  })
  initDom()
}

const initDom = () => {
  nextTick(() => {
    for (const dom of flexCompRef.value) {
      // dom.addEventListener('dragover', dragOverEvent)
      // dom.addEventListener('dragleave', dragLeaveEvent)
      // dom.addEventListener('dragenter', dragEnterEvent)
      dom.addEventListener('dragover', (e) => {
        e.preventDefault()
        mouseXY.x = e.clientX;
        mouseXY.y = e.clientY;
        dom.style.border = '2px dashed #aad0f7'
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.dropEffect = 'move'

      })
      dom.addEventListener('dragleave', (e) => {
        dom.style.border = '2px dashed transparent'
      })
      dom.addEventListener('dragenter', (e) => {
        e.preventDefault()
      })
    }
  })
}

const dragOverEvent = (e, dom) => {
  e.preventDefault()
  mouseXY.x = e.clientX;
  mouseXY.y = e.clientY;
  dom.style.border = '2px dashed #aad0f7'
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.dropEffect = 'move'
}

const dragLeaveEvent = (e, dom) => {
  dom.style.border = '2px dashed transparent'
}

const dragEnterEvent = (e) => {
  e.preventDefault()
  dom.style.border = '2px dashed transparent'
}

// 删除item
const delItem = (e, item) => {
  e.preventDefault()
  e.stopPropagation()

  let delIndex = layout.value.findIndex(el => item.i == el.i)
  layout.value.splice(delIndex, 1)
  layout.value = [].concat(layout.value)

  store.deleteLayout(item)
}

// 引入组件
const loadComponent = (path) => {
  return defineAsyncComponent(() =>
    import(path)
  )
}

const dragstart = (e, item) => {
  e.dataTransfer.effectAllowed = 'move'
  curComp = {...item}
  targetComp = null
}

const drag = (e, item) => {
  e.preventDefault && e.preventDefault()
  // let parentRect = document.querySelector('.flex-layout').getBoundingClientRect();
  // let mouseInGrid = false;
  // if (((mouseXY.x > parentRect.left) && (mouseXY.x < parentRect.right)) && ((mouseXY.y > parentRect.top) && (mouseXY.y < parentRect.bottom))) {
  //   mouseInGrid = true;
  // }
  // if (mouseInGrid === true) {
  //   let dw = mouseXY.x - parentRect.left,
  //   dh = mouseXY.y - parentRect.top
  //   console.log(flexCompRef.value[0].offsetLeft, flexCompRef.value[0].offsetTop, flexCompRef.value[0].offsetWidth,flexCompRef.value[0].offsetHeight)

  //   layout.value.forEach((t,idx) => {

  //     if(dw >= flexCompRef.value[idx].offsetLeft && dw <= flexCompRef.value[idx].offsetLeft + flexCompRef.value[idx].offsetWidth 
  //       && dh >= flexCompRef.value[idx].offsetTop && dh <= flexCompRef.value[idx].offsetTop + flexCompRef.value[idx].offsetHeight){
  //         curComp = t.path
  //       }
  //   })
  // }
}

const dragend = (e) => {
  let parentRect = document.querySelector('.flex-layout').getBoundingClientRect();
  let mouseInGrid = false;
  if (((mouseXY.x > parentRect.left) && (mouseXY.x < parentRect.right)) && ((mouseXY.y > parentRect.top) && (mouseXY.y < parentRect.bottom))) {
      mouseInGrid = true;
  }
  if (mouseInGrid === true) {
    let dw = mouseXY.x - parentRect.left,
    dh = mouseXY.y - parentRect.top
    // console.log(flexCompRef.value[0].offsetLeft, flexCompRef.value[0].offsetTop, flexCompRef.value[0].offsetWidth,flexCompRef.value[0].offsetHeight)

    layout.value.forEach((t,idx) => {
      flexCompRef.value[idx].style.border = 'none'
      if(dw >= flexCompRef.value[idx].offsetLeft && dw <= flexCompRef.value[idx].offsetLeft + flexCompRef.value[idx].offsetWidth 
        && dh >= flexCompRef.value[idx].offsetTop && dh <= flexCompRef.value[idx].offsetTop + flexCompRef.value[idx].offsetHeight){
          targetComp = {...t}
        }
    })
    if(targetComp){
      let curIdx = layout.value.findIndex((item) => item.i == curComp.i),
      targetIdx = layout.value.findIndex((item) => item.i == targetComp.i)
      layout.value[curIdx].path = targetComp.path
      layout.value[curIdx].loadComp = targetComp.path ? markRaw(loadComponent(targetComp.path)) : null
      layout.value[targetIdx].path = curComp.path
      layout.value[targetIdx].loadComp = curComp.path ? markRaw(loadComponent(curComp.path)) : null
      layout.value = [].concat(layout.value)
      store.refreshLayout(layout.value[curIdx])
      store.refreshLayout(layout.value[targetIdx])
      // if(layout.value[curIdx].path && layout.value[targetIdx].path){
      // }
    }
  }
}

const onCompClick = (e) => {
  compId.value = e
  showDlg.value = true
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
.flex-layout-wrapper{
  overflow-y: auto;
  .flex-layout{
    display: flex;
    flex-wrap: wrap;
    // margin-top: 10px;
    // margin-left: 10px;
    .flex-comp{
      background-color: #fff;
      position: relative;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
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
::-webkit-scrollbar {
  display: none;
}
</style>