<template>
  <div class="chart-demo-wrapper wh-100 flex-column">
    <!-- <div class="chart-delete">
      <el-icon :size="20" @click="deleteChart"><Close /></el-icon>
    </div> -->
    <div class="title">
      {{info.title ? info.title : 'Title'}}
    </div>
    <div class="chart flex-item">
      <BarChart :options="options" />
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
        "yaxisName": "电压",
        "ydataAxis": [
            "3.161",
            "3.161",
            "3.162",
            "3.167",
            "3.160",
            "3.166",
            "3.161",
            "3.159",
            "3.164",
            "3.162",
            "3.161",
            "3.160",
            "3.138",
            "3.140",
            "3.141",
            "3.141",
            "3.142",
            "3.144",
            "3.143",
            "3.138",
            "3.146",
            "3.140",
            "3.138",
            "3.141",
            "3.153",
            "3.161",
            "3.159",
            "3.160",
            "3.160",
            "3.160",
            "3.159",
            "3.159",
            "3.159",
            "3.161",
            "3.163",
            "3.160",
            "3.158",
            "3.160",
            "3.160",
            "3.165",
            "3.160",
            "3.161",
            "3.159",
            "3.156",
            "3.159",
            "3.162",
            "3.160",
            "3.157"
        ],
        "ytipAxis": null
      }
    ],
    "customizations": null,
    "xaxis": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        46,
        47,
        48
    ]
  }

  options.value = {
    data,
    name: `电压(V)`,
    unit: data.seriesList.reduce((pre, cur) => {
      pre[cur.yaxisName] = 'V'
      return pre
    }, {}),
    legend: {show: false},
    limit: 3.8,
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
