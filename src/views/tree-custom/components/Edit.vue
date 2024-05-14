<template>
  <div class="edit-wrapper">
    <div class="edit-box">

      <div class="edit-list">

        <div class="item">
          <div class="label"> 设备名称 </div>
          <el-input v-model="nodeData.name" placeholder="Please input" @blur="updateName" />
        </div>
  
        <div class="item">
          <div class="label"> 设备类型 </div>
          <el-select v-model="nodeData.type" placeholder="Select" @change="updateType" disabled>
            <el-option
              v-for="item in deviceTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
  
        <div class="item">
          <div class="label"> 设备列表 </div>
          <el-select
            v-model="nodeData.device"
            multiple
            :collapse-tags="true"
            :collapse-tags-tooltip="true"
            placeholder="Select">
            <el-option
              v-for="item in deviceList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <!-- <el-input v-model="nodeData.type" placeholder="Please input" /> -->
        </div>

        <div class="item flex">
          <div class="label"></div>

          <el-button type="primary" @click="onAddBrother" :disabled="!nodeData.device.length || node.nodeData.data.type == 'root'">添加至同级节点</el-button>
          <el-button type="primary" class="ml-10" @click="onAddChildren" :disabled="!nodeData.device.length">添加至子级节点</el-button>
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
const emits = defineEmits(['update-node', 'exec-command'])

const nodeData = reactive({
  name: '',
  type: '',
  device: [],

})
const deviceTypes = ref([
  {label: '电网', value: 'root'},
  {label: 'PCS', value: 'pcs'},
  {label: '电池簇', value: 'bcc'},
])
const deviceList = ref([
  {label: '1-1# PCS', value: 1, type: 'pcs'},
  {label: '1-2# PCS', value: 2, type: 'pcs'},
  {label: '2-1# PCS', value: 3, type: 'pcs'},
  {label: '2-2# PCS', value: 4, type: 'pcs'},
  {label: '1# 电池仓', value: 5, type: 'bc'},
  {label: '2# 电池仓', value: 6, type: 'bc'},
  // {label: '3# 电池仓', value: 7, type: 'bc'},
  // {label: '4# 电池仓', value: 8, type: 'bc'},
  {label: '1# 电池簇', value: 9, type: 'bcc'},
  {label: '2# 电池簇', value: 10, type: 'bcc'},
  {label: '3# 电池簇', value: 11, type: 'bcc'},
  {label: '4# 电池簇', value: 12, type: 'bcc'},
  // {label: '5# 电池簇', value: 13, type: 'bcc'},
])

onMounted(() => {
  nodeData.name = props.node.nodeData.data.text
  nodeData.type = props.node.nodeData.data.type
})

watch(
  () => props.node,
  () => {
    nodeData.name = props.node.nodeData.data.text
    nodeData.type = props.node.nodeData.data.type

  }, {deep: true}
)

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

const formatNodeData = () => {
  let time = new Date().getTime()
  const nodes = nodeData.device.map((item, index) => {
    let target = deviceList.value.find((i) => i.value == item)
    return {
      data: {
        text: target.label,
        type: target.type,
        uid: time + index,
        status: {
          color: '#eeeeee',
          text: 'offline'
        },
        switch: 0
      }
    }
  })
  return nodes
}

const onAddBrother = () => {
  if(props.node.nodeData.data.type === 'root'){
    return
  }
  console.log(nodeData)
  let nodes = formatNodeData()
  emits('exec-command','INSERT_MULTI_NODE', false, [], nodes)
}

const onAddChildren = () => {
  console.log(nodeData)
  let nodes = formatNodeData()
  emits('exec-command','INSERT_MULTI_CHILD_NODE', false, [], nodes)
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
          min-width: 80px;
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