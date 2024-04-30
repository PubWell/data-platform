<template>
  <div class="wh-100 line-chart">
    <div v-loading="loading" class="wh-100">
      <div class="line-chart-box wh-100">
        <div v-if="options" class="chart-box">
          <div v-if="options?.names" class="header flex flex-jc-sb">
            <div class="name">{{ options?.names[0] }}</div>
            <div class="name" v-if="options?.names.length > 1">{{ options?.names[1] }}</div>
          </div>
          <div ref="chartRef" class="chart"></div>
        </div>
        <!-- <div v-else class="wh-100">
          <Empty></Empty>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
import formatDate from '@/utils/formatDate'
import { onMounted } from 'vue'
import { setYAxis, setXAxis, setGrid } from './hooks.js'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
  },
  markPoint: {
    type: Boolean,
    default: true
  },
  areaStyle: {
    type: Boolean,
    default: true
  },
  xaxisClick: {
    type: Boolean,
    default: false
  },
  options: {
    type: Object,
  },
})
const emits = defineEmits(['click-xaxis'])

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
    let element = document.querySelector('.line-chart-box')
    observer.unobserve(element)
    observer = null
  }
})

const addObserver = () => {
  let element = document.querySelector('.line-chart-box')
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

const setSeriesList = (data) => {
  let xAxis = setXAxisData(data.xaxis)

  let colors = ['#0FB86E', '#0080FF'],
      areaColors = ['rgba(15, 184, 110, 0.1)', 'rgba(0, 128, 255, 0.1)']

  const series = data.seriesList.map((item, index) => {
    let {maxVal, minVal} = getSeriesMaxAndMin(item)
    return {
      type: 'line',
      name: item.yaxisName,
      // emphasis: {
      //   focus: 'series',
      // },
      yAxisIndex: props.options.names.length > 1 ? item.yaxisIndex : 0,
      showSymbol: false,
      itemStyle: {
        color: colors[index],
      },
      markPoint: props.markPoint && maxVal > minVal ? { ...setMarkPoint(index) } : null,
      areaStyle: props.areaStyle ? setAreaStyle(item, areaColors[index]) : null,
      data: item.ydataAxis.map((i, idx) => {
        return item.ytipAxis ? [xAxis[idx], i, item.ytipAxis[idx]] : [xAxis[idx], i]
      }),
      // zLevel: index + 5 * index,
      // z: index + 5 * index,
    }
  })
  return series
}

const setAreaStyle = (data, color) => {
  let {maxVal, minVal} = getSeriesMaxAndMin(data)
  if(maxVal * minVal < 0){
    return {
      color: color,
    }
  }else if(minVal >= 0){
    return {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: color },
        { offset: 1, color: 'rgba(15, 184, 110, 0)' },
      ]),
    }
  }else{
    return null
  }
}

const setMarkPoint = (i) => {
  const colors = ['#0FB86E', '#0080FF']
  let mark = props.options.data.seriesList.length == 1
  return {
    symbol: 'path://M 1.273 9.4966 C 1 11 -0.9437 11 -1.273 9.4966 L -1.273 9.4966 L -2.5 6.7333 L -12 6.7333 C -13.1046 6.7333 -14 5.8379 -14 4.7333 L -14 -9.2667 C -14 -10.3712 -13.1046 -11.2667 -12 -11.2667 L 12 -11.2667 C 13.1046 -11.2667 14 -10.3712 14 -9.2667 L 14 4.7333 C 14 5.8379 13.1046 6.7333 12 6.7333 L 2.5 6.7333 Z M 2.5 14 a 2 2 180 1 0 -5 0 a 2 2 180 1 0 5 0 z',
    symbolSize: function (val) {
      return [35, 34]
    },
    symbolKeepAspect: true,
    itemStyle: {
      color: colors[i],
      shadowColor: 'rgba(0, 0, 0, 0.2)',
      shadowBlur: 10
    },
    label: {
      show: true,
      color: '#fff',
      formatter: function (data) {
        return data.name
      },
    },
    // data: [
    //   { type: 'max', name: 'Max', symbolOffset: ['0.5%', '-42%'], label: {
    //     offset: [0, -5],
    //     position: 'bottom'
    //   } },
    //   { type: 'min', name: 'Min', symbolRotate: 180, symbolOffset: ['1%', '42%'], label: { offset: [0, 7] } },
    // ],
    data: [
      { type: 'max', name: 'Max', symbolRotate: i > 0 ? 180 : 0, symbolOffset: i > 0 ? ['1%', '42%'] : ['0.5%', '-42%'], label: { offset: i > 0 ? [0, 7] : [0, -5] } },
      { type: 'min', name: 'Min', symbolRotate: i > 0 ? 180 : mark ? 180 : 0, symbolOffset: i > 0 ? ['1%', '42%'] : mark ? ['1%', '42%'] : ['0.5%', '-42%'], label: { offset: i > 0 ? [0, 7] : mark ? [0, 7] : [0, -5] } },
    ],

    // symbolSize: function (val) {
    //   return [40, 30]
    // },
    // label: {
    //   color: 'transparent'
    // },
    // data: [
    //   { type: 'max', name: 'Max', symbol: `image://images/max${i + 1}.svg`, symbolOffset: ['0', '-40%'] },
    //   { type: 'min', name: 'Min', symbol: `image://images/min${i + 1}.svg`, symbolOffset: ['0', '40%'] },
    // ],
  }
}

