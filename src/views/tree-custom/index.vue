<template>
  <div class="wh-100 mind-map-wrapper">
    <div id="mindMapContainer"></div>

    <!-- todo: scale -->
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
    />
  </div>
</template>

<script setup>
import { ref, onMounted, shallowRef } from 'vue'
// https://wanglin2.github.io/mind-map/#/doc/zh/course2
import MindMap from "./mind-map-main/simple-mind-map"
import Drag from './mind-map-main/simple-mind-map/src/plugins/Drag.js'

import Tool from './components/Tool.vue'

const toolRef = ref(null)
const tool = reactive({
  show: false,
  node: null,
  left: 0,
  top: 0,
})
const operate = ref(false)
const dragMark = ref(false)
const activeNodes = shallowRef([])
let mindMap = null
MindMap.usePlugin(Drag)

onMounted(() => {
  mindMap = new MindMap({
    el: document.getElementById('mindMapContainer'),
    data: {
      "data": {
        "text": "根节点",
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
  })

  // 监听节点激活事件
  mindMap.on('node_active', (node, nodeList) => {
    if(!operate.value && !dragMark.value && nodeList.length === 1 && node && node.uid === nodeList[0].uid){
      initTool(node)
    }else{
      tool.show = false
      dragMark.value = false
      operate.value = false
    }
    activeNodes.value = nodeList
  })

  // 监听draw拖拽事件
  mindMap.on('drag', (e, t) => {
    dragMark.value = true
  })
  // // 监听node拖拽事件
  // mindMap.on('node_dragging', (e, t) => {
  //   console.log('node_dragging>>>>>>>>>')
  // })
  // // 监听node拖拽结束事件
  // mindMap.on('node_dragend', (e, t) => {
  //   console.log('node_dragend>>>>>>>>>')
  // })
})

const initTool = (node) => {
  tool.node = node
  tool.show = true

  nextTick(() => {
    let cfg = mindMap.getSvgData(), rect = toolRef.value.getRect()
    // console.log(cfg, node,rect)
  
    // todo - scale/translate
    // tool.scaleX = cfg.scaleX
    // tool.scaleY = cfg.scaleY

    tool.left = node.left + node.width/2 - rect.width/2
    tool.top = node.top - rect.height - 10
  
  })
}

const onAddBrother = () => {
  console.log('add brother>>>>>>>>>>>')
  operate.value = true
  // setTimeout(() => {
  //   operate.value = false
  // }, 200)
  mindMap.execCommand('INSERT_NODE', false)
}

const onAddChild = () => {
  operate.value = true
  // setTimeout(() => {
  //   operate.value = false
  // }, 200)
  mindMap.execCommand('INSERT_CHILD_NODE', false)
}

const onDelete = () => {
  operate.value = true
  // setTimeout(() => {
  //   operate.value = false
  // }, 200)
  mindMap.execCommand('REMOVE_NODE', false)
}

const onAddImage = () => {

  activeNodes.value[0].setImage({
    url: '图片url',
    title: '图片的标题或描述',
    width: 100,// 图片的宽高也不能少
    height: 100
  })
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