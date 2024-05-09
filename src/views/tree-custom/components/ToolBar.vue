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

        <!-- <div class="item" :class="{'active': layoutActive == 'logicalStructure'}" @click="onChangeLayout('logicalStructure')">
          <el-icon><Operation /></el-icon>
        </div>

        <div class="item border-r" :class="{'active': layoutActive == 'organizationStructure'}" @click="onChangeLayout('organizationStructure')">
          <el-icon style="transform: rotate(-90deg);"><Operation /></el-icon>
        </div> -->

        <div
          v-for="(item, index) in layoutTypes"
          :key="item.value"
          class="item"
          :class="{'border-r': index == layoutTypes.length - 1, 'active': layoutActive == item.value}"
          @click="onChangeLayout(item.value)"
        >
          <img :src="item.icon" alt="">
        </div>

        <div
          v-for="(item, index) in lineTypes"
          :key="item.value"
          class="item"
          :class="{'border-r': index == lineTypes.length - 1, 'active': lineActive == item.value}"
          @click="onChangeLine(item.value)"
        >
          <img class="line":src="item.icon" alt="">
        </div>

        <!-- <div class="item"> -->
          <!-- <el-radio-group v-model="lineActive" size="small" @change="onChangeLine">
            <el-radio-button v-for="item in lineTypes" :key="item.value" :value="item.value">
              <img :src="item.icon" alt="">
            </el-radio-button>
          </el-radio-group> -->

          <!-- <el-dropdown trigger="click" @command="onChangeLine">
            <el-button type="info" text>
              <img :src="lineActive.icon" alt="">
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="item in lineTypes" :key="item.value" :command="item">
                  <img :src="item.icon" alt="">
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown> -->
        <!-- </div> -->

        <div class="item" @click="onFit">
          <el-icon><FullScreen /></el-icon>
        </div>
        
        <div class="item" @click="updateScale('minus')">
          <el-icon><Minus /></el-icon>
        </div>
        
        
        <div class="item text" style="cursor:auto">
          {{ `${(scale * 100).toFixed(0)}%` }}
        </div>

        <div class="item border-r" @click="updateScale('plus')">
          <el-icon><Plus /></el-icon>
        </div>


        <!-- <div class="item border-r">
          <el-icon class="mr-10" @click="updateScale('minus')"><Minus /></el-icon>
          {{ `${(scale * 100).toFixed(0)}%` }}
          <el-icon class="ml-10" @click="updateScale('plus')"><Plus /></el-icon>
        </div> -->
  
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
  ArrowDown,
  Search,
  Plus,
  Minus,
} from '@element-plus/icons-vue'
import CurveImg from '@/assets/images/tree-custom/line-curve.png'
import StraightImg from '@/assets/images/tree-custom/line-straight.png'
import DirectImg from '@/assets/images/tree-custom/line-direct.png'
import LogicalImg from '@/assets/images/tree-custom/layout-logical.png'
import OrganizationImg from '@/assets/images/tree-custom/layout-organization.png'

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
  scale: {
    type: Number
  },
})
const emits = defineEmits(['back', 'next', 'fit', 'export', 'import', 'changeLayout', 'changeLine', 'changeScale'])

const layoutActive = ref('organizationStructure')
const layoutTypes = ref([
  {icon: LogicalImg, value: 'logicalStructure'},
  {icon: OrganizationImg, value: 'organizationStructure'},
])
const lineActive = ref('straight')
const lineTypes = shallowRef([
  {icon: CurveImg, value: 'curve'},
  {icon: StraightImg, value: 'straight'},
  {icon: DirectImg, value: 'direct'},
])

onMounted(() => {
  setTimeout(() => {
    onChangeLine(lineActive.value)
  }, 100);
})

const onChangeLine = (e) => {
  lineActive.value = e
  emits('changeLine', e)
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
  layoutActive.value = type
  emits('changeLayout', type)
}

const updateScale = (type) => {
  if(type == 'minus'){
    emits('changeScale', props.scale - 0.05)
  }else{
    emits('changeScale', props.scale + 0.05)
  }
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
        &:not(.disable):not(.text):hover{
          background-color: #dddddd
        }
        &.disable{
          color: #aaaaaa;
        }
        &.active{
          background-color: #ededed
        }
        img{
          width: 45px;
          height: 25px;
          &.line{
            width: 25px;
            height: 15px;
          }
        }
      }
      .border-r{
        border-right: 1px solid #dddddd;
      }
    }
  }
}
</style>