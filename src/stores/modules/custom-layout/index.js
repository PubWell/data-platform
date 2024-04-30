import { defineStore } from 'pinia'
import { cloneDeep } from 'lodash'

export const customLayoutStore = defineStore('custom-layout', {
  state() {
    return {
      templateId: -1,
      cols: 12,
      rows: 12,
      gap: 10, // px
      layout: [
        { x: 0, y: 0, w: 6, h: 3, i: 1, path: '/src/views/lib/chart/itot/index.vue' },
        { x: 6, y: 0, w: 6, h: 3, i: 2, path: '/src/views/lib/chart/volt/index.vue' },
        { x: 0, y: 3, w: 12, h: 3, i: 3, path: '/src/views/lib/chart/energy/index.vue' },
        { x: 0, y: 6, w: 4, h: 3, i: 4, path: '/src/views/lib/chart/itot/index.vue' },
        { x: 4, y: 6, w: 4, h: 3, i: 5, path: '/src/views/lib/chart/volt/index.vue' },
        { x: 8, y: 6, w: 4, h: 3, i: 6, path: '/src/views/lib/chart/energy/index.vue' },
      ],
    }
  },
  actions: {
    refreshCols(e) {
      this.cols = e
    },
    refreshRows(e) {
      this.rows = e
    },
    addLayout(row, col) {
      let len = this.layout.length, start = 0, time = new Date().getTime()
      if(len){
        let pre = this.layout[len - 1]
        start = pre.y + pre.h
      }
      let curCol = this.cols / col
      for(let i = 0; i < col; i++){
        this.layout.push({ x: curCol * i, y: start, w: curCol, h: row, i: time + i, path: null })
      }
    },
    deleteLayout(e) {
      let delIndex = this.layout.findIndex(el => e.i == el.i), delItem = this.layout[delIndex]
      this.layout.splice(delIndex, 1)
      // this.layout = this.layout.filter((a) => a.i != e.i);
    },
    refreshLayout(e) {
      let idx = this.layout.findIndex(el => e.i == el.i)
      this.layout[idx].path = e.path
      this.layout[idx].loadComp = e.loadComp
    },
    reset() {
      this.templateId = -1
      this.cols = 12
      this.rows = 12
      this.gap = 10
      this.layout = []
    },
    init(e) {
      this.templateId = e.id
      this.cols = e.cols
      this.rows = e.rows
      this.gap = e.gap
      this.layout = cloneDeep([...e.layout])
    }
  },
})
