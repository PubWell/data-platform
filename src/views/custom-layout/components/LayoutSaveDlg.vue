<template>
  <el-dialog :model-value="showDlg" title="保存布局" width="550" :close-on-click-modal="false" @close="closeDlg">
    
    <el-form ref="formRef" :model="model" :rules="rules" label-width="80" label-position="left">
      <el-form-item prop="menu" label="菜单名" required>
        <el-input
            v-model="model.menu"
            placeholder="请输入菜单名称"
          />
      </el-form-item>
    </el-form>

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

const formRef = ref(null)
const model = ref({
  menu: ''
})
const rules = ref({
  menu: [{ required: true, trigger: 'change', message: '请输入菜单名称', }],
})

const confirmDlg = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      console.log('submit!')
      // emits('confirm-dlg', activeComp.value)
    } else {
      console.log('error submit!')
      return false
    }
  })
}

const closeDlg = () => {
  emits('close-dlg')
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