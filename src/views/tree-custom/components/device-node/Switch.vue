<template>
  <div class="switch-wrapper">
    <!--开合状态： 1: 合/红色； 0：断开/绿色 -->
    <img v-if="status === 1" class="close" src="@/assets/images/tree-custom/close.svg">
    <!-- <img v-else-if="status === 0" class="open" src="@/assets/images/tree-custom/open.svg">
    <img v-else class="no-data" src="@/assets/images/tree-custom/battery-switch-no-data.svg"> -->
  </div>
</template>

<script setup>
const props = defineProps({
  status: {
    type: Number,
    default: 1,
  },
})
</script>

<style scoped lang="scss">
.switch-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  img{
    margin-top: -1px;
    &.close{
      width: 8px;
      height: 23px;
      margin-left: 2px;
    }
    &.open{
      width: 12px;
      height: 23px;
      margin-left: 7px;
    }
    &.no-data{
      width: 8px;
      height: 21px;
      margin-left: 2px;
    }
  }
}
</style>
