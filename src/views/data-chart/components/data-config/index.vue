
<template>
  <div class="data-config-wrapper wh-100">
    <DataCollection @dragEmit="onDragEmit"/>
    <!-- <ChartSetting :info="yAxisItem" /> -->
  </div>
</template>

<script setup>
import DataCollection from './DataCollection.vue'
import ChartSetting from './ChartSetting.vue'

const yAxisItem = ref()

const onDragEmit = (e) => {
  yAxisItem.value = e
}
</script>

<style lang="scss" scoped>
.data-config-wrapper{
  border-right: 1px solid #dbdbdb;
  // border-radius: 8px;
  // box-shadow: 0px 0px 3px 2px rgba(245, 247, 250, 0.9);
  overflow: auto;
  background-color: #fff
}
</style>
