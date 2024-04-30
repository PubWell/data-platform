<template>
  <div class="moveable-ele-wrapper" :style="{'margin':gap+'px'}">
    <div class="element-box">
      <div class="moveable-element"
        v-for="element in elements"
        :key="element.i" :data-uuid="element.i"
        :class="{[element.i]: true}"
        :style="{
          'width': element.width + 'px',
          'height': element.height + 'px',
          'left': element.left + 'px', 
          'top': element.top + 'px',
        }"
      >
        <component :is="element.loadComp" />
      </div>
    </div>

    <Moveable
      ref="moveableRef"
      class="wrapper"
      :target="targets"
      v-bind="moveableConfig"
      @render="onRender"
      @renderGroup="onRenderGroup"
      @resizeEnd="handleResizeEnd"
      @dragEnd="handleDragEnd"
    >
    </Moveable>
    <!-- 
      v-for="element in elements"
      :key="element.uuid"
      
      v-bind:target="[`.${element.uuid}`]"

      @drag="handleDrag"
      @resize="handleResize"

      @render="onRender"
      @renderGroup="onRenderGroup"
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
import Moveable from 'vue3-moveable'
// https://daybrush.com/moveable/?from=madewith.cn
// https://daybrush.com/moveable/release/latest/doc/Moveable.Snappable.html#elementGuidelines
// https://daybrush.com/moveable/storybook/?path=/story/snap-bound--snap-bound-drag-resize
import Selecto from "vue3-selecto"
// https://daybrush.com/moveable/storybook/?path=/story/request-ables-through-a-method--request-draggable-align

// https://zhuanlan.zhihu.com/p/652153362

import { customLayoutStore } from '@/stores'

const props = defineProps({
  rowHeight: {
    type: Number,
  },
  colWidth: {
    type: Number,
  },
  pageRows: {
    type: Number,
  }
})
const emits = defineEmits(['layout-add','layout-change'])

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

const moveableRef = ref(null)
const targets = ref([])
const chartDemoRef = ref(null)

const elements = ref([
  {
    i: 'id1',
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    rotate: 0,
    translate: [0, 0, 0, 0],
    path:  '/src/views/lib/chart/itot/index.vue'
  }, {
    i: 'id2',
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    rotate: 0,
    translate: [0, 0, 0, 0],
    path: '/src/views/lib/chart/volt/index.vue'
  }, {
    i: 'id3',
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    rotate: 0,
    translate: [0, 0, 0, 0],
    path: '/src/views/lib/chart/energy/index.vue'
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
    elementGuidelines: elements.value.map((item) => {return {element: `.${item.i}`, className: 'red'}}),
    bounds: { // 限制外框范围
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      position: 'css'
    },
    horizontalGuidelines: Array.from({ length: rows.value }, (_, index) => index * (props.rowHeight + gap.value))
                          .reduce((pre, cur) => {
                            pre.push(cur)
                            pre.push(cur+props.rowHeight)
                            return pre
                          }, []),
    verticalGuidelines: Array.from({ length: cols.value }, (_, index) => index * (props.colWidth + gap.value))
                        .reduce((pre, cur) => {
                          pre.push(cur)
                          pre.push(cur+props.colWidth)
                          return pre
                        }, []),

    // 【 others 】
    origin: false, // 原点控制箱是否可见
    linePadding: 10
  }
})

const selectoConfig = computed(() => {
  return {
    dragContainer: '.element-box',
    selectableTargets: ['.moveable-element'],
    hitRate: 0,
    selectByClick: true,
    selectFromInside: true,
    toggleContinueSelect: ['shift'],
    ratio: 0,
  }
})

onMounted(() => {
  initComp()
})

// watch(
//   () => props.pageRows,
//   () => {
//     moveableConfig.value.horizontalGuidelines = 
//       Array.from({ length: props.pageRows }, (_, index) => index * (props.rowHeight + gap.value))
//       .reduce((pre, cur) => {
//         pre.push(cur)
//         pre.push(cur+props.rowHeight)
//         return pre
//       }, [])
//   }
// )

