<template>
  <div class="chart-demo-wrapper wh-100">
    <!-- <div class="chart-delete">
      <el-icon :size="20" @click="deleteChart"><Close /></el-icon>
    </div> -->
    <div class="title">
      {{info.title ? info.title : 'Title'}}
    </div>
    <div class="chart">
      <ChargeDischarge :options="options" />
    </div>
  </div>
</template>

<script setup>
import { chargeHistory } from '@/api/data-chart/index.js'

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

  let data = {
        "seriesList": [
            {
                "yaxisName": "充电",
                "ydataAxis": [
                    -12780.0000,
                    -13320.0000,
                    -13440.0000,
                    -13680.0000,
                    -13740.0000,
                    -13800.0000,
                    -13080.0000,
                    -12780.0000,
                    -13860.0000,
                    -13440.0000,
                    -13440.0000,
                    -12960.0000,
                    -14340.0000,
                    -13920.0000,
                    -13440.0000,
                    -10860.0000,
                    -11340.0000,
                    -13800.0000,
                    -11400.0000,
                    -15540.0000
                ],
                "ytipAxis": [
                    "-12780.0000",
                    "-13320.0000",
                    "-13440.0000",
                    "-13680.0000",
                    "-13740.0000",
                    "-13800.0000",
                    "-13080.0000",
                    "-12780.0000",
                    "-13860.0000",
                    "-13440.0000",
                    "-13440.0000",
                    "-12960.0000",
                    "-14340.0000",
                    "-13920.0000",
                    "-13440.0000",
                    "-10860.0000",
                    "-11340.0000",
                    "-13800.0000",
                    "-11400.0000",
                    "-15540.0000"
                ]
            },
            {
                "yaxisName": "放电",
                "ydataAxis": [
                    12060.0000,
                    12300.0000,
                    12480.0000,
                    12600.0000,
                    12660.0000,
                    13140.0000,
                    12060.0000,
                    12180.0000,
                    12900.0000,
                    12480.0000,
                    12360.0000,
                    11640.0000,
                    12060.0000,
                    12900.0000,
                    12420.0000,
                    7680.0000,
                    12360.0000,
                    13020.0000,
                    10080.0000,
                    16140.0000
                ],
                "ytipAxis": [
                    "12060.0000",
                    "12300.0000",
                    "12480.0000",
                    "12600.0000",
                    "12660.0000",
                    "13140.0000",
                    "12060.0000",
                    "12180.0000",
                    "12900.0000",
                    "12480.0000",
                    "12360.0000",
                    "11640.0000",
                    "12060.0000",
                    "12900.0000",
                    "12420.0000",
                    "7680.0000",
                    "12360.0000",
                    "13020.0000",
                    "10080.0000",
                    "16140.0000"
                ]
            }
        ],
        "customizations": {
            "xType": "time",
            "yAxisLabelName": "电量(kWh)",
            "type": "histogram"
        },
        "xaxis": [
            "03-01",
            "03-02",
            "03-03",
            "03-04",
            "03-05",
            "03-06",
            "03-07",
            "03-08",
            "03-09",
            "03-10",
            "03-11",
            "03-12",
            "03-13",
            "03-14",
            "03-15",
            "03-16",
            "03-17",
            "03-18",
            "03-19",
            "03-20"
        ]
    }

  options.value = {
    data,
    name: `电量(kWh)`,
    unit: data.seriesList.reduce((pre, cur) => {
      pre[cur.yaxisName] = 'kWh'
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
