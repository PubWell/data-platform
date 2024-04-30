<template>
  <div class="chart-setting-wrapper">
    <div class="setting-box block-separator mt-10">
      <div class="x setting">
        <div class="label flex">
          X轴 ：
          <!-- <el-dropdown class="position ml-10">
            <span class="el-dropdown-link">
              位置
              <el-icon class="el-icon--right">
                <ArrowDown />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>data</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown> -->
        </div>
        <el-date-picker
          class="date-picker mt-10"
          v-model="dateRange"
          type="datetimerange"
          :clearable="false"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        />
      </div>

      <div class="y setting mt-10">
        <div class="label">
          Y轴 ：
        </div>
        <div class="y-axis-list mt-10">
          <draggable
            :list="yAxisList"
            item-key="id"
            :sort="true"
            :group="{name: 'itxst', pull: true, put: true}"
            ghost-class="ghost"
            chosen-class="chosenClass"
            animation="300"
          >
            <template #item="{ element }">
              <div class="item">
                {{ element.name }}
              </div>
            </template>
          </draggable>
        </div>
      </div>

      <div class="fun setting">
        <div class="label">
          Fun ：
          <div class="flex">

          </div>
        </div>
      </div>

      <div class="chart setting">
        <div class="label flex">
          图表类型 ：
          <div class="flex">

          </div>
        </div>
        <div class="label flex mt-10">
          颜色设置 ：
          <div class="flex">

          </div>
        </div>
      </div>

      <div class="setting">
        <el-button plain>添加图表</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ArrowDown,
} from '@element-plus/icons-vue'
import draggable from 'vuedraggable'

const props = defineProps({
  info: {
    type: Object
  }
})

const yAxisList = ref([])
const dateRange = ref()

watch(
  () => props.info,
  (val) => {
    yAxisList.value.splice(val.newDraggableIndex, 1)
  },
  {deep: true}
)
</script>

<style lang="scss" scoped>
.chart-setting-wrapper{
  width: 100%;
  .setting-box{
    padding: 15px;
    width: 100%;
    .setting{
      width: 100%;
      &:not(:first-child){
        margin-top: 10px;
      }
      .label{
        font-size: 12px;
        .position{
          font-size: 12px;
        }
      }
      .date-picker{
        width: 100%;
      }

      .y-axis-list{
        width: 100%;
        height: 120px;
        overflow: auto;
        background-color: #f5f7fa;
      }

    }
  }
  .block-separator{
    border-top: 1px solid #dbdbdb;
  }
}
.el-dropdown-link {
  cursor: pointer;
  // color: var(--el-color-primary);
  display: flex;
  align-items: center;
}

:deep(.el-date-editor.el-input__wrapper){
  width: 100%;
}
:deep(.el-date-editor .el-range-input){
  font-size: 12px;
  width: 44.5%;
}
:deep(.el-date-editor .el-range__close-icon--hidden){
  display: none;
}
:deep(.el-date-editor .el-range-separator){
  font-size: 12px;
  color: var(--el-input-focus-border-color);
  padding: 0;
}
:deep(.el-range-editor.el-input__wrapper){
  padding: 4px;
}
</style>
