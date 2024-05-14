<template>
  <div class="wh-100 mind-map-wrapper">
    <!-- <div class="zoom-level">
      {{ `${(zoomLevel * 100).toFixed(0)}%` }}<br/>
      {{ viewInfo }}<br/>
      {{ `containerW ${viewInfo.containerW}: ${viewInfo.mindMapW} + ${viewInfo.x} = ${viewInfo.mindMapW + viewInfo.x} -> scrollbarX: ${viewInfo.scrollbarX}`  }}<br/>
      {{ `containerH ${viewInfo.containerH}: ${viewInfo.mindMapH} + ${viewInfo.y} = ${viewInfo.mindMapH + viewInfo.y} -> scrollbarY: ${viewInfo.scrollbarY}`  }}
    </div> -->

    <div id="mindMapContainer"></div>

    <!-- 垂直 -->
    <div
      v-show="showVerticalScrollbar"
      ref="verticalScrollbarRef"
      class="scrollbar verticalScrollbar"
      @click="onVerticalScrollbarClick"
    >
      <div
          class="scrollbarInner"
          :style="verticalScrollbarStyle"
          @click.stop
          @mousedown="onVerticalScrollbarMousedown"
      ></div>
    </div>

    <!-- 水平 -->
    <div
      v-show="showHorizontalScrollbar"
      ref="horizontalScrollbarRef"
      class="scrollbar horizontalScrollbar"
      @click="onHorizontalScrollbarClick">
      <div
          class="scrollbarInner"
          :style="horizontalScrollbarStyle"
          @click.stop
          @mousedown="onHorizontalScrollbarMousedown"
      ></div>
    </div>

    <Tool
      v-if="tool.show"
      ref="toolRef"
      :node="tool.node"
      :left="tool.left"
      :top="tool.top"
      :scaleX="tool.scaleX"
      :scaleY="tool.scaleY"
      @addBrother="onAddBrother"
      @addChild="onAddChild"
      @delete="onDelete"
      @addImage="onAddImage"
      @changeLayout="onChangeLayout"
    />

    <ContextMenu
      v-if="contextMenu.show"
      ref="contextMenuRef"
      :node="contextMenu.node"
      :type="contextMenu.type"
      :left="contextMenu.left"
      :top="contextMenu.top"
      :scaleX="contextMenu.scaleX"
      :scaleY="contextMenu.scaleY"
      @exec-command="onExec"
    />

    <ToolBar
      :isStart="toolbar.isStart"
      :isEnd="toolbar.isEnd"
      :scale="zoomLevel"
      @back="onBack"
      @next="onNext"
      @import="onImport"
      @export="onExport"
      @fit="onFit"
      @changeLayout="onChangeLayout"
      @changeLine="onChangeLine"
      @changeScale="onChangeScale"
      @changeMode="onChangeMode"
      @changeThemeConfig="onChangeThemeConfig"
    />

    <Edit
      v-if="edit.show"
      ref="editRef"
      :node="edit.node"
      @update-node="onUpdateNode"
      @exec-command="onExec"
    />
  </div>
</template>

<script setup>
// https://svgjs.dev/docs/3.0/animating/#orchestrate-animations
import { ref, onMounted, shallowRef } from 'vue'
// https://wanglin2.github.io/mind-map/#/doc/zh/course2
import MindMap from "./mind-map-main/simple-mind-map"
import Drag from './mind-map-main/simple-mind-map/src/plugins/Drag.js'
import ExportPDF from './mind-map-main/simple-mind-map/src/plugins/ExportPDF.js'
import Export from './mind-map-main/simple-mind-map/src/plugins/Export.js'
import Scrollbar from './mind-map-main/simple-mind-map/src/plugins/Scrollbar.js'

import Tool from './components/Tool.vue'
import Edit from './components/Edit.vue'
import ContextMenu from './components/ContextMenu.vue'
import ToolBar from './components/ToolBar.vue'
import DeviceNode from './components/device-node/index.vue'
import { getTextFromHtml } from './mind-map-main/simple-mind-map/src/utils'
import { createApp } from "vue"
import { themeConfig, data } from './components/hooks.js'

