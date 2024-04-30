<template>
  <div class="container wh-100" @dragenter.prevent @dragover.prevent>
      <!-- 自定义布局的部分  -->
      <!-- :is-mirrored="false" :margin="[10, 10]"-->

      <div class="grid-box wh-100" >
          <grid-layout
            ref="gridLayoutRef"
            v-model:layout="layout"
            :col-num="12"
            :row-height="30"
            :is-draggable="true"
            :is-resizable="true"
            :vertical-compact="true"
            :is-mirrored="false"
            :margin="[10, 10]"
            :use-css-transforms="true"
            class="wh-100"
          >
              <grid-item ref="gridItem" @resized="resizedEvent" v-for="item in layout" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i" :key="item.i">
                  <span class=" close" @click="delItem(item)"><i class="sky-iconfont icon-guanbi"></i></span>
                  <component :is="item.loadComp" />
              </grid-item>
          </grid-layout>
      </div>
      <!-- 可拖入的组件部分 -->
      <div class="components-box">
          <div class="ctrl-box" v-for="item in componentsInfo" :key="item.id"
              @drag="drag" @dragstart="dragstart($event, item)" @dragend="dragend"
              draggable="true">
              {{item.des}}
          </div>
      </div>
  </div>
</template>

<script setup >
import { GridLayout, GridItem } from "vue3-drr-grid-layout"
import "vue3-drr-grid-layout/dist/style.css"
import { onMounted, ref, getCurrentInstance, defineAsyncComponent } from 'vue'

const gridLayoutRef = ref(null)
const { proxy } = getCurrentInstance()
const layout = ref([])
const colNum = 12
let defaultH = 2
let defaultW = 2
let mouseXY = {
  x: null,
  y: null
}
let DragPos = {
  x: null,
  y: null,
  w: null,
  h: null,
  i: null
}
const componentsInfo = [
  {
      id: '1-1',
      title: '图表-年度统计仪表盘',
      name: 'annualOutput',
      component: '/chart/Energy',
      des: '图表-年度统计仪表盘',
      w: 4,
      h: 8
  },
  {
      id: '1-2',
      title: '图表-月度统计折线图',
      name: 'MonthOutput',
      component: '/chart/Itot',
      des: '图表-月度统计折线图',
      w: 4,
      h: 8
  },
  {
      id: '1-3',
      title: '图表-日统计柱状图',
      name: 'dayOutput',
      component: '/chart/Volt',
      des: '图表-日统计柱状图',
      w: 4,
      h: 8
  }
]
let currentDragCom = null
onMounted(() => {
  document.addEventListener('dragover', (e) => {
      e.preventDefault()
      mouseXY.x = e.clientX;
      mouseXY.y = e.clientY;
  }, false);
  document.addEventListener('dragenter', function (event) {
      // 阻止默认行为
      event.preventDefault()
  });
  processLayout(layout.value)
})
// 处理布局数据中的组件
const processLayout = (layoutSetInfo) => {
  for (let i = 0; i < layoutSetInfo.length; i++) {
      let item = layoutSetInfo[i]
      if (!item.component) {
          continue
      }
      let resComp = loadComponent(item.component)
      item.loadComp = resComp
  }
}
// 引入组件
const loadComponent = (path) => {
  return defineAsyncComponent(() =>
      import(`@/views/lib${path}.vue`)
  )
}
const dragstart = (e, item) => {
  e.dataTransfer.effectAllowed = 'move'
  currentDragCom = item
  defaultH = item.h
  defaultW = item.w
}
const drag = (e, item) => {
  e.preventDefault && e.preventDefault()
  let parentRect = document.querySelector('.grid-box').getBoundingClientRect();
  let mouseInGrid = false;
  if (((mouseXY.x > parentRect.left) && (mouseXY.x < parentRect.right)) && ((mouseXY.y > parentRect.top) && (mouseXY.y < parentRect.bottom))) {
      mouseInGrid = true;
  }
  if (mouseInGrid === true && (layout.value.findIndex(item => item.i === 'drop')) === -1) {
      layout.value.push({
          x: (layout.value.length * 2) % (colNum || 12),
          y: layout.value.length + (colNum || 12),
          w: defaultW,
          h: defaultH,
          i: 'drop',
      });
  }
  let index = layout.value.findIndex(item => item.i === 'drop');
  if (index !== -1) {
      try {
          proxy.$refs.gridItem[layout.value.length - 1].$refs.item.style.display = "none";
      } catch {
      }
      let el = proxy.$refs.gridItem[index];
      if (el) {
          el.dragging = { "top": mouseXY.y - parentRect.top, "left": mouseXY.x - parentRect.left };
          let new_pos = el && calcXY(mouseXY.y - parentRect.top, mouseXY.x - parentRect.left);
          // let new_pos = {y:mouseXY.y - parentRect.top, x: mouseXY.x - parentRect.left};
          if (mouseInGrid === true) {
            console.log(gridLayoutRef.value)
              //  function dragEvent(eventName, id, x, y, h, w)
              gridLayoutRef.value.dragEvent('dragstart', 'drop', new_pos.x || 0, new_pos.y || 0, defaultH, defaultW);
              DragPos.i = String(new Date().getTime());
              DragPos.x = layout.value[index].x;
              DragPos.y = layout.value[index].y;
          }
          if (mouseInGrid === false) {
              gridLayoutRef.value.dragEvent('dragend', 'drop', new_pos.x || 0, new_pos.y || 0, defaultH, defaultW);
              layout.value = layout.value.filter(obj => obj.i !== 'drop');
          }
      }
  }
}
const dragend = (e) => {
  let parentRect = document.querySelector('.grid-box').getBoundingClientRect();
  let mouseInGrid = false;
  if (((mouseXY.x > parentRect.left) && (mouseXY.x < parentRect.right)) && ((mouseXY.y > parentRect.top) && (mouseXY.y < parentRect.bottom))) {
      mouseInGrid = true;
  }
  if (mouseInGrid === true) {
      gridLayoutRef.value.dragEvent('dragend', 'drop', DragPos.x, DragPos.y, defaultH, defaultW);
      let delIndex = layout.value.findIndex(item => item.i === 'drop')
      layout.value.splice(delIndex, 1)
      let loadComp = loadComponent(currentDragCom.component)
      layout.value.push({
          x: DragPos.x,
          y: DragPos.y,
          w: currentDragCom.w,
          h: currentDragCom.h,
          i: DragPos.i,
          component: currentDragCom,
          loadComp: loadComp
      });
      gridLayoutRef.value.dragEvent('dragend', DragPos.i, DragPos.x, DragPos.y, currentDragCom.h, currentDragCom.w);
      try {
          proxy.$refs.gridItem[layout.value.length].$refs.item.style.display = "block";
      } catch {
      }
  }
}
// 尺寸变更后，触发resize事件，使图表resize
const resizedEvent = e => {
  if (document.createEvent) {
      let ev = new Event('resize')
      window.dispatchEvent(ev)
  } else if (document.createEventObject) {
      window.fireEvent('onresize')
  }
}
// 删除item
const delItem = (item) => {
  let delIndex = layout.value.findIndex(el => el.i === item.i)
  layout.value.splice(delIndex, 1)
}

