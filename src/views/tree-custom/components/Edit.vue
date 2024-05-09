<template>
  <div class="edit-wrapper">
    <div class="edit-box">

      <div class="edit-list">

        <div class="item" @click="onAddBrother">
          <div class="label"> 设备名称 </div>
          <el-input v-model="nodeData.name" placeholder="Please input" @blur="updateName" />
        </div>
  
        <div class="item" @click="onAddChild">
          <div class="label"> 设备类型 </div>
          <el-select v-model="nodeData.type" placeholder="Select" @change="updateType" disabled>
            <el-option
              v-for="item in deviceTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <!-- <el-input v-model="nodeData.type" placeholder="Please input" /> -->
        </div>

      </div>
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
})
const emits = defineEmits(['update-node'])

const nodeData = reactive({
  name: '',
  type: ''
})
const deviceTypes = ref([
  {label: 'PCS', value: 'pcs'},
  {label: '电池簇', value: 'bcc'},
])

onMounted(() => {
  nodeData.name = props.node.nodeData.data.text
  nodeData.type = props.node.nodeData.data.type
})

const updateName = () => {
  emits('update-node', {
    key: 'text',
    value: nodeData.name
  })
}

const updateType = () => {
  emits('update-node', {
    key: 'type',
    value: nodeData.type
  })
}
</script>

<style lang="scss" scoped>
.edit-wrapper{
  position: absolute;
  top: 85px;
  right: 0;
  z-index: 11;
  width: 400px;
  height: calc(100% - 85px);
  .edit-box{
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    box-shadow: 0px 0px 3px 2px rgba(0,0,0,0.03);
    .edit-list{
      width: 100%;
      height: 100%;
      .item{
        width: 100%;
        padding: 10px 20px;
        display: flex;
        align-items: center;
        .label{
          width: 100px;
          font-size: 13px;
          line-height: 25px;
        }
      }
      .border-b{
        border-bottom: 1px solid #dddddd;
      }
    }
  }
}
</style>