const toolRef = ref(null)
const tool = reactive({
  show: false,
  node: null,
  left: 0,
  top: 0,
  scaleX: 1,
  scaleY: 1,
})
const contextMenuRef = ref(null)
const contextMenu = reactive({
  node: null,
  show: false,
  type: '',
  left: 0,
  top: 0,
  scaleX: 1,
  scaleY: 1,
  mousedownX: 0,
  mousedownY: 0,
  isMousedown: false
})
const toolbar = reactive({
  isStart: true,
  isEnd: true,
})
const edit = reactive({
  show: false,
  node: null
})
const operate = ref(false)
const dragMark = ref(false)
const activeNodes = shallowRef([])
const mindMapLayout = ref('organizationStructure')
const mindMapData = ref()
const initPos = ['center', '10%']

const showVerticalScrollbar = ref(false)
const showHorizontalScrollbar = ref(false)
const verticalScrollbarRef = ref(null)
const horizontalScrollbarRef = ref(null)
const verticalScrollbarStyle = ref({
  top: 0,
  height: 0
})
const horizontalScrollbarStyle = ref({
  left: 0,
  width: 0
})
const zoomLevel = ref(1)
const viewInfo = reactive({
  containerW: 0,
  containerH: 0,
  mindMapW: 0,
  mindMapH: 0,
  scrollMapW: 0,
  scrollMapH: 0
})

let mindMap = null
MindMap.usePlugin(Drag)
  .usePlugin(ExportPDF)
  .usePlugin(Export)
  .usePlugin(Scrollbar)

onMounted(() => {
  mindMap = new MindMap({
    el: document.getElementById('mindMapContainer'),
    layout: mindMapLayout.value,
    data: {...data},
    initRootNodePosition: initPos,
    // fit: true,
    alwaysShowExpandBtn: true,
    enableFreeDrag: false,
    scaleRatio: 0.05,
    // 自定义鼠标滚轮事件处理，可以传一个函数，回调参数为事件对象
    // customHandleMousewheel: () => {
    //   return false
    // },
    mousewheelAction: 'zoom',
    // 是否禁止鼠标滚轮缩放
    // disableMouseWheelZoom: true,
    // 是否禁止拖动画布
    // isDisableDrag: true,
    // 当注册了滚动条插件（Scrollbar）时，是否将思维导图限制在画布内
    isLimitMindMapInCanvasWhenHasScrollbar: false,
    // 鼠标缩放是否以鼠标当前位置为中心点，否则以画布中心点
    mouseScaleCenterUseMousePosition: true,
    // 当mousewheelAction设为zoom时，或者按住Ctrl键时，默认向前滚动是缩小，向后滚动是放大，如果该属性设为true，那么会反过来
    mousewheelZoomActionReverse: true,
    // 自定义节点的内容
    isUseCustomNodeContent: true,
    customCreateNodeContent: (node) => {
      let el = document.createElement('div')
      const app = createApp(DeviceNode, {// props
        node: node.nodeData.data,
        layout: mindMapLayout.value
      })
      app.mount(el)
      return el
    },
    themeConfig: {
      ...themeConfig
    }
  })

  // 监听节点激活事件
  mindMap.on('node_active', onNodeActive)

  // 监听draw拖拽事件
  // mindMap.on('drag', (e) => {})
  // // 监听node拖拽事件
  // mindMap.on('node_dragging', (e, t) => {
  //   console.log('node_dragging>>>>>>>>>')
  // })
  // // 监听node拖拽结束事件
  // mindMap.on('node_dragend', (e, t) => {
  //   console.log('node_dragend>>>>>>>>>')
  // })

  mindMap.on('view_data_change', mindMapViewChange)

  mindMap.on('node_contextmenu', showContextMenuWithNode)
  mindMap.on('node_click', hideContextMenu)
  mindMap.on('draw_click', hideContextMenu)
  mindMap.on('expand_btn_click', hideContextMenu)
  mindMap.on('translate', hideContextMenu)

  mindMap.on('svg_mousedown', onMousedown)
  mindMap.on('mouseup', onMouseup)

  mindMap.on('back_forward', stepControl)

  window.addEventListener('resize', resizeHandler)

  // 如果容器大小发生了改变需要再次调用该方法
  // initScrollbar()
  
  // 监听scrollbar_change方法来获取滚动条大小和位置数据
  mindMap.on('scrollbar_change', updateScrollbar)

  mindMap.on('expand_btn_click', (e) => {
    console.log(e)
  })
})

