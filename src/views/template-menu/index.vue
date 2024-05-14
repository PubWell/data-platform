<template>
  <div class="template-menu-wrapper wh-100">
    <div class="template-menu wh-100">
      <div class="template-menu-comp"
           v-for="item in pageCfg.layout"
           :key="item.i"
           :style="{
            'margin-left': pageCfg.gap + 'px',
            'margin-top': pageCfg.gap + 'px',
            'width': colWidth * item.w + pageCfg.gap * (item.w-1) + 'px',
            'height': rowHeight * item.h + pageCfg.gap * (item.h-1) + 'px',
           }"
      >
        <component :is="item.loadComp" :interaction="true"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { customLayoutStore } from '@/stores'

const store = customLayoutStore()

const colWidth = ref()
const rowHeight = ref()
const pageCfg = ref({
  rows: store.rows,
  cols: store.cols,
  gap: store.gap,
  layout: [...store.layout],
  // id: 1,
  // rows: 3,
  // cols: 3,
  // gap: 20,
  // layout: [
  //   { x: 0, y: 0, w: 1, h: 1, i: 1, path: '/src/views/lib/chart/itot/index.vue' },
  //   { x: 1, y: 0, w: 1, h: 1, i: 2, path: '/src/views/lib/chart/volt/index.vue' },
  //   { x: 2, y: 0, w: 1, h: 1, i: 3, path: '/src/views/lib/chart/energy/index.vue' },
  //   { x: 0, y: 1, w: 1, h: 1, i: 4, path: '/src/views/lib/chart/itot/index.vue' },
  //   { x: 1, y: 1, w: 1, h: 1, i: 5, path: '/src/views/lib/chart/volt/index.vue' },
  //   { x: 2, y: 1, w: 1, h: 1, i: 6, path: '/src/views/lib/chart/energy/index.vue' },
  //   { x: 0, y: 2, w: 1, h: 1, i: 7, path: '/src/views/lib/chart/itot/index.vue' },
  //   { x: 1, y: 2, w: 1, h: 1, i: 8, path: '/src/views/lib/chart/volt/index.vue' },
  //   { x: 2, y: 2, w: 1, h: 1, i: 9, path: '/src/views/lib/chart/energy/index.vue' },
  // ]
})

onMounted(() => {
  initView()

  window.addEventListener('resize', initView)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', initView)
})

const initView = () => {
  pageCfg.value.layout.forEach((item) => {
    let resComp = markRaw(loadComponent(item.path))
    item.loadComp = resComp
  })

  let dom = document.querySelector('.template-menu'),
  {width, height} = dom.getBoundingClientRect()
  colWidth.value = (width - 2 * pageCfg.value.gap - pageCfg.value.gap * (pageCfg.value.cols - 1)) / pageCfg.value.cols
  rowHeight.value = (height - 2 * pageCfg.value.gap - pageCfg.value.gap * (pageCfg.value.rows - 1)) / pageCfg.value.rows
  // console.log(width, height,colWidth.value,rowHeight.value)
}

// 引入组件
const loadComponent = (path) => {
  return defineAsyncComponent(() =>
    import(path)
  )
}

</script>

<style lang="scss" scoped>
.template-menu-wrapper{
  // padding:15px;
  overflow-y: auto;
  .template-menu{
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    .template-menu-comp{
      background-color: #fff;
      border-radius: 8px;
    }
  }
}
::-webkit-scrollbar {
  display: none;
}
</style>