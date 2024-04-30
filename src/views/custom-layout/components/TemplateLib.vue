<template>
  <div class="template-lib-wrapper">
    <div class="template-lib">
      <el-input
        v-model="keyword"
        placeholder="搜索"
        :prefix-icon="Search"
      />
  
      <div class="template-list mt-10">

        <div class="item" :class="{'active': !activeTemplate}" @click="onTemplateClick(null)">
          <div class="empty">空白模板</div>
        </div>

        <div class="item"
          v-for="(item, index) in templateList"
          :key="item.id"
          :class="{'active': activeTemplate == item.id}"
          @click="onTemplateClick(item)"
        >
          <div class="normal">模板{{ `(${item.rows} x ${item.cols})` }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue'
import { customLayoutStore } from '@/stores'

const store = customLayoutStore()

const emits = defineEmits(['change'])
const keyword = ref()
const activeTemplate = ref(null)
const templateList = ref([
  // {
  //   id: 1,
  //   rows: 3,
  //   cols: 3,
  //   gap: 10,
  //   layout: [
  //     { x: 0, y: 0, w: 1, h: 1, i: 1, path: '/src/views/lib/chart/itot/index.vue' },
  //     { x: 1, y: 0, w: 1, h: 1, i: 2, path: '/src/views/lib/chart/volt/index.vue' },
  //     { x: 2, y: 0, w: 1, h: 1, i: 3, path: '/src/views/lib/chart/energy/index.vue' },
  //     { x: 0, y: 1, w: 1, h: 1, i: 4, path: '/src/views/lib/chart/itot/index.vue' },
  //     { x: 1, y: 1, w: 1, h: 1, i: 5, path: '/src/views/lib/chart/volt/index.vue' },
  //     { x: 2, y: 1, w: 1, h: 1, i: 6, path: '/src/views/lib/chart/energy/index.vue' },
  //     { x: 0, y: 2, w: 1, h: 1, i: 7, path: '/src/views/lib/chart/itot/index.vue' },
  //     { x: 1, y: 2, w: 1, h: 1, i: 8, path: '/src/views/lib/chart/volt/index.vue' },
  //     { x: 2, y: 2, w: 1, h: 1, i: 9, path: '/src/views/lib/chart/energy/index.vue' },
  //   ]
  // },
  // {
  //   id: 2,
  //   rows: 4,
  //   cols: 4,
  //   gap: 10,
  //   layout: [
  //     { x: 0, y: 0, w: 2, h: 1, i: 1, path: '/src/views/lib/chart/itot/index.vue' },
  //     { x: 2, y: 0, w: 2, h: 1, i: 2, path: '/src/views/lib/chart/volt/index.vue' },
  //     { x: 0, y: 1, w: 4, h: 1, i: 3, path: '/src/views/lib/chart/energy/index.vue' },
  //     { x: 0, y: 2, w: 1, h: 1, i: 4, path: '/src/views/lib/chart/itot/index.vue' },
  //     { x: 1, y: 2, w: 1, h: 1, i: 5, path: '/src/views/lib/chart/volt/index.vue' },
  //     { x: 2, y: 2, w: 1, h: 1, i: 6, path: '/src/views/lib/chart/energy/index.vue' },
  //     { x: 3, y: 2, w: 1, h: 1, i: 7, path: '/src/views/lib/chart/itot/index.vue' },
  //     { x: 0, y: 3, w: 2, h: 1, i: 8, path: '/src/views/lib/chart/volt/index.vue' },
  //     { x: 2, y: 3, w: 2, h: 1, i: 9, path: '/src/views/lib/chart/energy/index.vue' },
  //   ]
  // }
])

const onTemplateClick = (e) => {
  if(e){
    activeTemplate.value = e.id
    store.init(e)
  }else{
    activeTemplate.value = null
    store.reset()
  }
}
</script>

<style lang="scss" scoped>
.template-lib-wrapper{
  width: 100%;
  .template-lib{
    padding: 10px;
    .template-list{
      .item{
        width: 100%;
        height: 150px;
        padding: 6px;
        border-radius: 3px;
        background-color: #ffffff;
        border: 1px solid #eee;
        cursor: pointer;
        &:not(:first-child){
          margin-top: 10px;
        }
        &.active{
          border: 1px solid #aad0f7;
          box-shadow: 0px 0px 5px 2px #c4def8;
        }
        .empty{
          width: 100%;
          height: 100%;
          background-color: #c4def8;
          font-size: 15px;
          color: #6e6e6e;
          line-height: 130px;
          text-align: center;
        }
        .normal{
          width: 100%;
          height: 100%;
          border: 1px solid #c4def8;
          font-size: 15px;
          color: #6e6e6e;
          line-height: 130px;
          text-align: center;
        }
      }
    }
  }
}
</style>