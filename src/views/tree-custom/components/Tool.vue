<template>
  <div class="tool-wrapper" :style="{'left': `${left}px`,'top': `${top}px`, 'transform': `scale(${scaleX})`}">
    <div id="tool-wrapper" class="tool-box">

      <div class="tool-list flex">
        <!-- v-if="node.uid == 'root'"  -->
        <div v-if="node?.uid == 'root'" class="item" @click="onChangeLayout('logicalStructure')">
          <el-icon><Operation /></el-icon>
          <!-- <el-icon style="transform: rotate(-90deg);"><Operation /></el-icon> -->
        </div>
        <div v-if="node?.uid == 'root'" class="item border-r" @click="onChangeLayout('organizationStructure')">
          <!-- <el-icon><Operation /></el-icon> -->
          <el-icon style="transform: rotate(-90deg);"><Operation /></el-icon>
        </div>
  
        <div class="item" @click="onAddBrother">
          <el-icon><CirclePlus /></el-icon>
          同级节点
        </div>
  
        <div class="item" @click="onAddChild">
          <el-icon><CirclePlus /></el-icon>
          子级节点
        </div>
  
        <div class="item" @click="onDelete">
          <el-icon><Delete /></el-icon>
        </div>
  
        <div class="item" @click="onAddImage">
          <el-icon><Picture /></el-icon>
        </div>
      </div>
      <div class="tool-arrow"></div>
    </div>

  </div>
</template>

<script setup>
import {
  CirclePlus,
  Operation,
  Picture,
  Delete,
} from '@element-plus/icons-vue'

const props = defineProps({
  node: {
    type: Object
  },
  left: {
    type: Number,
    default: 0
  },
  top: {
    type: Number,
    default: 0
  },
  scaleX: {
    type: Number,
    default: 1
  },
  scaleY: {
    type: Number,
    default: 1
  },
})
const emits = defineEmits(['addBrother', 'addChild', 'delete', 'addImage', 'changeLayout'])

onMounted(() => {
})

const onAddBrother = () => {
  emits('addBrother')
}

const onAddChild = () => {
  emits('addChild')
}

const onDelete = () => {
  emits('delete')
}

const onAddImage = () => {
  emits('addImage')
}

const getRect = () => {
  let dom = document.getElementById('tool-wrapper')
  let rect = dom.getBoundingClientRect()
  return rect
}

const onChangeLayout = (type) => {
  emits('changeLayout', type)
}

defineExpose({
  getRect
})
</script>

<style lang="scss" scoped>
.tool-wrapper{
  position: absolute;
  z-index: 9;
  // width: 200px;
  height: 40px;
  .tool-box{
    position: relative;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0px 0px 3px 2px rgba(0,0,0,0.03);
    .tool-list{
      .item{
        padding: 10px;
        display: flex;
        align-items: center;
        font-size: 13px;
        cursor: pointer;
        &:hover{
          background-color: #dddddd
        }
      }
      .border-r{
        border-right: 1px solid #dddddd;
      }
    }
    .tool-arrow{
      position: absolute;
      top: 40px;
      left: calc(50% - 3px);
      width: 0;
      height: 0;
      border-width: 6px;
      border-style: solid;
      border-color: transparent #ffffff transparent transparent;
      transform: rotate(-90deg);
      transition: left 0.1s linear;
    }
  }
}
</style>