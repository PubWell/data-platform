<template>
  <div class="device-node-wrapper">
    <div class="device-node-box" :class="{'flex': layout == 'logicalStructure', 'flex-column': layout == 'organizationStructure'}">

      <template v-if="node.type === 'root'">
        <div class="node device-root">
          <img class="root-icon" src="@/assets/images/tree-custom/station-icon.svg" alt="">
        </div>
      </template>

      <template v-else-if="node.type == 'pcs'">
        <div class="switch-box" :class="{'horizontal': layout == 'logicalStructure'}">
          <img class="icon" src="@/assets/images/tree-custom/close.svg" alt="">
        </div>
        <div class="node device-pcs">
  
          <div class="flex">
            <div class="device-icon">
              <img src="@/assets/images/tree-custom/pcs-icon.svg" alt="">
            </div>
  
            <div class="device-status flex">
              <div class="device-status-marker" :style="{'background-color': deviceInfo.status.color}"></div>
              <div class="device-status-text" :style="{'color': deviceInfo.status.color}">{{ deviceInfo.status.text }}</div>
            </div>
          </div>
  
          <div class="device-name mt-10">{{ node.text }}</div>
  
          <!-- <div>
            <el-input v-model="inputVal"/>
          </div> -->
        </div>
        <div class="switch-box" :class="{'horizontal': layout == 'logicalStructure'}">
          <img class="icon" src="@/assets/images/tree-custom/close.svg" alt="">
        </div>
      </template>

      <template v-else-if="node.type == 'bcc'">
        <div class="node device-bcc flex-column">
          <Switch :status="1" />
          <Battery :percent="30" class="battery" :status="1" />
          <div class="device-name mt-10">{{ node.text }}</div>
          <!-- <div class="device-item flex-column">
          </div> -->
        </div>
      </template>

      <template v-else>
        <div class="node device-default">
          <div class="device-name">{{ node.text }}</div>
        </div>
      </template>

    </div>
  </div>
</template>

<script setup>
import Battery from './Battery.vue';
import Switch from './Switch.vue';
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
    console.log('watch props.node>>>>>>>>>>>>>>',val)
    // inputVal.value = val.text
  }, {deep: true}
)

onMounted(() => {
  // inputVal.value = props.node.text
})

</script>

<style lang="scss" scoped>
.mt-10{
  margin-top: 10px !important
}
.device-node-wrapper{
  width: 100%;
  height: 100%;
  .device-node-box{
    align-items: center;
    .node{
      background-color: #ffffff;
      border-radius: 8px;
      border: 1px solid #C8CCD4;
    }
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
      .root-icon{
        width: 24px;
        height: 24px;
      }
    }
    .device-pcs{
      // margin-top: 5px !important;
      padding: 10px !important;
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
          font-weight: bold;
          word-break: keep-all;
        }
      }
    }
    .device-name{
      // margin-top: 12px !important;
      font-size: 18px;
      font-weight: bold;
      line-height: 35px
    }
    .device-bcc{
      align-items: center;
      padding: 0 10px !important;
    }
    .device-default{
      padding: 12px !important;
    }
  }
}
</style>