onBeforeUnmount(() => {
  mindMap.off('view_data_change', mindMapViewChange)
  // 取消事件监听
  mindMap.off('node_active', onNodeActive)

  mindMap.off('node_contextmenu', showContextMenuWithNode)
  mindMap.off('node_click', hideContextMenu)
  mindMap.off('draw_click', hideContextMenu)
  mindMap.off('expand_btn_click', hideContextMenu)
  mindMap.off('translate', hideContextMenu)

  mindMap.off('svg_mousedown', onMousedown)
  mindMap.off('mouseup', onMouseup)

  mindMap.off('back_forward', stepControl)

  window.removeEventListener('resize', resizeHandler)

  mindMap.off('scrollbar_change', updateScrollbar)
  mindMap.destroy()
})

const mindMapViewChange = () => {
  zoomLevel.value = mindMap.getSvgData().scaleX
  // initScrollbar()
}

const resizeHandler = () => {
  mindMap.resize()
  // onExec('FIT_CANVAS')
  // initScrollbar()
}

const initScrollbar = () => {
  setTimeout(() => {
    let dom = document.getElementById('mindMapContainer'), {width: containerW, height: containerH} = dom.getBoundingClientRect()
    let cfg = mindMap.getSvgData(), {width: mindMapW, height: mindMapH} = cfg.rect
    let width = containerW, height = containerH
    // console.log(cfg)
    // console.log(containerW, containerH, cfg)
    showHorizontalScrollbar.value = false
    showVerticalScrollbar.value = false

    if(mindMapW * cfg.scaleX > containerW){
      showHorizontalScrollbar.value = true
      // 水平滚动条容器的宽度
      width = horizontalScrollbarRef.value.getBoundingClientRect().width
    }
    if(mindMapH * cfg.scaleY > containerH){
      showVerticalScrollbar.value = true
      // 垂直滚动条容器的高度
      height = horizontalScrollbarRef.value.getBoundingClientRect().height
    }
    viewInfo.containerW = containerW
    viewInfo.containerH = containerH
    viewInfo.mindMapW = mindMapW * cfg.scaleX
    viewInfo.mindMapH = mindMapH * cfg.scaleY
    viewInfo.scrollMapW = width
    viewInfo.scrollMapH = height
    viewInfo.scale = cfg.scaleX
    viewInfo.x = cfg.rect.x
    viewInfo.y = cfg.rect.y
    viewInfo.scrollbarX = mindMapW * cfg.scaleX + cfg.rect.x > containerW
    viewInfo.scrollbarY = mindMapH * cfg.scaleY + cfg.rect.y > containerH

    mindMap.scrollbar.setScrollBarWrapSize(mindMapW, mindMapH)
  }, 100);
}

const updateScrollbar = (data) => {
  const {
    vertical,
    horizontal
  } = data
  verticalScrollbarStyle.value = {
    top: vertical.top + '%',
    height: vertical.height + '%'
  }
  horizontalScrollbarStyle.value = {
    left: horizontal.left + '%',
    width: horizontal.width + '%'
  }
}

// 给滚动条元素绑定mousedown事件，并且调用插件的onMousedown方法,这样就能实现鼠标拖动滚动条更新画布位置的功能
const onVerticalScrollbarMousedown = (e) => {
  // 垂直滚动条元素
  mindMap.scrollbar.onMousedown(e, 'vertical')
}

const onHorizontalScrollbarMousedown = (e) => {
  // 水平滚动条元素
  mindMap.scrollbar.onMousedown(e, 'horizontal')
}

// 如果还需要实现点击滚动条容器元素实现滚动条位置的跳变功能，那么需要给滚动条元素绑定点击事件，并且调用插件的onClick方法
const onVerticalScrollbarClick = (e) => {
  // 垂直滚动条元素
  mindMap.scrollbar.onClick(e, 'vertical')
}

const onHorizontalScrollbarClick = (e) => {
  // 水平滚动条元素
  mindMap.scrollbar.onClick(e, 'horizontal')
}

