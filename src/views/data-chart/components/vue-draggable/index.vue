<template>
  <div class="itxst">

    <div class="col">
      <draggable :list="arr1" item-key="id" v-bind="{group:{name: 'itxst', pull:'clone', put: false}, sort: false}" animation="300" @end="onEnd" :move="onMove">
        <template #item="{ element }">
          <div class="item">
            {{ element.name }}
          </div>
        </template>
      </draggable> 
    </div>

    <div class="col">
      <draggable :list="arr2" item-key="id" v-bind="{group:{name: 'itxst', pull: true, put: true}, sort: true}" animation="300">
        <template #item="{ element }">
          <div class="item2">
            {{ element.name }}
          </div>
        </template>
      </draggable> 
    </div>

  </div>
</template>

<script setup>
//导入draggable组件
import draggable from 'vuedraggable'
// https://www.itxst.com/vue-draggable-next/tutorial.html

const arr1 = [
  { id: 1, name: 'www.itxst.com（不允许停靠）' },
  { id: 2, name: 'www.jd.com' },
  { id: 3, name: 'www.baidu.com' },
  { id: 5, name: 'www.google.com' },
  { id: 4, name: 'www.taobao.com（不允许拖拽）' }
]
const arr2 = ref([
  { id: 11, name: '常用菜单' }, 
])
let moveTarget = null

//拖拽结束的事件
const onEnd = (e) => {
  if(!moveTarget){
    return
  }
  const items = arr2.value.filter((m) => {
    return m.id == moveTarget.id
  })
  //如果已存在
  if(items.length < 2) return;
  arr2.value.splice(e.newDraggableIndex, 1)
};

//move回调方法
const onMove = (e,originalEvent) => {
  moveTarget = e.draggedContext.element;
  return true;
}
</script>
<style scoped> 
.itxst {
  margin: 10px;
  text-align :left;
}
.col {
  width: 40%;
  flex: 1;
  padding: 10px;
  border: solid 1px #eee;
  border-radius: 5px;
  float: left;
}
.col + .col {
  margin-left: 10px;
}
.item {
  padding: 6px 12px;
  margin: 0px 10px 0px 10px;
  border: solid 1px #eee;
  background-color: #f1f1f1;
  text-align: left;
}
.item + .item {
  border-top: none;
  margin-top: 6px;
}

.item:hover {
  background-color: #fdfdfd;
  cursor: move;
}
.item2 {
  padding: 6px 12px;
  margin: 0px 10px 0px 10px;
  border: solid 1px #eee;
  background-color: pink;
  text-align: left;
}
.item2 + .item2 {
  border-top: none;
  margin-top: 6px;
}

.item2:hover {
  outline: solid 1px #ddd;
  cursor: move;
}
</style>