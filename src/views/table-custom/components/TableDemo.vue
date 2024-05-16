<template>
  <div class="sel-table-wrapper wh-100">
    <table>
      <thead>
        <tr>
          <th v-for="h in tableColumns" :key="h.prop">{{ h.label }}</th>
        </tr>
      </thead>
      <tbody class="custom-tbody" :style="{'height': `${style.height}px`}">
        <tr
          v-for="(row, index) in tableData"
          :key="row.id"
          :class="{'active': isSelected(row.id), 'move-over': rowMoveMouseOver === row.id}"
        >
        <template v-for="h in tableColumns" :key="h.prop">
          <td v-if="h.prop === 'id'" class="header-selected" colspan="1" rowspan="1" @mousedown="headerMouseDown" @mouseover="cellMouseOver">{{ row.id }}</td>
          <td v-else :style="{'display': row.cfg.mergeStatus && row.cfg.mergeStart.id != row.id ? 'none' : 'table-cell'}" class="allow-drag" :rowspan="row.cfg.rowspan" @mousedown="cellMouseDown" @mouseover="cellMouseOver">{{ row[h.prop] }}</td>
        </template>

        </tr>
      </tbody>
    </table>
  </div>

  <ContextMenu
    v-if="contextMenu.show"
    ref="contextMenuRef"
    :left="contextMenu.left"
    :top="contextMenu.top"
    :selection="contextMenu.selected"
    @exec-command="onExec"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
// http://www.sortablejs.com/options.html 配置项中文文档
// import Sortable from "sortablejs";
import ContextMenu from './ContextMenu.vue'

const style = reactive({
  height: 300,
})

const addTo = ref(null)

const tableData = ref([])
const tableColumns = ref([
  { label: '', prop: 'id' },
  { label: 'Name', prop: 'name' },
  { label: 'Age', prop: 'age' },
])

const rowSelect = ref(false)
const rowMove = ref(false)
const selection = ref([])
const rowMoveMouseOver = ref(null)

const mouseParam = reactive({
  mouseDownX: 0,
  mouseDownY: 0,
  offsetX: 0,
  offsetY: 0,
  mouseDownEle: null,
  mouseShadow: null
})
const contextMenuRef = ref(null)
const contextMenu = reactive({
  show: false,
  left: 0,
  top: 0,
  mousedownX: 0,
  mousedownY: 0,
  isMousedown: false,
  selected: []
})
const ctrlDown = ref(false)

const isSelected = computed(() => {
  return (e) => {
    return selection.value.indexOf(e) > -1
  }
})

onMounted(() => {
  getTableData()
  console.log(tableData.value)
  let dom = null
  if(addTo.value){
    dom = document.querySelector(addTo.value)
  }else{
    dom = document.querySelector('body')
  }

  document.oncontextmenu = function(){return false}

  dom.addEventListener('mousemove', (e) => {
    e.preventDefault()
    if(rowSelect.value || rowMove.value){
      mouseOverHandler(e)
    }
  })

  dom.addEventListener('mouseup', cellMouseUp)

  dom.addEventListener('mousedown', (e) => {
    let contextmenu = document.getElementById('context-menu-wrapper')

    if(e.which != 3){
      if(contextmenu && contextmenu.contains(e.target)){
        return true
      }else{
        hideContextMenu()
      }
    }
  })

  document.addEventListener('keydown',(e)=>{
    if(e.ctrlKey){
      ctrlDown.value = true
    }
  })

  document.addEventListener('keyup',(e)=>{
    if(!e.ctrlKey){
      ctrlDown.value = false
    }
  })
})

const getTableData = () => {
  tableData.value = Array.from({ length: 40 }, (_, index) => {
    return { id: index+1, name: `name_${index+1}`, age: `${index + 10}`, cfg: {mergeStatus: false, rowspan: 1}}
  })
}

const cellMouseDown = (e) => {
  e.preventDefault()
  selection.value = []
}

const headerMouseDown = (e) => {
  e.preventDefault()
  if (e.which === 3) {
    showContextMenu(e)
  }
  let k = getRowKey(e)

  if(selection.value.indexOf(k) == -1){
    if(!ctrlDown.value) {
      selection.value = []
    }
    rowSelect.value = true
    selection.value.push(k)
  }else{
    rowMove.value = true
    mouseParam.mouseDownEle = e.target
    mouseParam.mouseDownX = e.clientX
    mouseParam.mouseDownY = e.clientY
    // let dom = document.querySelector('.sel-table-wrapper'),rect = dom.getBoundingClientRect()
    // let t = e.target.getBoundingClientRect()
    // console.log(rect,t)
    // mouseParam.offsetX = mouseParam.mouseDownX - rect.left
    // mouseParam.offsetY = mouseParam.mouseDownY - rect.top

    createMouseOverShadow()
  }
}

