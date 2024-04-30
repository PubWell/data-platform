import { defineStore } from 'pinia'

export const dataChartStore = defineStore('data-chart', {
  state() {
    return {
      cols: 3,
      chartConfig: null,
      deleteChartItem: null
    }
  },
  actions: {
    refreshCols(e) {
      this.cols = e
    },
    setChartConfig(e) {
      this.chartConfig = {...e}
    },
    deleteChart(e) {
      this.deleteChartItem = e
    }
  },
})
