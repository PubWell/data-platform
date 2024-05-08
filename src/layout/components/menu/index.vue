<template>
  <div class="menu-wrapper">
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      :default-active="'/custom-layout/index'"
      router
    >
      <!-- <el-sub-menu index="1">
        <template #title>
          <el-icon><location /></el-icon>
          <span>Navigator One</span>
        </template>
        <el-menu-item-group>
          <template #title><span>Group One</span></template>
          <el-menu-item index="1-1">item one</el-menu-item>
          <el-menu-item index="1-2">item two</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="Group Two">
          <el-menu-item index="1-3">item three</el-menu-item>
        </el-menu-item-group>
        <el-sub-menu index="1-4">
          <template #title><span>item four</span></template>
          <el-menu-item index="1-4-1">item one</el-menu-item>
        </el-sub-menu>
      </el-sub-menu> -->

      <!-- <el-menu-item v-for="(item, index) in menus" :key="item.name">
        <el-icon><document /></el-icon>
        <template #title>{{item.meta.title}}</template>
      </el-menu-item> -->
      
      <template v-for="route in menus" :key="route.path">
        <el-sub-menu v-if="route.children && route.children.length > 0" :index="route.path">
          <template #title>
            <!-- <el-icon><document /></el-icon> -->
            <el-icon><component :is="route.meta.icon"></component></el-icon>
            <span>{{ route.meta.title }}</span>
          </template>
          <template v-for="child in route.children" :key="child.path">
            <el-menu-item :index="child.path">
              <!-- <el-icon><document /></el-icon> -->
              <el-icon><component :is="child.meta.icon"></component></el-icon>
              <template #title>
                {{ child.meta.title }}
              </template>
            </el-menu-item>
          </template>
        </el-sub-menu>
        
        <el-menu-item v-else :index="route.path">
          <!-- <el-icon><document /></el-icon> -->
          <el-icon><component :is="child.meta.icon"></component></el-icon>
          <template #title>
            {{ route.meta.title }}
          </template>
        </el-menu-item>
      </template>

    </el-menu>

    <!-- <div class="collapse-toggle" @click="toggleMenu">
      <Expand v-if="isCollapse" />
      <Fold v-if="!isCollapse" />
    </div> -->
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  Document,
  Menu,
  Location,
  Setting,
  Expand,
  Fold,
} from '@element-plus/icons-vue'
import asyncRoutes from '@/router'
import { useRouter } from 'vue-router'

const isCollapse = ref(true)
const router = useRouter()
const menus = shallowRef()
onMounted(() => {
  let routes = router.getRoutes()
  menus.value = asyncRoutes.sort((a,b) => {
    return a.meta.order - b.meta.order
  })
  menus.value.forEach((item) => {
    item.meta.icon = markRaw(item.meta.icon)
    if(item.children){
      item.children.forEach((child) => {
        child.meta.icon = markRaw(child.meta.icon)
      })
    }
  })
})

const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}

const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}

const toggleMenu = () => {
  isCollapse.value = !isCollapse.value
}
</script>

<style lang="scss" scoped>
.menu-wrapper{
  width: 50px;
  height: 100%;
  position: relative;
  .collapse-toggle{
    position: absolute;
    bottom: 10px;
    left: 10px;
    width: 25px;
    height: 25px;
  }
}
.el-menu-vertical-demo.el-menu{
  border-right: none
}
.el-menu-vertical-demo{
  width: 100%;
  height: 100%;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}
.el-menu-item{
  padding: 0;
  height: 56px;
}
:deep(.el-menu-item .el-menu-tooltip__trigger){
  padding: 0;
  display: flex;
  justify-content: center;
}
:deep(.el-menu--collapse>.el-menu-item [class^=el-icon]){
  width: 24px;
}
</style>
