export const setYAxis = () => {
  return {
    type: 'value',
    nameTextStyle: {
      align: 'center',
      fontSize: 14,
      fontWeight: 500,
      color: '#596078',
      lineHeight: 25,
      padding: [10, 0, 0, 5],
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
    scale: true
  }
}

export const setXAxis = () => {
  return {
    boundaryGap: ['2%', '2%'],
    axisTick: {
      show: false,
    },
    axisLine: {
      lineStyle: {
        color: '#E6EBED',
      },
    },
    axisLabel: {
      color: '#919AAA',
    },
  }
}

export const setGrid = () => {
  return {
    top: '27%',
    left: 20,
    right: 20,
    bottom: '7%',
    containLabel: true,
  }
}
