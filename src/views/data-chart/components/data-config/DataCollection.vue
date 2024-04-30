<template>
  <div class="data-collection-wrapper">
    <div class="data-collection-box wh-100">

      <div class="data-title flex flex-ai-c">
        <div class="mr-10">数据表：</div>
        <div>
          <el-select
            v-model="collectionSelected"
            placeholder="Select"
            style="width: 206px"
          >
            <el-option
              v-for="item in collectionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>

      <div class="data-box mt-10">
        <draggable
          :list="dataList"
          item-key="id"
          :sort="false"
          :group="{name: 'yaxis', pull:'clone', put: false}"
          chosen-class="chosenClass"
          animation="300"
          :forceFallback="true"
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
              class="flex flex-wrap"
              :list="yAxisList"
              item-key="id"
              :sort="true"
              :group="{name: 'yaxis', pull: true, put: true}"
              animation="300"
              ghost-class="ghostClass"
              chosen-class="chosenClass"
            >
              <template #item="{ element }">
                <div class="axis-item">
                  {{ element.name }}
                  <el-icon class="axis-item-delete" @click="deleteYAxis(element)"><Close /></el-icon>
                  <!-- <div></div> -->
                  <!-- <span>x</span> -->
                </div>
              </template>
            </draggable>
          </div>
        </div>
        <!-- ghost-class="ghost"
              chosen-class="chosenClass" -->
        <div class="fun setting ">
          <div class="label flex flex-ai-c">
            Fun ：
            <div class="flex flex-ai-c">
              <div class="chart-type-icon" :class="{'active-icon-border': funType == 1}" @click="onChangeFun(1)">
                <img src="@/assets/images/fun-sum-icon.svg" alt="">
              </div>
              <div class="chart-type-icon" :class="{'active-icon-border': funType == 2}" @click="onChangeFun(2)">
                <img src="@/assets/images/fun-mean-icon.svg" alt="">
              </div>
            </div>
          </div>
        </div>

        <div class="chart setting">
          <div class="label flex flex-ai-c">
            图表类型 ：
            <div class="flex flex-ai-c">
              <div class="chart-type-icon" :class="{'active-icon-border': chartType == 1}" @click="onChangeChartType(1)">
                <img src="@/assets/images/line-chart.svg" alt="">
              </div>
              <div class="chart-type-icon" :class="{'active-icon-border': chartType == 2}" @click="onChangeChartType(2)">
                <img src="@/assets/images/bar-chart.svg" alt="">
              </div>
            </div>
          </div>
          <div class="label mt-10 flex flex-ai-c">
            颜色设置 ：
            <el-select
              v-model="colorSelected"
              placeholder="Select"
              style="max-width: 160px"
            >
              <el-option
                v-for="item in colorOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <div class="flex flex-ai-c">
                  <img class="chart-color-icon" :src="colorIconList[item.value]" alt="">
                  <div class="chart-color-label ml-5">{{ item.label }}</div>
                </div>
              </el-option>
              <template #prefix>
                <img class="chart-color-icon" :src="colorIconList[colorSelected]">
              </template>
            </el-select>
          </div>
        </div>

        <div class="setting flex flex-jc-c">
          <el-button class="add-btn" plain type="primary" @click="onAddChart">添加图表</el-button>
        </div>
      </div>

      <!-- <div class="layout-box block-separator mt-10">

        <div class="layout-cols label mt-10 flex flex-ai-c">
          分栏 ：
          <div class="flex flex-ai-c">
            <div class="cols-type-icon" :class="{'active-icon-border': colsType == 2}" @click="onChangeColsType(2)">
              <img src="@/assets/images/layout-two-columns.svg" alt="">
            </div>
            <div class="cols-type-icon" :class="{'active-icon-border': colsType == 3}" @click="onChangeColsType(3)">
              <img src="@/assets/images/layout-three-columns.svg" alt="">
            </div>
          </div>
        </div>

      </div> -->
    </div>
  </div>
</template>

<script setup>
// https://www.itxst.com/vue-draggable-next/tutorial.html
import draggable from 'vuedraggable'
import colorsIcon from '@/assets/images/colors-icon.svg'
import { Close, } from '@element-plus/icons-vue'

import { dataChartStore } from '@/stores'

const store = dataChartStore()
const dateRange = ref()
const chartType = ref(1)
const funType = ref(1)
const colorSelected = ref(1)
const colorOptions = ref([
  { label: '经典', value : 1 },
  { label: '浅色', value : 2 },
])
const colorIconList = ['', colorsIcon, colorsIcon]

