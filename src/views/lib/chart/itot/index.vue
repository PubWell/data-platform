<template>
  <div class="chart-demo-wrapper wh-100 flex-column">
    <!-- <div class="chart-delete">
      <el-icon :size="20" @click="deleteChart"><Close /></el-icon>
    </div> -->
    <div class="title">
      {{info.title ? info.title : 'Title'}}
    </div>
    <div class="chart flex-item">
      <LineChart :options="options" />
    </div>
  </div>
</template>

<script setup>
import { getPcsIdcApi } from '@/api/data-chart/index.js'

const props = defineProps({
  info: {
    type: Object,
    default:{ title: 'Title'}
  },
  interaction: {
    type: Boolean,
    default: false
  }
})

const options = ref()

onMounted(() => {
  getData()
})

watch(
  () => props.info,
  () => {
    getData()
  }
)

const getData = () => {
  const params = {
    bccId :  6250,
    endTime :  1712654640000,
    pcsId :  6297,
    startTime :  1712568240000,
    stationId :  11,
  }

  getPcsIdcApi(params)
    .then((res) => {
      if (res.data) {
        let data = res.data
        options.value = {
          legend: { show: false },
          data: data,
          names: [`电流(A)`],
          unit: data.seriesList.reduce((pre, cur) => {
            pre[cur.yaxisName] = 'A'
            return pre
          }, {}),
          tooltip: {
            show: props.interaction,
          },
          legend: {
            selectedMode: props.interaction
          }
        }
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

</script>

<style lang="scss" scoped>
.chart-demo-wrapper{
  position: relative;
  overflow: hidden;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 0px 5px 3px rgba(0,0,0,0.05);
  .title{
    position: absolute;
    top: 10px;
    left: 20px;
    font-size: 13px;
    color: #353d5c;
    font-weight: bold;
  }
  .chart-delete{
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 9;
    cursor: pointer;
  }
  .chart{
    width: 100%;
    height: 100%;
  }
}
</style>
