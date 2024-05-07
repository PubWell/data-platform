<template>
  <div class="tool-bar-wrapper">
    <div class="tool-bar-box">

      <div class="tool-list flex">
  
        <div class="item" @click="onBack" :class="{'disable': isStart}">
          <el-icon><Back /></el-icon>
        </div>
  
        <div class="item border-r" @click="onNext" :class="{'disable': isEnd}">
          <el-icon><Right /></el-icon>
        </div>
  
        <div class="item" @click="onImport">
          <el-icon><Download /></el-icon>
        </div>
  
        <div class="item" @click="onExport">
          <el-icon><Upload /></el-icon>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import {
  Back,
  Right,
  Download,
  Upload,
} from '@element-plus/icons-vue'

const props = defineProps({
  node: {
    type: Object
  },
  isStart: {
    type: Boolean
  },
  isEnd: {
    type: Boolean
  },
})
const emits = defineEmits(['back', 'next', 'export', 'import'])

onMounted(() => {
})

const onBack = () => {
  emits('back')
}

const onNext = () => {
  emits('next')
}

const onExport = () => {
  emits('export')
}

const onImport = () => {
  emits('import')
}

</script>

<style lang="scss" scoped>
.tool-bar-wrapper{
  position: absolute;
  z-index: 10;
  top: 20px;
  right: 20px;
  // width: 200px;
  height: 40px;
  .tool-bar-box{
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
        &:not(.disable):hover{
          background-color: #dddddd
        }
        &.disable{
          color: #aaaaaa;
        }
      }
      .border-r{
        border-right: 1px solid #dddddd;
      }
    }
  }
}
</style>