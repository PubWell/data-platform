<template>
  <div class="device-node-wrapper">
    <div class="device-node-box" :class="{'flex': layout == 'logicalStructure', 'flex-column': layout == 'organizationStructure'}">

      <template v-if="node.uid === 'root'">
        <div class="device-root">
          <img class="root-icon" src="@/assets/images/tree-custom/station-icon.svg" alt="">
        </div>
      </template>

      <template v-if="node.uid !== 'root'">
        <div class="switch-box" :class="{'horizontal': layout == 'logicalStructure'}">
          <img class="icon" src="@/assets/images/tree-custom/close.svg" alt="">
        </div>
        <div class="device-item">
  
          <div class="flex">
            <div class="device-icon">
              <img src="@/assets/images/tree-custom/pcs-icon.svg" alt="">
            </div>
  
            <div class="device-status flex">
              <div class="device-status-marker" :style="{'background-color': deviceInfo.status.color}"></div>
              <div class="device-status-text" :style="{'color': deviceInfo.status.color}">{{ deviceInfo.status.text }}</div>
            </div>
          </div>
  
          <div class="device-name">{{ node.text }}</div>
  
          <!-- <div>
            <el-input v-model="inputVal"/>
          </div> -->
        </div>
        <div class="switch-box" :class="{'horizontal': layout == 'logicalStructure'}">
          <img class="icon" src="@/assets/images/tree-custom/close.svg" alt="">
        </div>
      </template>

      <div class="device-bcc"></div>

    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  deviceInfo: {
    type: Object,
    default: () => {
      return  {
        name: '1#PCS',
        status: {
          color: '#0CB86E',
          text: '放电运行'
        },
        switch: 1,
        type: 'pcs'
      }
    }
  },
  node: {
    type: Object
  },
  layout: {
    type: String
  }
})

const inputVal = ref()

watch(
  () => props.node,
  (val) => {
    inputVal.value = val.text
  }
)

onMounted(() => {
  inputVal.value = props.node.text
})

</script>

<style lang="scss" scoped>
.device-node-wrapper{
  width: 100%;
  height: 100%;
  .device-node-box{
    align-items: center;
    .switch-box{
      width: 8px;
      height: 23px;
      // margin-left: 2px !important;
      margin-bottom: 2.5px !important;
      &.horizontal{
        width: 23px !important;
        height: 8px !important;
        margin-right: 2.5px !important;
        // transform: rotate(-90deg);
      }
    }
    .device-root{
      padding: 12px !important;
      border-radius: 8px;
      border: 1px solid #C8CCD4;
      background-color: #ffffff;
      .root-icon{
        width: 24px;
        height: 24px;
      }
    }
    .device-item{
      // margin-top: 5px !important;
      padding: 10px !important;
      background-color: #ffffff;
      border-radius: 8px;
      border: 1px solid #C8CCD4;
      cursor: pointer;
      // box-shadow: 0px 0px 3px 2px rgba(0,0,0,0.03);
      &:hover{
        // opacity: 0.7;
        border-color: #0cb86e;
      }
      .device-icon{
        width: 24px;
        height: 24px;
      }
      .device-status{
        align-items: center;
        margin-left: 10px !important;
        .device-status-marker{
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        .device-status-text{
          margin-left: 10px !important;
          font-size: 14px;
          font-weight: bold
        }
      }
      .device-name{
        margin-top: 12px !important;
        font-size: 18px;
        font-weight: bold;
      }
    }
  }
}
</style>