watch(
  () => [props.rowHeight, props.colWidth],
  (newVal, oldVal) => {
    moveableConfig.value.horizontalGuidelines = 
      Array.from({ length: rows.value }, (_, index) => index * (props.rowHeight + gap.value))
      .reduce((pre, cur) => {
        pre.push(cur)
        pre.push(cur+props.rowHeight)
        return pre
      }, [])
    moveableConfig.value.verticalGuidelines = 
      Array.from({ length: cols.value }, (_, index) => index * (props.colWidth + gap.value))
      .reduce((pre, cur) => {
        pre.push(cur)
        pre.push(cur+props.colWidth)
        return pre
      }, [])

    if(oldVal[0] && oldVal[1]){
      elements.value.forEach((item, index) => {
        let w = getCols(item.width, oldVal[1]),
            h = getCols(item.height, oldVal[0]),
            l = getCols(item.left, oldVal[1]),
            t = getCols(item.top, oldVal[0])
        // console.log(item, oldVal, w, h, l, t)
        item.width = w.cols * newVal[1] + w.gaps * gap.value
        item.height = h.cols * newVal[0] + h.gaps * gap.value
        item.left = l.cols * newVal[1] + l.gaps * gap.value
        item.top = t.cols * newVal[0] + t.gaps * gap.value

        let dom = document.querySelector(`.${item.i}`),
            reg = /(\-)?[0-9]+[\.0-9]?/g,
            transformArr = dom.style.transform.match(reg)
        if(transformArr){
          let tl = getCols(Number(transformArr[0]), oldVal[1]),
              tt = getCols(Number(transformArr[1]), oldVal[0])
          dom.style.transform = `translate(${tl.cols * newVal[1] + l.gaps * gap.value}px, ${tt.cols * newVal[0] + t.gaps * gap.value}px)`
        }
      })
    }else{
      initComp()
    }
  },{deep: true}
)

const initComp = () => {
  elements.value.forEach((item, index) => {
    let resComp = markRaw(loadComponent(item.path))
    item.loadComp = resComp
    item.width = 4 * props.colWidth + 3 * gap.value
    item.height = 3 * props.rowHeight + 2 * gap.value
    item.left = 4 * (props.colWidth + gap.value) * index
  })
}

// 引入组件
const loadComponent = (path) => {
  return defineAsyncComponent(() =>
    import(path)
  )
}

const getCols = (width, colWidth) => {
  let num = Math.floor(width / (colWidth + gap.value)),
      k = Number((colWidth / (colWidth + gap.value)).toFixed(6)),
      cols = 0,
      gaps = 0,
      n = width % (colWidth + gap.value),
      nk = Number((n / (colWidth + gap.value)).toFixed(6))

  if(nk < 0.000001){
    cols = gaps = num
  }else if(nk >= k){
    cols = num + 1
    gaps = nk > k ? num + 1 : num
  }else{
    cols = (width - num * gap.value) / colWidth
    gaps = Math.floor(cols)
  }
  return {
    cols,
    gaps
  }
}

const onRender = (e) => {
  // console.log('render>>>>>>',e)
  e.target.style.cssText += e.cssText
}

const onRenderGroup = (e) => {
  e.events.forEach(ev => {
    ev.target.style.cssText += ev.cssText
  })
}

const handleDragEnd = (e) => {
  console.log('handleDragEnd>>>>>>>>>>', e, elements.value)
  let idx = findElementIdx(e.target)
  elements.value[idx].translate = e.lastEvent.translate
  // e.target.style.transform = 'unset'
  // elements.value[idx].left = elements.value[idx].left + e.lastEvent.translate[0]
  // elements.value[idx].top = elements.value[idx].top + e.lastEvent.translate[1]
}

const handleResizeEnd = ({ target, width, height, delta, drag }) => {
  let idx = findElementIdx(target)
  elements.value[idx].width = width
  elements.value[idx].height = height
}

// const handleScale = ({ target, transform, scale }) => {
//   target.style.transform = transform
// }

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

const findElementIdx = (target) => {
  let eleUuid = target.dataset.uuid, idx = elements.value.findIndex((item) => item.i === eleUuid )
  return idx
}
</script>

<style lang="scss" scoped>
.moveable-ele-wrapper {
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  position: relative;
  .wrapper {
    // position: absolute;
  }
  .element-box{
  width: 100%;
  height: 100%;
  .moveable-element {
    position: absolute;
    border: 1px solid green;
    // width: 600px;
    // height: 400px;
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
