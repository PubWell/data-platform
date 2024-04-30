<template>
  <div class="data-collection-wrapper">
    <div class="data-collection-box wh-100">

      <el-dropdown>
        <span class="el-dropdown-link">
          数据表
          <el-icon class="el-icon--right">
            <ArrowDown />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>data</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <div class="data-box mt-10">
        <draggable
          :list="dataList"
          item-key="id"
          :sort="false"
          :group="{name: 'itxst', pull:'clone', put: false}"
          ghost-class="ghost"
          chosen-class="chosenClass"
          animation="300"
          @end="onEnd"
          :move="onMove"
        >
          <template #item="{ element }">
            <div class="item">
              {{ element.name }}
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ArrowDown,
} from '@element-plus/icons-vue'
import draggable from 'vuedraggable'

const emits = defineEmits(['drag-emit'])
const dataList = ref([
  { name: 'data1', id: 1 },
  { name: 'data2', id: 2 },
  { name: 'data3', id: 3 },
])
const yAxisList = ref([])
let moveTarget = null

//拖拽开始的事件
const onMove = (e) => {
  moveTarget = e.draggedContext.element;
  return true;
};

//拖拽结束的事件
const onEnd = () => {
  if(!moveTarget){
    return
  }
  const items = yAxisList.value.filter((m) => {
    return m.id == moveTarget.id
  })
  if(items.length < 2) return;
  // 如果已存在,则删除,避免重复
  emits('drag-emit', e)
  // yAxisList.value.splice(e.newDraggableIndex, 1)
};
</script>

<style lang="scss" scoped>
.data-collection-wrapper{
  width: 100%;
  .data-collection-box{
    padding: 15px;
    .data-box{
      width: 100%;
      height: 400px;
      padding: 8px;
      background-color: #f5f7fa;
      .item{
        width: 100%;
        height: 30px;
        padding: 0 8px;
        background-color: #fff;
        font-size: 12px;
        line-height: 30px;
        &:not(:first-child){
          margin-top: 5px;
        }
      }
    }
  }
}
.el-dropdown-link {
  cursor: pointer;
  // color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
