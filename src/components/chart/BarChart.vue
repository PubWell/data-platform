<template>
  <div class="bar-chart-wrap" id="chart-container">
    <div v-if="options" class="wh-100 flex-column">
      <div class="name">{{options.name}}</div>
      <div ref="chartRef" class="chart"></div>
    </div>
    <!-- <Empty v-else class="empty empty-box"></Empty> -->
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { nextTick } from 'vue'
import { setYAxis, setXAxis, setGrid } from './hooks.js'

const props = defineProps({
  options: {
    type: Object,
  },
  markPoint: {
    type: Boolean,
    default: true
  },
  xaxisClick: {
    type: Boolean,
    default: false
  },
})

const chartRef = ref(null)
let observer = null
let myChart = null

watch(
  () => props.options,
  () => {
    nextTick(() => {
      update()
    })
  }
)

onMounted(() => {
})

onBeforeUnmount(() => {
  if (observer) {
    let element = document.querySelector('.bar-chart-wrap')
    observer.unobserve(element)
    observer = null
  }
})

const addObserver = () => {
  let element = document.querySelector('.bar-chart-wrap')
  observer = new ResizeObserver((ele) => {
    myChart.resize()
  })
  observer.observe(element)
}

const getSeriesMaxAndMin = (val) => {
  let arr = []
  val.ydataAxis.forEach((it) => {
    if (it) {
      arr.push(+it)
    }
  })

  arr = arr
    .reduce((pre, cur) => {
      if (pre.indexOf(cur) === -1) {
        pre.push(cur)
      }
      return pre
    }, [])
    .sort((a, b) => a - b)
  const isOnly = arr.length === 1
  if (isOnly) {
    return {
      maxVal: arr[0],
      minVal: arr[0],
      max: Number((arr[0] + 1).toFixed(3)),
      min: Number((arr[0] - 1).toFixed(3)),
    }
  }
  const max = arr[arr.length - 1]
  const min = arr[0]
  const pie = (max - min) / 5
  return {
    maxVal: max,
    minVal: min,
    max: Number((max + pie).toFixed(3)),
    min: Number((min - pie).toFixed(3)),
  }
}

const setSeries = () => {
  let data = props.options.data, limit = props.options.limit

  let { maxVal, minVal, max, min } = getSeriesMaxAndMin(data.seriesList[0]),
      maxIdx = data.seriesList[0].ydataAxis.findIndex((item) => Number(item) == maxVal),
      minIdx = data.seriesList[0].ydataAxis.findIndex((item) => Number(item) == minVal),
      maxTarget = { x: data.xaxis[maxIdx], y: maxVal },
      minTarget = { x: data.xaxis[minIdx], y: minVal }

  let series = {
      type: 'bar',
      name: props.options.name,
      itemStyle: {
        color: function (params) {
          if (maxTarget.x == minTarget.x) {
            return Number(params.data) > limit ? '#FCE0E0' : '#D0F3E3'
          }
          if (Number(params.data) > limit) {
            return params.name == maxTarget.x || params.name == minTarget.x ? '#F06464' : '#FCE0E0'
          }
          return params.name == maxTarget.x || params.name == minTarget.x ? '#15C172' : '#D0F3E3'
        },
      },
      markLine: {
        symbol: 'none',
        label: {
          color: '#F06464',
          fontSize: 15,
          // position: 'start',
          // borderRadius: 8,
          // padding: 5,
          // backgroundColor: '#F06464',
        },
        data: [
          {
            name: 'Max',
            yAxis: limit,
            symbol: 'none',
            lineStyle: {
              color: '#F06464',
            },
          },
        ],
      },
      data: [...data.seriesList[0].ydataAxis],
    },
    markPoint = {
      symbol:
        'path://M1.5 0C.671 0 0 .67 0 1.5v8.994c0 .829.671 1.499 1.5 1.499h3.733l1.851 2.775a.5.5 0 0 0 .832 0l1.851-2.775H13.5c.829 0 1.5-.67 1.5-1.5V1.5c0-.83-.671-1.5-1.5-1.5z',
      symbolSize: function (val) {
        return [31, 21]
      },
      symbolKeepAspect: true,
      symbolOffset: ['0', '-60%'],
      itemStyle: {
        color: '#15C172',
      },
      label: {
        // color: 'transparent',
        color: '#fff',
        formatter: function (data) {
          return `${data.name}`
        },
      },
      data: [
        { type: 'max', name: 'Max', itemStyle: { color: maxTarget.y <= limit ? '#15C172' : '#F06464' } },
        { type: 'min', name: 'Min', itemStyle: { color: minTarget.y <= limit ? '#15C172' : '#F06464' } },
      ],
    }

  if (maxTarget.x != minTarget.x) {
    return [
      {
        ...series,
        markPoint,
      },
    ]
  } else {
    return [
      {
        ...series,
      },
    ]
  }
}

const setTooltip = () => {
  return {
    show: true,
    trigger: 'axis',
    formatter: (params) => {
      let html = `
          <div style="max-height:400px;overflow:scroll; font-size: 12px">
          <div style="margin-bottom:5px; color: #73769F">${params[0].axisValue}#</div>
        `
      for (let i = 0; i < params.length; i++) {
        const cur = params[i]
        if (!cur.value) {
          return
        }
        html += `
            <div style="color: #73769F">
              ${cur.marker}<span>${cur.seriesName}</span> ： <span style="color: #353D5C">${cur.value}${props.options.unit}</span>
            </div>
          `
      }
      html += '</div>'
      return html
    },
  }
}

const update = () => {
  myChart = echarts.getInstanceByDom(chartRef.value)
  if (!myChart) {
    myChart = echarts.init(chartRef.value, null, { devicePixelRatio: 2 })
  } else {
    myChart.clear()
  }
  addObserver()

  const option = {
    tooltip: {
      ...setTooltip(),
      ...props.options.tooltip,
    },
    legend: {
      show: props.options.data.seriesList.length > 1,
      top: 30,
      right: 10,
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
      textStyle: {
        color: '#727C94',
        fontSize: 13,
      },
      ...props.options.legend,
    },
    grid: {
      ...setGrid(),
      ...props.options?.grid,
    },
    dataZoom: props.options.dataZoom ? {
      ...props.options.dataZoom,
    } : null,
    visualMap: props.options.visualMap ? {
      ...props.options.visualMap,
    } : null,
    xAxis: {
      type: 'category',
      ...setXAxis(),
      data: props.options.data.xaxis,
      ...props.options.xAxis,
    },
    yAxis: {
      // name: props.options.name,
      ...setYAxis(),
      ...props.options.yAxis,
      
    },
    series: [...setSeries()],
  }
  option && myChart.setOption(option)
}
</script>

<style scoped lang="scss">
.bar-chart-wrap {
  width: 100%;
  height: 100%;
  position: relative;
  .name{
    position: absolute;
    left: 20px;
    top: 30px; 
    font-size: 14px;
    color: #596078;
  }
  .chart {
    width: 100%;
    height: 100%;
  }
  .empty-box {
    width: 100%;
    height: 100%;
  }
}
</style>