const cellMouseOver = (e) => {
  e.preventDefault()

  if(rowSelect.value){
    let k = getRowKey(e)
    if(selection.value.indexOf(k) > -1){
      let idx = selection.value.indexOf(k)
      selection.value.splice(idx, 1)
    }else{
      selection.value.push(k)
    }
  }else if(rowMove.value){
    let k = getRowKey(e)
    mouseParam.mouseShadow.style.top = calculateTop(e.target)
    if(selection.value.indexOf(k) == -1){
      rowMoveMouseOver.value = k
    }else{
      rowMoveMouseOver.value = null
    }
  }
  if(rowSelect.value || rowMove.value){
    mouseOverHandler(e)
  }
}

const cellMouseUp = (e) => {
  e.preventDefault()
  let k = getRowKey(e)

  if(rowMove.value){
    let dom = document.querySelector('.sel-table-wrapper')
    dom.removeChild(mouseParam.mouseShadow)
    if(rowMoveMouseOver.value){
      let newIdx = tableData.value.findIndex((item) => item.id === k)
      let toBeAdd = selection.value.map((item) => {
        return tableData.value.find((t) => t.id === item)
      })
      selection.value.forEach((item) => {
        let idx = tableData.value.findIndex((t) => t.id === item)
        tableData.value.splice(idx, 1)
      })
      tableData.value.splice(newIdx, 0, ...toBeAdd)
    }
  }
  rowSelect.value = false
  rowMove.value = false
  rowMoveMouseOver.value = null
}

const getRowKey = (e) => {
  
  return tableData.value[+e.target.innerText - 1] ? tableData.value[+e.target.innerText - 1].id : null
}

const createMouseOverShadow = () => {
  let {width, height} = getTbodyTrRect()
  let t = mouseParam.mouseDownEle.getBoundingClientRect()

  let d = document.createElement('div')
  d.setAttribute('id', 'mouse-shadow')
  d.style.width = `${width - t.width}px`
  d.style.height = height + 'px'
  d.style.background = 'rgba(0,0,0,0.3)'

  d.style.position = 'absolute'
  d.style.left = `${t.width}px`
  d.style.top = calculateTop(mouseParam.mouseDownEle)
  mouseParam.mouseShadow = d

  let dom = document.querySelector('.sel-table-wrapper')
  dom.appendChild(d)
}

const calculateTop = (d) => {
  let {top} = getTbodyTrRect()
  let rect = d.getBoundingClientRect(), h = getTheadRect()

  return `${rect.top - top + (top - h.top)}px`
}

const getTbodyTrRect = () => {
  let dom = document.querySelector('.sel-table-wrapper tbody tr')
  return dom.getBoundingClientRect()
}

const getTheadRect = () => {
  let dom = document.querySelector('.sel-table-wrapper thead tr')
  return dom.getBoundingClientRect()
}

const mouseOverHandler = (e) => {
  let {x, y, width, height} = getTheadRect(), offsetY = y + height
  let {clientX, clientY} = e
  
  let dom = document.querySelector('tbody')

  if(clientY - offsetY >= style.height){
    dom.scrollTop += 2
  }else if(clientY - offsetY <= 0){
    dom.scrollTop -= 2
  }
}

const getContextMenuPosition = (x, y) => {
  let contextMenuRect = contextMenuRef.value.getRect()
  if (x + contextMenuRect.width > window.innerWidth) {
    x = x - contextMenuRect.width - 20
  }
  if (y + contextMenuRect.height > window.innerHeight) {
    y = window.innerHeight - contextMenuRect.height - 10
  }
  return { x, y }
}

