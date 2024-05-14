<template>
  <div class="charge-chart-wrap">
    <div v-if="options" class="wh-100 flex-column">
      <div class="name">{{options.name}}</div>
      <div ref="chartRef" class="flex-1 chart"></div>
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
    let element = document.querySelector('.charge-chart-wrap')
    observer.unobserve(element)
    observer = null
  }
})

const addObserver = () => {
  let element = document.querySelector('.charge-chart-wrap')
  observer = new ResizeObserver((ele) => {
    myChart.resize()
  })
  observer.observe(element)
}

const setTooltip = () => {
  return {
    show: true,
    trigger: 'axis',
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
          params[i].data[2] ? params[i].data[2] : params[i].data[1] + props.options.unit[params[i].seriesName]
        }
        </div>
        `
      }
      // <div style="background-color: ${params[i].color.colorStops[0].color}; width:6px;height:6px; border-radius: 50%;"></div>
      html += '</div>'
      return html
    },
  }
}

const setSeries = () => {
  let data = props.options.data, colors = ['#0FB86E', '#0080FF']
  return data.seriesList.reduce((pre, cur, index) => {
    let base = {
      name: cur.yaxisName,
      type: 'bar',
      showSymbol: false,
      stack: 'Total',
      barMaxWidth: 50,
      itemStyle: {
        color: colors[index],
        borderRadius: !index ? [0, 0, 2, 2] : [2, 2, 0, 0],
      },
      data: cur.ydataAxis.map((item, i) =>
        cur.ytipAxis ? [data.xaxis[i], Number(item), cur.ytipAxis[i]] : [data.xaxis[i], Number(item)]
      ),
    }
    pre.push(base)
    return pre
  }, [])
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
    grid: {
      ...setGrid(),
      ...props.options.legend,
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
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      ...setTooltip(),
      ...props.options.tooltip,
    },
    yAxis: {
      name: '',
      ...setYAxis(),
      ...props.options.yAxis,
    },
    xAxis: {
      type: 'category',
      ...setXAxis(),
      data: props.options.data.xaxis,
      ...props.options.xAxis,
    },
    series: [...setSeries()],
  }
  option && myChart.setOption(option)
}
</script>

<style scoped lang="scss">
.charge-chart-wrap {
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