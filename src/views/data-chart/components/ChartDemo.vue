<template>
  <div class="chart-demo-wrapper wh-100 flex-column">
    <div class="chart-delete">
      <el-icon :size="20" @click="deleteChart"><Close /></el-icon>
    </div>
    <div class="title">
      {{info.title ? info.title : 'Title'}}
    </div>
    <div ref="chartRef" class="chart flex-item"></div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { chargeHistory } from '@/api/data-chart/index.js'
import { seriesTypeEnum, colorTypeEnum } from './hooks.js'
import { Close } from '@element-plus/icons-vue'

import { dataChartStore } from '@/stores'

const store = dataChartStore()

const props = defineProps({
  info: {
    type: Object,
  }
})

const options = ref()
const chartRef = ref(null)

onMounted(() => {
  getData()
})

watch(
  () => props.info,
  () => {
    getData()
  }
)

const deleteChart = () => {
  store.deleteChart(props.info)
}

const getData = () => {
  // let params = {
  //   stationId: 11,
  //   endTime: 1711036799000,
  //   startTime: 1709222400000
  // }
  // chargeHistory(params)
  // .then((res) => {
  //     if (res.data) {
  //       formatOptions(res.data)
  //     }
  //   })
  //   .catch((err) => {
  //     console.error(err)
  //   })

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
  formatOptions(data)
}

const formatOptions = (res) => {
  let colors = props.info.colorType ? colorTypeEnum(props.info.colorType) : ['#0FB86E', '#0080FF'] 
  options.value = {
    grid: {
      top: '10%',
      left: '3%',
      right: '3%',
      bottom: '7%',
      containLabel: true,
    },
    legend: {
      show: true,
      top: 10,
      right: 10,
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
      textStyle: {
        color: '#727C94',
        fontSize: 13,
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: (params) => {
        let html = `<div>
            <div style="font-size: 12px;color: #73769F;line-height: 18px;">${params[0].axisValue}</div>
        `
        for (let i = 0; i < params.length; i++) {
          html += `
          <div style="color: #39406F;font-size:12px;line-height: 18px;display: flex; align-items: center">
            <div style="background-color: ${
              params[i].color.colorStops ? params[i].color.colorStops[0].color : params[i].color
            }; width:6px;height:6px; border-radius: 50%;"></div>
            <div style="margin: 0 5px;font-size: 12px;color: #73769F;line-height: 1;">${params[i].seriesName}:</div>${
            params[i].data[2] ? params[i].data[2] : params[i].data[1] + props.options.unit
          }
          </div>
          `
        }
        // <div style="background-color: ${params[i].color.colorStops[0].color}; width:6px;height:6px; border-radius: 50%;"></div>
        html += '</div>'
        return html
      },
    },
    yAxis: {
      type: 'value',
      name: '电量(kWh)',
      nameTextStyle: {
        color: '#919AAA'
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#E6EBED',
        },
      },
      axisLabel: {
        color: '#919AAA',
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
        },
        show: true,
      },
    },
    xAxis: {
      type: 'category',
      axisLabel: {
        color: '#919AAA',
        //  防止重叠
        hideOverlap: true,
      },
      boundaryGap: ['2%', '2%'],
      axisTick: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          color: '#E6EBED',
        },
      },
    },
    series: res.seriesList.reduce((pre, cur, index) => {
      let base = {
        name: cur.yaxisName,
        type: props.info.seriesType ? seriesTypeEnum(props.info.seriesType) : 'bar',
        showSymbol: false,
        stack: 'Total',
        barMaxWidth: 50,
        itemStyle: {
          color: colors[index],
          borderRadius: !index ? [0, 0, 2, 2] : [2, 2, 0, 0],
        },
        data: cur.ydataAxis.map((item, i) =>
          cur.ytipAxis ? [res.xaxis[i], Number(item), cur.ytipAxis[i]] : [res.xaxis[i], Number(item)]
        ),
      }
      pre.push(base)
      return pre
    }, [])
  }
  init()
}

const init = () => {
  if (!chartRef.value) {
    return
  }
  let myChart = echarts.getInstanceByDom(chartRef.value)
  if (!myChart) {
    myChart = echarts.init(chartRef.value, null, { devicePixelRatio: 2 })
  } else {
    myChart.clear()
  }
  options.value && myChart.setOption(options.value)
  setTimeout(() => {
    myChart.resize()
  }, 100)

  window.addEventListener('resize', () => {
    myChart && myChart.resize()
    options.value && myChart.setOption(options.value)
  })

}

const update = () => {
  if (!chartRef.value) {
    return
  }
  let myChart = echarts.getInstanceByDom(chartRef.value)
  if (!myChart) {
    myChart = echarts.init(chartRef.value, null, { devicePixelRatio: 2 })
  } else {
    myChart.clear()
  }
  options.value && myChart.setOption(options.value)
  myChart.resize()

  window.addEventListener('resize', () => {
    myChart && myChart.resize()
    options.value && myChart.setOption(options.value)
  })
}

defineExpose({
  update,
})
</script>

<style lang="scss" scoped>
.chart-demo-wrapper{
  position: relative;
  overflow: hidden;
  .title{
    background-color: #ecf5ff;
    width: 100%;
    height: 40px;
    border-radius: 8px 8px 0 0;
    text-align: center;
    font-size: 13px;
    // color: #409eff;
    font-weight: bold;
    line-height: 40px;
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