// 执行命令
const onExec = (key) => {
  let id = new Date().getTime(),
    startIdx = tableData.value.findIndex((item) => item.id === selection.value[0]),
    endIdx = tableData.value.findIndex((item) => item.id === selection.value[selection.value.length - 1])
  
  let obj = {}
  Object.keys(tableColumns.value).forEach((key) => {
    obj[key] = ''
  })
  obj.id = id
  switch (key) {
    case 'INSERT_ABOVE':
      tableData.value.splice(startIdx, 0, obj)
      break
    case 'INSERT_BELOW':
      tableData.value.splice(endIdx+1, 0, obj)
      break
    case 'DELETE':
      selection.value.forEach((item, index) => {
        tableData.value.splice(index, 1)
      })
      break
    case 'MERGE':
      // 原始数据 显示数据 
      let startId = selection.value[0],
          start = tableData.value.find((t) => t.id === startId)

      // to do - sort
      

      let endId = selection.value[selection.value.length - 1], end = tableData.value.find((t) => t.id === endId)
      selection.value.forEach((item, index) => {
        let idx = tableData.value.findIndex((t) => t.id === item)
        if(index > 0){
          tableData.value[idx].cfg.mergeStatus = true
          tableData.value[idx].cfg.mergeStart = start
          tableData.value[idx].cfg.mergeEnd = end
          
          // tableData.value[idx] = {
          //   id: tableData.value[idx].id,

          // }
          Object.keys(item).forEach((j,id) => {
            if(j != 'id'){
              tableData.value[idx][j] = start[j]
            }
          })
        }else{
          tableData.value[idx].cfg.rowspan = `${selection.value.length}`
          tableData.value[idx].cfg.mergeStatus = true
          tableData.value[idx].cfg.mergeStart = start
          tableData.value[idx].cfg.mergeEnd = end
        }
      })
      break
    case 'UNMERGE':
      // let s1 = tableData.value.find((t) => t.id === selection.value[0]), e1 = tableData.value.find((t) => t.id === selection.value[selection.value.length - 1])
      // if(s1.cfg.mergeStart.id === selection.value[0].id){

      // }
      selection.value.forEach((item, index) => {
        let idx = tableData.value.findIndex((t) => t.id === item)
        tableData.value[idx].cfg.mergeStatus = false
        tableData.value[idx].cfg.mergeStart = null
        tableData.value[idx].cfg.mergeEnd = null
        if(index == 0){
          tableData.value[idx].cfg.rowspan = 1
        }
      })
      break
    case 'COPY':
      break
    case 'PASTE':
      break
    default:
      console.log(key)
      break
  }
  contextMenu.show = false
}

const showContextMenu = (e) => {
  contextMenu.show = true
  nextTick(() => {
    const { x, y } = getContextMenuPosition(e.clientX + 10, e.clientY + 10)
    contextMenu.left = x
    contextMenu.top = y
    contextMenu.selected = selection.value.map((item) => {
      return tableData.value.find((t) => t.id === item)
    })
    console.log(contextMenu.selected)
  })
}

const hideContextMenu = () => {
  contextMenu.show = false
  contextMenu.selection = null
  contextMenu.left = -9999
  contextMenu.top = -9999
}
</script>

<style scoped lang="scss">
.sel-table-wrapper{
  position: relative;
  // .custom-tbody{
  //   height: 200px;
  //   overflow: auto;
  // }
  table,tbody {
    display: block;
    border: 0;
    border-spacing: 0;
    border-collapse: collapse;
    cursor: default;
  }
  table{
    overflow: hidden;
    border: 1px solid #000000
  }
  tbody {
    // height: 200px;
    overflow-y: auto;
  }

  table thead,
  tbody tr {
    // display: table;
    width: 100%;
    table-layout: fixed;
  }

  table thead {
    width: 100%
  }

  table thead th {
    background: #84acde;
    // width: 20%;
    font-size: 14px;
    line-height: 35px;
    font-weight: bold;
    color: #ededed
  }

  table tbody td {
    // width: 20%;
    text-align: center;
    font-size: 12px;
    line-height: 30px;
  }
}
th{
  min-width: 100px;
  background-color: #ededed;
}

tr td{
  min-width: 100px;
  text-align: center;
  //cursor: auto;
  border: 1px solid transparent;
}

tr:not(.active) td.header-selected{
  background-color: #ededed;
  border: 1px solid #ededed;
  cursor: default;
}
tr.active td.header-selected{
  background-color: #5573e9;
  cursor: grab;
}
tr.active td:not(.header-selected){
  border-top: 1px solid #5573e9;
  border-bottom: 1px solid #5573e9;
}
tr.active td:not(.header-selected):first-child{
  border-left: 1px solid #5573e9;
}
tr.active td:not(.header-selected):last-child{
  border-right: 1px solid #5573e9;
}

tr.move-over td{
  border-bottom: 3px solid #5573e9;
}
//tr{
//  &.active{
//    td.header-selected{
//      background-color: #ededed;
//    }
//    td:not(.header-selected){
//      border-top: 1px solid #ededed;
//      border-bottom: 1px solid #ededed;
//    }
//    td:not(.header-selected):first-child{
//      border-left: 1px solid #ededed;
//    }
//    td:not(.header-selected):last-child{
//      border-right: 1px solid #ededed;
//    }
//  }
//}
</style>
