<template>
  <div class="wh-100 mind-map-wrapper">
    <div id="mindMapContainer"></div>

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
      @back="onBack"
      @next="onNext"
      @export="onExport"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, shallowRef } from 'vue'
// https://wanglin2.github.io/mind-map/#/doc/zh/course2
import MindMap from "./mind-map-main/simple-mind-map"
import Drag from './mind-map-main/simple-mind-map/src/plugins/Drag.js'

import Tool from './components/Tool.vue'
import ContextMenu from './components/ContextMenu.vue'
import ToolBar from './components/ToolBar.vue'
import { getTextFromHtml } from './mind-map-main/simple-mind-map/src/utils'

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
const operate = ref(false)
const dragMark = ref(false)
const activeNodes = shallowRef([])

let mindMap = null
MindMap.usePlugin(Drag)

onMounted(() => {
  mindMap = new MindMap({
    el: document.getElementById('mindMapContainer'),
    layout: 'logicalStructure',
    data: {
      "data": {
        "text": "Root",
        "uid": "root"
      },
      "children": [
        {
          "data": {
            "text": "1",
            "uid": "1"
          },
          "children": []
        },
        {
          "data": {
            "text": "2",
            "uid": "2"
          },
          "children": []
        },
        {
          "data": {
            "text": "3",
            "uid": "3"
          },
          "children": []
        }
      ]
    },
    initRootNodePosition: ['center', 'center'],
    enableFreeDrag: true,
    mousewheelAction: 'zoom',
    // 鼠标缩放是否以鼠标当前位置为中心点，否则以画布中心点
    mouseScaleCenterUseMousePosition: true,
    // 当mousewheelAction设为zoom时，或者按住Ctrl键时，默认向前滚动是缩小，向后滚动是放大，如果该属性设为true，那么会反过来
    mousewheelZoomActionReverse: true,
    // 自定义节点的内容
    isUseCustomNodeContent: true,
    customCreateNodeContent: (node) => {

    }
  })

  // 监听节点激活事件
  mindMap.on('node_active', onNodeActive)

  // 监听draw拖拽事件
  mindMap.on('drag', (e, t) => {
    // if(activeNodes.value.length){
    //   dragMark.value = true
    // }

    // mindMap.renderer.closeHighlightNode()
    // mindMap.renderer.clearActiveNode()
  })

  // // 监听node拖拽事件
  // mindMap.on('node_dragging', (e, t) => {
  //   console.log('node_dragging>>>>>>>>>')
  // })
  // // 监听node拖拽结束事件
  // mindMap.on('node_dragend', (e, t) => {
  //   console.log('node_dragend>>>>>>>>>')
  // })

  mindMap.on('node_contextmenu', showContextMenuWithNode)
  mindMap.on('node_click', hideContextMenu)
  mindMap.on('draw_click', hideContextMenu)
  mindMap.on('expand_btn_click', hideContextMenu)
  mindMap.on('translate', hideContextMenu)

  mindMap.on('svg_mousedown', onMousedown)
  mindMap.on('mouseup', onMouseup)

  mindMap.on('back_forward', stepControl)
})

onBeforeUnmount(() => {
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
})

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
  if(!operate.value && !dragMark.value && !contextMenu.show && nodeList.length === 1 && node && node.uid === nodeList[0].uid){
    initTool(node)
  }else{
    tool.show = false
    dragMark.value = false
    operate.value = false
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

const onAddBrother = () => {
  operate.value = true
  // mindMap.execCommand('INSERT_NODE', false)
  onExec('INSERT_NODE', false, false)
}

const onAddChild = () => {
  operate.value = true
  // mindMap.execCommand('INSERT_CHILD_NODE', false)
  onExec('INSERT_CHILD_NODE', false, false)
}

const onDelete = () => {
  operate.value = true
  // mindMap.execCommand('REMOVE_NODE', false)
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
  mindMap.setLayout(e)
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
        getTextFromHtml(node.getData('text')),
        false,
        node
      )
      break
    default:
      mindMap.execCommand(key, ...args)
      break
  }
  contextMenu.show = false
}

const stepControl = (index, len) => {
  toolbar.isStart = index <= 0
  toolbar.isEnd = index >= len - 1
}

const onBack = () => {
  if(!toolbar.isStart){
    // 回退一次
    mindMap.execCommand('BACK')
  }
}

const onNext = () => {
  if(!toolbar.isEnd){
    // 前进一次
    mindMap.execCommand('FORWARD')
  }
}

const onExport = () => {
  console.log('export>>>>>>>>>>>>>>>')
  mindMap.export('png', true, 'demo')
}
</script>

<style >
  /* @import "simpleMindMap.esm.css"; */
  
  .mind-map-wrapper{
    position: relative;
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
</style>