const collectionSelected = ref(1)
const collectionOptions = ref([
  { label: 'Collection', value : 1},
])
const dataList = ref([
  { name: 'data1', id: 1 },
  { name: 'data2', id: 2 },
  { name: 'data3', id: 3 },
  { name: 'data4', id: 4 },
  { name: 'data5', id: 5 },
])
const yAxisList = ref([])
let moveTarget = null

const colsType = ref(2)

//拖拽开始的事件
const onMove = (e) => {
  moveTarget = e.draggedContext.element;
  return true;
}

//拖拽结束的事件
const onEnd = (e) => {
  if(!moveTarget){
    return
  }
  const items = yAxisList.value.filter((m) => {
    return m.id == moveTarget.id
  })
  if(items.length < 2) return;
  // 如果已存在,则删除,避免重复
  yAxisList.value.splice(e.newDraggableIndex, 1)
}

const deleteYAxis = (e) => {
  const idx = yAxisList.value.findIndex((item) => item.id == e.id)
  if(idx > -1){
    yAxisList.value.splice(idx, 1)
  }
}

const onChangeChartType = (e) => {
  if(chartType.value == e){
    chartType.value = null
    return
  }
  chartType.value = e
}

const onChangeFun = (e) => {
  if(funType.value == e){
    funType.value = null
    return
  }
  funType.value = e
}

const onChangeColsType = (e) => {
  if(colsType.value == e){
    colsType.value = null
    return
  }
  colsType.value = e
}

const onAddChart = () => {
  // if(!dateRange.value || !yAxisList.value.length){
  //   console.error('')
  //   return
  // }
  let opt = {
    x: dateRange.value,
    y: yAxisList.value,
    fun: funType.value,
    colorType: colorSelected.value,
    seriesType: chartType.value,
    id: new Date().getTime()
  }
  store.setChartConfig({...opt})
}

</script>

<style lang="scss" scoped>
.ml-5{
  margin-left: 5px;
}
.data-collection-wrapper{
  width: 100%;
  height: 100%;
  .data-collection-box{
    // border-right: 1px solid #dbdbdb;
    padding: 15px;
    .data-title{
      font-size: 13px;
    }
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
        &:hover{
          cursor: move;
        }
      }
    }
    .setting-box{
      width: 100%;
      .setting{
        width: 100%;
        margin-top: 10px;
        .label{
          font-size: 12px;
          .position{
            font-size: 12px;
          }
          .chart-type-icon{
            width: 30px;
            height: 30px;
            padding: 5px;
            cursor: pointer;
            border-radius: 4px;
            border: 1px solid transparent;
            background-color: #f5f7fa;
            &:not(:first-child){
              margin-left: 10px;
            }
            &.active-icon-border{
              background-color: unset;
              border: 1px solid #0080FF;
            }
            img{
              width: 100%;
              height: 100%;
            }
          }
        }
        .date-picker{
          width: 100%;
        }
        .y-axis-list{
          width: 100%;
          min-height: 80px;
          padding: 3px;
          overflow-x: hidden;
          background-color: #f5f7fa;
          .axis-item{
            width: 80px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: #fff;
            border-radius: 5px;
            padding: 5px 10px;
            font-size: 12px;
            margin: 3px;
            transition: all 0.15s linear;
            .axis-item-delete{
              cursor: pointer;
            }
          }
        }
        .add-btn{
          width: 100%;
          margin-top: 5px;
        }
      }
    }
    .block-separator{
      border-top: 1px solid #dbdbdb;
    }
    .layout-box{
      width: 100%;
      .layout-cols{
        font-size: 12px;
        .cols-type-icon{
          width: 30px;
          height: 30px;
          padding: 5px;
          border-radius: 4px;
          cursor: pointer;
          border: 1px solid transparent;
          background-color: #f5f7fa;
          &:not(:first-child){
            margin-left: 10px;
          }
          &.active-icon-border{
            background-color: unset;
            border: 1px solid #0080FF;
          }
          img{
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}

.ghostClass {

}

.chosenClass {
  width: auto !important;
  height: max-content !important;
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 5px;
  background-color: #fff;
  opacity: 1;
  // border: solid 1px red;
}

.el-dropdown-link {
  cursor: pointer;
  // color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
.chart-color-icon{
  width: 15px;
  height: 15px;
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
