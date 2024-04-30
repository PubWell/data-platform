<template>
  <div class="menu-control-wrapper wh-100">
    <el-input
      v-model="keyword"
      class="input-w"
      placeholder="搜索"
      :prefix-icon="Search"
    />

    <div>
      <el-table
        :data="tableData"
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        border
        default-expand-all
      >
        <template v-for="(item, index) in tableHeader" :key="item.field">
        
          <el-table-column v-if="item.field == 'order'" width="100" :label="item.label">{{ index+1 }}</el-table-column>
          
          <el-table-column v-else-if="item.field == 'action'" width="200" :label="item.label">
            <!-- <el-button type="primary">发布</el-button> -->
            <el-button text :icon="EditPen"/>
            <el-button text :icon="UploadFilled"/>
            <el-button text :icon="Delete"/>
          </el-table-column>

          <el-table-column
            v-else
            :prop="item.field"
            :label="item.label"
            :sortable="item.field == 'createdTime'"
          />
        </template>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { Search, EditPen, Delete, UploadFilled } from '@element-plus/icons-vue'

const keyword = ref()
const tableData = ref([
  {menu: '测试菜单', role: '', createdBy: 'admin', createdTime: '2024-04-01 10:00:00'}
])

const tableHeader = ref([
  { field: 'order', label: '排序' },
  { field: 'menu', label: '菜单项名称' },
  { field: 'role', label: '可见范围' },
  { field: 'createdBy', label: '创建人' },
  { field: 'createdTime', label: '创建时间' },
  { field: 'action', label: '操作' },
])
</script>

<style lang="scss" scoped>
.menu-control-wrapper{
  padding: 15px;
  .input-w{
    width: 250px;
    margin-bottom: 20px;
  }
}
</style>