const getContextMenuPosition = (x, y) => {
  let contextMenuRect = contextMenuRef.value.getRect()
  if (x + contextMenuRect.width > window.innerWidth) {
    x = x - contextMenuRect.width - 20
  }
  if (y + contextMenuRect.height > window.innerHeight) {
    y = window.innerHeight - contextMenuRect.height - 10
  }
  return { x, y }
}

const showContextMenuWithNode = (e, node) => {
  contextMenu.type = 'node'
  contextMenu.node = node
  contextMenu.show = true
  nextTick(() => {
    const { x, y } = getContextMenuPosition(e.clientX + 10, e.clientY + 10)
    contextMenu.left = x
    contextMenu.top = y
  })
  if(tool.show){
    tool.show = false
  }
}

const hideContextMenu = () => {
  contextMenu.show = false
  contextMenu.type = ''
  contextMenu.node = null
  contextMenu.left = -9999
  contextMenu.top = -9999
}

// 鼠标按下事件
const onMousedown = (e) => {
  // 如果不是右键点击直接返回
  if (e.which !== 3) {
    return
  }
  contextMenu.mousedownX = e.clientX
  contextMenu.mousedownY = e.clientY
  contextMenu.isMousedown = true
}

// 鼠标松开事件
const onMouseup = (e) => {
  if (!contextMenu.isMousedown) {
    return
  }
  contextMenu.isMousedown = false
  if (
    Math.abs(contextMenu.mosuedownX - e.clientX) > 3 ||
    Math.abs(contextMenu.mosuedownY - e.clientY) > 3
  ) {
    hideContextMenu()
    return
  }
  showContextMenuWithSvg(e)
}

const showContextMenuWithSvg = (e) => {
  contextMenu.type = 'svg'
  contextMenu.show = true
  contextMenu.node = null
  nextTick(() => {
    const { x, y } = getContextMenuPosition(e.clientX + 10, e.clientY + 10)
    contextMenu.left = x
    contextMenu.top = y
  })
  if(tool.show){
    tool.show = false
  }
}

const onNodeActive = (node, nodeList) => {
  if(!contextMenu.show && nodeList.length === 1 && node && node.uid === nodeList[0].uid){
    // initTool(node)
    initEdit(node)
  }else{
    tool.show = false
    dragMark.value = false
    operate.value = false

    edit.show = false

  }
  activeNodes.value = nodeList
}

const initTool = (node) => {
  tool.node = node
  tool.show = true
  let nodeRect = node.getRectInSvg()
  // console.log(nodeRect)
  
  let cfg = mindMap.getSvgData()
  // console.log(cfg)

  tool.scaleX = cfg.scaleX
  tool.scaleY = cfg.scaleY

  nextTick(() => {
    let toolRect = toolRef.value.getRect(), initW = toolRect.width / cfg.scaleX, intH = toolRect.height / cfg.scaleY
    let offsetLeft = initW * ( cfg.scaleX - 1 ) / 2, offsetTop = intH * ( cfg.scaleY - 1 ) / 2
    // console.log(cfg.scaleX, cfg.scaleY, toolRect,offsetLeft,offsetTop)

    tool.left = nodeRect.left + nodeRect.width/2 - toolRect.width/2 + offsetLeft
    tool.top = nodeRect.top - toolRect.height + offsetTop - toolRect.height * 0.25
  })
}

const initEdit = (node) => {
  edit.node = node
  edit.show = true
}

const onUpdateNode = (e) => {
  // let data = {
  //   ...edit.node.nodeData.data,
  //   [e.key]: e.value
  // }

  // activeNodes.value[0].setData(data)
  // mindMapData.value = mindMap.getData(true)
  // mindMap.setFullData(mindMapData.value)

  if(e.key == 'text'){
    activeNodes.value[0].setText(e.value)
  }else{
    // activeNodes.value[0].setData(data)
    // activeNodes.value[0].updateNodeShape()
    // activeNodes.value[0].render()

    // mindMap.reRender()
    mindMap.execCommand('SET_NODE_DATA', activeNodes.value[0], {[e.key]: e.value})
  }
}

const onChangeThemeConfig = (e) => {


  let cfg = {
    ...themeConfig,
    [e.key]: e.value,
  }

  mindMap.setThemeConfig(cfg, false)
}

