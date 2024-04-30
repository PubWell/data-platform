<template>
  <el-dialog :model-value="showDlg" title="请选择图表" width="800" :close-on-click-modal="false" @close="closeDlg">
    
    <CompLib class="comp-lib-box" @change="onCompChange"/>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDlg">取消</el-button>
        <el-button type="primary" @click="confirmDlg">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import CompLib from '@/views/comp-lib/index.vue'

const props = defineProps({
  showDlg: {
    type: Boolean,
  }
})
const emits = defineEmits(['close-dlg', 'confirm-dlg'])

const activeComp = ref()
const confirmDlg = () => {
  emits('confirm-dlg', activeComp.value)
}

const closeDlg = () => {
  emits('close-dlg')
}

const onCompChange = (e) => {
  activeComp.value = e
}
</script>

<style lang="scss" scoped>
.comp-lib-box{
  width: 100%;
  min-height: 400px;
  height: 60vh;
  overflow-y: auto;
}
::-webkit-scrollbar {
  display: none;
}
</style>