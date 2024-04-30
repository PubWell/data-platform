<template>
  <div class="moveable-ele-wrapper">
    <div class="element-box">
      <div class="element" v-for="element in elements" :key="element.uuid" :data-uuid="element.uuid" :class="{[element.uuid]: true}" :style="{'left': element.left, 'top': element.top}">
        <ChartDemo ref="chartDemoRef" :info="element.info"/>
      </div>
    </div>

    <Moveable
      ref="moveableRef"
      class="wrapper"
      :target="targets"
      v-bind="moveableConfig"
      @render="onRender"
      @renderGroup="onRenderGroup"
      @resize="handleResize"
    >
    </Moveable>
    <!-- 
      v-for="element in elements"
      :key="element.uuid"
      
      v-bind:target="[`.${element.uuid}`]"

      @drag="handleDrag"
      @resize="handleResize"
     -->
    <Selecto
      v-bind="selectoConfig"
      @dragStart="onDragStart"
      @selectEnd="onSelectEnd"
    />
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import ChartDemo from '../ChartDemo.vue'
import Moveable from 'vue3-moveable'
// https://daybrush.com/moveable/?from=madewith.cn
// https://daybrush.com/moveable/release/latest/doc/Moveable.Snappable.html#elementGuidelines
// https://daybrush.com/moveable/storybook/?path=/story/snap-bound--snap-bound-drag-resize
import Selecto from "vue3-selecto"
// https://daybrush.com/moveable/storybook/?path=/story/request-ables-through-a-method--request-draggable-align

// https://zhuanlan.zhihu.com/p/652153362
const moveableRef = ref(null)
const targets = ref([])
const chartDemoRef = ref(null)
let info = {
  x: [],
  y: [],
  fun: 1,
  colorType: 1,
  seriesType: 2,
}
onMounted(() => {
  // setTimeout(() => {
  //   elements.value.push({
  //     uuid: 'ddd',
  //     width: 0,
  //     height: 0,
  //     top: 0,
  //     left: 0,
  //     rotate: 0
  //   })
  // }, 2000);
})

const elements = ref([
  {
    uuid: 'aaa',
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    rotate: 0,
    info: {...info, id: 1}
  }, {
    uuid: 'bbb',
    width: 0,
    height: 0,
    top: 0,
    left: '3.22917rem',
    rotate: 0,
    info: {...info, id: 1}
  }, {
    uuid: 'ccc',
    width: 0,
    height: 0,
    top: '2.1875rem',
    left: 0,
    rotate: 0,
    info: {...info, id: 1}
  }
])

const moveableConfig = computed(() => {
  return {
    // 【 draggable 】
    draggable: true,
    // throttleDrag: 1, // 步长，默认 0
    // throttleDragRotate: 0, // 拖拽角度，默认 0 不限制
    // startDragRotate: 0, // 初始拖拽角度
    // 边界
    edgeDraggable: false, // 是否通过拖动边缘线移动，默认 false
    edge: [],

    // 【 resizable 】
    resizable: true,
    throttleResize: 1,
    renderDirections: ["nw","n","ne","w","e","sw","s","se"],
    keepRatio: false,

    // 【 snappable 】
    snappable: true,
    snapGridWidth: 50,
    elementGuidelines: elements.value.map((item) => {return {element: `.${item.uuid}`, className: 'red'}}),
    bounds: { // 限制外框范围
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      position: 'css'
    },

    // 【 others 】
    origin: false, // 原点控制箱是否可见
    linePadding: 10
  }
})

const selectoConfig = computed(() => {
  return {
    dragContainer: '.element-box',
    selectableTargets: ['.element'],
    hitRate: 0,
    selectByClick: true,
    selectFromInside: true,
    toggleContinueSelect: ['shift'],
    ratio: 0,
  }
})

const onRender = e => {
  e.target.style.cssText += e.cssText
}

const onRenderGroup = e => {
  e.events.forEach(ev => {
    ev.target.style.cssText += ev.cssText
  })
}

const handleDrag = ({ target, transform }) => {
  target.style.transform = transform;
}

const handleResize = ({ target, width, height, delta, drag }) => {
  // delta[0] && (target.style.width = `${width}px`);
  // delta[1] && (target.style.height = `${height}px`);
  // target.style.transform = drag.transform;
  let eleUuid = target.dataset.uuid, chartIdx = elements.value.findIndex((item) => item.uuid === eleUuid )
  chartDemoRef.value[chartIdx].update()
  
}

const handleScale = ({ target, transform, scale }) => {
  target.style.transform = transform;
}

const onDragStart = (e) => {
  const moveable = moveableRef.value
  const target = e.inputEvent.target
  if (target.tagName === "BUTTON" || moveable.isMoveableElement(target)
    || targets.value.some(t => t === target || t.contains(target))
  ) {
    e.stop()
  }
}

const onSelectEnd = (e) => {
  const moveable = moveableRef.value
  if (e.isDragStart) {
    e.inputEvent.preventDefault()
    moveable.waitToChangeTarget().then(() => {
      moveable.dragStart(e.inputEvent)
    })
  }
  targets.value = e.selected
}
</script>

<style lang="scss" scoped>
.moveable-ele-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  .wrapper {
    // position: absolute;
  }
  .element-box{
  width: 100%;
  height: 100%;
  .element {
    position: absolute;
    border: 1px solid green;
    width: 600px;
    height: 400px;
    // position: relative;
    // overflow: scroll;
    // word-break: break-all;
    // text-align: left;
    h3{
      font-weight: bold;
      text-align: center;
      line-height: 100px;
    }
  }
  }
}
</style>