const calcXY = (el, top, left, width, height) => {
	  const colWidth = el.calcColWidth()
	  let x = Math.round((left - 10) / (colWidth + 10))
	  let y = Math.round((top - 10) / (el.rowHeight + 10))
	  const _width = width || el.innerW
	  const _height = height || el.innerH
	  x = Math.max(Math.min(x, el.cols - _width), 0)
	  y = Math.max(Math.min(y, el.maxRows - _height), 0)
	  return { x, y }
	}
</script>

<style scoped lang="scss">
.container {
  position: relative;
}
.grid-box {
  width: calc(100% - 320px);
  height: 100%;
}
.components-box {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 300px;
  border: 1px solid rgba(66, 66, 66, 1);
  padding: 12px 20px;
  .ctrl-box {
      height: 40px;
      padding: 0 12px;
      color: #fff;
      display: flex;
      align-items: center;
      background: #2d2d2c;
      border: 1px solid rgba(66, 66, 66, 1);
      margin-top: 20px;
      user-select: none;
      -webkit-user-select: none;
  }
}
</style>

<style lang="scss">
.vue-grid-layout {
  height: 100% !important;
  background: transparent;
  border: 1px solid rgba(66, 66, 66, 1);
  overflow: auto;
  .vue-grid-item {
      background: #2d2d2c;
      border: 1px solid rgba(66, 66, 66, 1);
      border-radius: 2px;
      padding: 12px 20px;
  }
  .close {
      display: inline-block;
      height: 16px;
      width: 16px;
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
      color: rgba(255, 255, 255, 0.6);
      i {
          font-size: 20px;
      }
      &:hover {
          color: #fff;
      }
  }
  .vue-grid-item.vue-resizable.vue-grid-placeholder {
      background: white !important;
  }
}
</style>