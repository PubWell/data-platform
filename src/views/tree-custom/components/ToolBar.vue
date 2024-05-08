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
  
        <div class="item" @click="onChangeLayout('logicalStructure')">
          <el-icon><Operation /></el-icon>
        </div>

        <div class="item border-r" @click="onChangeLayout('organizationStructure')">
          <el-icon style="transform: rotate(-90deg);"><Operation /></el-icon>
        </div>

        <div class="item">
          <el-dropdown trigger="click" @command="onChangeLine">
            <el-button type="primary" plain>
              <img :src="`@/assets/images/tree-custom/line-${lineActive}.png`" alt="">
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="item in lineTypes" :key="item.value" :command="item.value">
                  <img :src="`@/assets/images/tree-custom/line-${item.value}.png`" alt="">
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>

        <div class="item border-r" @click="onFit">
          <el-icon><FullScreen /></el-icon>
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
  FullScreen,
  Operation,
} from '@element-plus/icons-vue'
import CurveImg from '@/assets/images/tree-custom/line-curve.png'
import StraightImg from '@/assets/images/tree-custom/line-curve.png'

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
const emits = defineEmits(['back', 'next', 'fit', 'export', 'import', 'changeLayout'])

const lineActive = ref('curve')
const lineTypes = shallowRef([
  {icon: CurveImg, value: 'curve'},
  {icon: StraightImg, value: 'straight'},
  // {icon: '', value: 'direct'},
])

onMounted(() => {
})

const onChangeLine = (e) => {
  lineActive.value = e
}

const onBack = () => {
  emits('back')
}

const onNext = () => {
  emits('next')
}

const onFit = () => {
  emits('fit')
}

const onExport = () => {
  emits('export')
}

const onImport = () => {
  emits('import')
}

const onChangeLayout = (type) => {
  emits('changeLayout', type)
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