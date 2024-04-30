<template>
  <div class="v-page-wrapper wh-100 flex-column" id="v-page">
    <div v-if="rows && cols" class="v-page" :style="{width: pageW + 'px', height: pageH + 'px'}">

      <div class="v-page-comp-list"
          :style="{
            'top':pageBgTop + 'px',
            'grid-gap': `${gap}px`,
            'grid-template-columns': `repeat(${cols},${itemW}px)`,
            'grid-template-rows': `repeat(${pageRows}, ${itemH}px)`
          }"
      >
        <div class="v-page-comp" v-for="index of itemNum " :key="index"></div>
      </div>
      <div class="v-page-grid-layout wh-100">
        <GridLayout v-if="type == 'grid'"
          :row-height="itemH"
          :col-width="itemW"
          @layout-change="onLayoutChange"
          @layout-add="onLayoutAdd"
        />
        <FlexLayout v-else :row-height="itemH" :col-width="itemW" @layout-change="onLayoutChange"/>
      </div>
      

      <MovableLayout />
    </div>
  </div>
</template>

<script setup>
import GridLayout from './grid-layout/index.vue'
import FlexLayout from './flex-layout/index.vue'
import MovableLayout from './movable-layout/index.vue'
import { customLayoutStore } from '@/stores'

const props = defineProps({
  type: {
    type: String,
    default: 'grid'
  }
})

const store = customLayoutStore()
const cols = computed(() => {
  return store.cols
})
const rows = computed(() => {
  return store.rows
})
const gap = computed(() => {
  return store.gap
})
const itemW = ref()
const itemH = ref()
const itemNum = ref()
const pageW = ref()
const pageH = ref()
const pageBgTop = ref()
const pageRows = ref()

let observer = null

onMounted(() => {
  let target = props.type == 'grid' ? '.v-page-grid-layout' : '.flex-layout-wrapper'
  let dom = document.querySelector(target)

  // observer = new ResizeObserver((ele) => {
  //   console.log('grid layout resize>>>>>>>>>>>>>>>>>>')
  //   let rows = (dom.scrollHeight - gap.value) / (itemH.value + gap.value)
  //   pageRows.value = Math.ceil(rows)
  //   itemNum.value = cols.value * pageRows.value
  //   dom.scrollTop = dom.scrollHeight - pageH.value
  //   pageBgTop.value = gap.value-dom.scrollTop
  // })
  setTimeout(() => {
    // let rows = (dom.scrollHeight - gap.value) / (itemH.value + gap.value)
    // pageRows.value = Math.ceil(rows)
    // itemNum.value = cols.value * pageRows.value
    // pageBgTop.value = gap.value

    dom.addEventListener('scroll', () => {
      pageBgTop.value = gap.value-dom.scrollTop
    })
    // observer.observe(dom)
    updatePage()
  }, 300)

  window.addEventListener('resize', updatePage)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updatePage)
  // if (observer) {
  //   let dom = document.querySelector('.v-page-grid-layout')
  //   observer.unobserve(dom)
  //   observer = null
  // }
})

watch(
  () => [rows.value, cols.value, store.templateId],
  (val) => {
    nextTick(() => {
      updatePage()
    })
  }, {deep: true}
)

const onLayoutAdd = () => {
  onLayoutChange()
  let target = props.type == 'grid' ? '.v-page-grid-layout' : '.flex-layout-wrapper'
  let dom = document.querySelector(target)
  nextTick(() => {
    dom.scrollTo({
      top: dom.scrollHeight - pageH.value,
      smooth: true
    })
    pageBgTop.value = gap.value-dom.scrollTop
  })
}

const onLayoutChange = () => {
  let target = props.type == 'grid' ? '.v-page-grid-layout' : '.flex-layout-wrapper'
  let dom = document.querySelector(target)
  nextTick(() => {
    let rows = (dom.scrollHeight + gap.value) / (itemH.value + gap.value)
    pageRows.value = Math.ceil(rows)
    itemNum.value = cols.value * pageRows.value
    // console.log(pageBgTop.value, dom.scrollHeight, pageH.value)
  })
}

const updateLayout = () => {
  itemW.value = (pageW.value - 2 * gap.value - gap.value * (cols.value - 1)) / cols.value
  itemH.value = (pageH.value - 2 * gap.value - gap.value * (rows.value - 1)) / rows.value
  pageRows.value = pageRows.value ? pageRows.value : rows.value
  // console.log('update layout>>>>>>>>>>>>>>>>',cols.value, pageRows.value, itemW.value, itemH.value)
  itemNum.value = cols.value * pageRows.value
  pageBgTop.value = pageBgTop.value ? pageBgTop.value : gap.value
}

const updatePage = () => {
  const dom = document.getElementById('v-page')
  let {width, height} = dom.getBoundingClientRect()
  let key = Math.min(height / 1080, width / 1920)
  pageW.value = 1920 * key
  pageH.value = 1080 * key
  if(rows.value && cols.value){
    updateLayout()
  }
}
</script>

<style lang="scss" scoped>
.v-page-wrapper{
  align-items: center;
  justify-content: center;
  .v-page{
    position: relative;
    overflow: hidden;
    .v-page-comp-list{
      position: absolute;
      left: 10px;
      z-index: 2;
      display: grid;
      overflow: auto;
      // grid-gap: 10px;
      // display: flex;
      // flex-wrap: wrap;
      // justify-content: space-between;
      .v-page-comp{
        background-color: #f6fafd;
        // border: 2px dashed #ffffff;
      }
    }
    .v-page-grid-layout{
      position: absolute;
      left: 0;
      top: 0;
      z-index: 3;
      overflow: auto;
    }
  }
}
::-webkit-scrollbar {
  display: none;
}
</style>