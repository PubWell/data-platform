<template>
  <div class="header-wrapper">
    <div class="title">
      自定义布局
    </div>
    <div class="row-col-num-box">
      <div class="row">
        <el-input-number
          v-model="layout.row"
          class="input-w"
          :step="1"
          :step-strictly="true"
          :min="1"
          :max="20"
          :disabled="!!store.layout.length"
          controls-position="right"
          @change="onRowChange"
        />
      </div>
      <el-icon><Close /></el-icon>
      <div class="col">
        <el-input-number
          v-model="layout.col"
          class="input-w"
          :step="1"
          :step-strictly="true"
          :min="1"
          :max="20"
          :disabled="!!store.layout.length"
          controls-position="right"
          @change="onColChange"
        />
      </div>
    </div>

    <div class="action-box">
      <el-dropdown v-if="type == 'grid'" trigger="click" @command="onChangeLayout">
        <el-button type="primary">
          新增({{ activeLayout?.label }})<el-icon class="el-icon--right"><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="item in layoutList" :key="item.value" :command="item">{{ item.label }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <div v-else class="row-col-input-box">
        <div class="input-item">
          <el-input-number
            v-model="addRow"
            class="add-input-w"
            :step="1"
            :step-strictly="true"
            :min="1"
            :controls="false"
          />
        </div>
        <el-icon><Close /></el-icon>
        <div class="input-item">
          <el-input-number
            v-model="addCol"
            class="add-input-w"
            :step="1"
            :step-strictly="true"
            :min="1"
            :max="layout.col"
            :controls="false"
          />
        </div>
        <div class="add-btn" @click="onAddLayout"> 新增 </div>
      </div>
      
      <el-button type="primary" class="ml-10" @click="onSave">保存</el-button>
      <!-- <el-button type="primary">发布</el-button> -->
    </div>

  </div>
  <LayoutSaveDlg
    :show-dlg="showDlg"
    @close-dlg="onCloseDlg"
    @confirm-dlg="onConfirmDlg"
  />
</template>

<script setup>
import LayoutSaveDlg from './LayoutSaveDlg.vue'
import { ArrowDown, Close } from '@element-plus/icons-vue'
import { customLayoutStore } from '@/stores'
import { ElMessage } from 'element-plus'

const props = defineProps({
  type: {
    type: String,
    default: 'grid'
  }
})

const emits = defineEmits(['change', 'add'])

const store = customLayoutStore()
const showDlg = ref(false)

const layout = ref({
  row: 1,
  col: 1,
})
const layoutList = ref([
  { label: '一行一列', value: 1, },
  { label: '一行两列', value: 2, },
  { label: '一行三列', value: 3, },
  { label: '一行四列', value: 4, },
])
const activeLayout = ref()

const addRow = ref()
const addCol = ref()

watch(
  () => [store.rows, store.cols],
  () => {
    layout.value.row = store.rows
    layout.value.col = store.cols
    activeLayout.value = layoutList.value[0]
    addRow.value = 1
    addCol.value = store.cols
  }, {deep: true}
)

onMounted(() => {
  layout.value.row = store.rows
  layout.value.col = store.cols
  activeLayout.value = layoutList.value[0]
  addRow.value = 1
  addCol.value = store.cols
})

const onAddLayout = () => {
  if(!addRow.value || !addCol.value){
    ElMessage.error('行数/列数不能为空')
    return
  }
  store.addLayout(addRow.value, addCol.value)
}

const onChangeLayout = (e) => {
  activeLayout.value = e
  // emits('add', e)
  store.addLayout(3, e.value)
}

const onColChange = ()=> {
  store.refreshCols(layout.value.col)
}

const onRowChange = ()=> {
  store.refreshRows(layout.value.row)
}

const onCloseDlg = () => {
  showDlg.value = false
}

const onConfirmDlg = (e) => {
  showDlg.value = false

  store.reset()
}

const onSave = () => {
  // showDlg.value = true
  const res = store.layout.filter((item) => item.path)
  console.log(res,store.layout)
}
</script>

<style lang="scss" scoped>
.header-wrapper{
  width: 100%;
  height: 50px;
  background-color: #fff;
  position: relative;
  padding-left: 50%;
  .title{
    position: absolute;
    top: 15px;
    left: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    font-size: 16px;
    line-height: 1;
    font-weight: bold;
    &::before{
      content: '';
      display: block;
      width: 4px;
      height: 20px;
      border-radius: 2px;
      margin-right: 5px;
      background-color: #409eff;
    }
  }
  .row-col-num-box{
    height: 90%;
    display: flex;
    align-items: center;
    font-size: 15px;
    font-weight: bold;
    .row,.col{
      margin: 0 10px;
    }
    .input-w{
      width: 90px;
      // height: 40px;
    }
  }
  .action-box{
    position: absolute;
    top: 5px;
    right: 10px;
    z-index: 3;
    display: flex;
    align-items: center;
    .row-col-input-box{
      height: 32px;
      border-radius: 4px;
      border: 1px solid #409eff;
      display: flex;
      align-items: center;
      .input-item{
        height: 26px;
        margin: 0 10px;
        border-bottom: 1px solid #aaaaaa;
      }
      .add-input-w{
        width: 50px;
        height: 25px;
      }
      .add-btn{
        height: 100%;
        text-align: center;
        border-left: 1px solid #409eff;
        font-size: 14px;
        color: #409eff;
        line-height: 32px;
        padding: 0 15px;
        cursor: pointer;
      }
    }
  }
}
:deep(.add-input-w .el-input__wrapper){
  box-shadow: 0 0 0 1px transparent inset;
}
</style>