const setTooltip = () => {
  return {
    show: true,
    trigger: 'axis',
    formatter: (params) => {
      let html = `
          <div style="max-height:400px;overflow:scroll; font-size: 12px">
          <div style="margin-bottom:5px; color: #73769F">${formatDate(new Date(+params[0].axisValue), 'yyyy-MM-dd hh:mm:ss')}</div>
        `
      for (let i = 0; i < params.length; i++) {
        const cur = params[i]
        if (!cur.value) {
          return
        }
        html += `
            <div style="color: #73769F">
              ${cur.marker}<span>${cur.seriesName}</span> ：
              <span style="color: #353D5C">${cur.value[2] ? cur.value[2] : `${cur.value[1]}${props.options.unit ? props.options.unit[cur.seriesName] : ''}`}</span>
              </span>
            </div>
          `
      }
      html += '</div>'
      return html
    },
  }
}

const setXAxisData = (data) => {
  data.sort((a, b) => a - b)
  return [...data]
}

const update = () => {
  if(!chartRef.value){
    return
  }
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
      ...props.options?.tooltip,
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
      ...props.options?.legend,
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
      type: 'time',
      ...setXAxis(),
      axisLabel: {
        color: '#919AAA',
        formatter: (value) => {
          return formatDate(new Date(+value), 'hh:mm')
        },
      },
      triggerEvent: props.xaxisClick,
      ...props.options?.xAxis,
    },

    yAxis: props.options.names.map((item, index) => {
      if(props.options?.yAxis){
        return {
          // name: item,
          ...setYAxis(),
          ...props.options.yAxis[index]
        }
      }
      return {
        // name: item,
        ...setYAxis(),
      }
    }),
    series: [...setSeriesList(props.options.data)],
  }
  option && myChart.setOption(option)

  if(props.xaxisClick){
    // 点击x轴label以及轴线获取当前坐标 -- category 获取index
    myChart.getZr().on('click', (params) => {
      let pointInPixel = [params.offsetX, params.offsetY]
      if (myChart.containPixel('grid', pointInPixel)) {
        // 获取点击的像素位置，转换为x轴的位置
        // 因存在轴线左右位置偏移，需取中间值进行比较
        let x = myChart.convertFromPixel({ seriesIndex: 0 }, pointInPixel)[0]
        
        let date = formatDate(new Date(x), 'yyyy-MM-dd'), middle = new Date(`${date} 12:00:00`).getTime(),
        resDate = middle > x ? date : formatDate(new Date(middle + 12 * 3600 * 1000), 'yyyy-MM-dd')

        emits('click-xaxis', resDate)
      }
    })

    myChart.on('click', (params) => {
      if(props.options.data.xaxis.length == 1){
        return
      }
      if (params.componentType == 'xAxis') {
        emits('xaxis-click', formatDate(new Date(params.value), 'yyyy-MM-dd'))
      }
    })
  }

  window.addEventListener('resize', () => {
    myChart && myChart.resize()
  })
}

const getChart = () => {
  return chartRef.value
}

defineExpose({
  getChart
})
</script>

<style scoped lang="scss">
.line-chart {
  width: 100%;
  height: 100%;
  position: relative;
  .line-chart-box{
    display: flex;
    flex-direction: column;
    .title{
      text-align: center;
      font-size: 16px;
      font-weight: bold;
      color: #3A416C;
      line-height: 45px;
    }
    .chart-box{
      flex: 1;
      width: 100%;
      position: relative;
      .header{
        width: 100%;
        position: absolute;
        left: 20px;
        top: 30px;
        .name{
          font-size: 14px;
          // font-weight: bold;
          color: #596078;
          line-height: 20px;
        }
      }
      .chart {
        width: 100%;
        height: 100%;
      }
    }
  }
}
:deep(.n-spin-content) {
  height: 100%;
  width: 100%;
}
</style>
