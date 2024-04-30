<template>
  <div class="comp-lib-wrapper wh-100">
    <div class="comp-lib wh-100">
      
      <el-input
        v-model="keyword"
        class="input-w"
        placeholder="搜索"
        :prefix-icon="Search"
      />

      <div class="comp-lib-list flex flex-jc-sb flex-wrap wh-100">

        <div class="item" v-for="item in compLib" :key="item.path" :class="{'active': activeComp == item.path}" @click="onCompClick(item)">
          <component :is="item.comp" :interaction="false"/>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance, defineAsyncComponent } from 'vue'
import { Search } from '@element-plus/icons-vue'

const emits = defineEmits(['change'])
const activeComp = ref()
const compLib = ref([])
const keyword = ref()

onMounted(() => {
  const comps = import.meta.glob('@/views/lib/chart/**/index.vue', { eager: true })
  Object.keys(comps).forEach((key) => {
    let comp = shallowRef(loadComponent(key))
    compLib.value.push({path: key, comp: comp})
  })
  onCompClick(compLib.value[0])
})

// 引入组件
const loadComponent = (path) => {
  return defineAsyncComponent(() =>
    import(path)
  )
}

const onCompClick = (e) => {
  activeComp.value = e.path
  emits('change',e.path)
}
</script>

<style lang="scss" scoped>
.comp-lib-wrapper{
  padding: 15px;
  .comp-lib{
    .input-w{
      margin: 10px;
      width: 250px;
      // height: 40px;
    }
    .comp-lib-list{
      border-top: 1px solid #efefef;
      .item{
        width: 30%;
        height: 25%;
        min-width: 330px;
        min-height: 300px;
        margin: 10px;
        border-radius: 10px;
        box-shadow: 0px 0px 3px 2px rgba(0, 0, 0, 0.03);
        cursor: pointer;
        &.active{
          border: 1px solid #aad0f7;
          box-shadow: 0px 0px 5px 5px #c4def8;
        }
      }
    }
  }
}
</style>