const onAddBrother = () => {
  operate.value = true
  onExec('INSERT_NODE', false, false)
}

const onAddChild = () => {
  operate.value = true
  onExec('INSERT_CHILD_NODE', false, false)
}

const onDelete = () => {
  operate.value = true
  onExec('REMOVE_NODE', false, false)
}

const onAddImage = () => {
  activeNodes.value[0].setImage({
    url: '图片url',
    title: '图片的标题或描述',
    width: 100,// 图片的宽高也不能
    height: 100
  })
}

const onChangeLayout = (e) => {
  mindMapLayout.value = e
  mindMap.setLayout(e)
  mindMap.reRender()
  setTimeout(() => {
    onExec('FIT_CANVAS')
    // initScrollbar()
  }, 50)
}

const onChangeLine = (e) => {
  let cfg = {
    ...themeConfig,
    lineStyle: e,
  }
  mindMap.setThemeConfig(cfg, false)
}

const onChangeScale = (e) => {
  mindMap.view.setScale(e, 'center', 'center')
}

const onChangeMode = (e) => {
  let mode = e ? 'edit' : 'readonly'
  mindMap.setMode(mode)
  // onFit()
  mindMap.updateConfig({
    isDisableDrag: e ? false : true,
    disableMouseWheelZoom: e ? false : true
  })
}
// 执行命令
const onExec = (key, disabled, ...args) => {
  if (disabled) {
    return
  }
  let node = activeNodes.value[0]
  switch (key) {
    case 'COPY_NODE':
      mindMap.renderer.copy()
      break
    case 'CUT_NODE':
      mindMap.renderer.cut()
      break
    case 'PASTE_NODE':
      mindMap.renderer.paste()
      break
    case 'RETURN_CENTER':
      mindMap.renderer.setRootNodeCenter()
      break
    // case 'TOGGLE_ZEN_MODE':
    //   this.setLocalConfig({
    //     isZenMode: !this.isZenMode
    //   })
    //   break
    case 'FIT_CANVAS':
      mindMap.view.fit()
      break
    case 'REMOVE_HYPERLINK':
      node.setHyperlink('', '')
      break
    case 'REMOVE_NOTE':
      node.setNote('')
      break
    case 'EXPORT_CUR_NODE_TO_PNG':
      mindMap.export(
        'png',
        true,
        'demo',
        false,
        node
      )
      break
    default:
      mindMap.execCommand(key, ...args)
      break
  }
  contextMenu.show = false
  // initScrollbar()
}

const stepControl = (index, len) => {
  toolbar.isStart = index <= 0
  toolbar.isEnd = index >= len - 1
}

const onBack = () => {
  if(!toolbar.isStart){
    // 回退一次
    onExec('BACK')
  }
}

const onNext = () => {
  if(!toolbar.isEnd){
    // 前进一次
    onExec('FORWARD')
  }
}

const onImport = () => {
  mindMap.setFullData(mindMapData.value)
  // initScrollbar()
}

const onExport = () => {
  let cfg = mindMap.getSvgData()
  console.log(cfg)
  mindMapData.value = mindMap.getData(true)
  console.log(mindMapData.value)
  mindMap.clearDraw()
  // onExec('EXPORT_CUR_NODE_TO_PNG')
}

const onFit = () => {
  onExec('FIT_CANVAS')
}
</script>

<style lang="scss">
  /* @import "simpleMindMap.esm.css"; */
  
  .mind-map-wrapper{
    position: relative;
    .zoom-level{
      position: absolute;
      z-index: 20;
      left: 30px;
      top: 30px;
    }
  }
  #mindMapContainer {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  #mindMapContainer * {
    margin: 0;
    padding: 0;
  }
  .scrollbar {
    position: relative;
    background-color: #f5f5f5;
    border-radius: 10px;
    overflow: hidden;

    &.verticalScrollbar {
      width: 10px;
      height: 100%;

      .scrollbarInner {
        width: 10px;
        left: 0;
      }
    }

    &.horizontalScrollbar {
      width: 100%;
      height: 10px;

      .scrollbarInner {
        height: 10px;
        top: 0;
      }
    }

    .scrollbarInner {
      position: absolute;
      background-color: #ccc;
      border-radius: 10px;
    }
  }
</style>