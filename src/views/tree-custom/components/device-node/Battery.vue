<template>
  <div class="rem-ignore-battery-box">
    <div class="battery-item">
      <div class="battery-percent">
        <div class="percent" :style="{height: `${percent}%`}"
             :class="{
              'full': percent === 100,
              'empty': status === null || status == -1
             }"
        >
          <div class="text-box">
            <div class="text" :style="{top: percent < 20 ? '-15px' : '0'}">{{ percent === null ? `无数据` : `${percent}%` }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  percent: {
    type: [Number, String],
    default: null,
  },
  status: {
    type: Number,
  },
})
</script>

<style scoped lang="scss">
.rem-ignore-battery-box {
  width: 56px;
  height: 90px;
  .battery-item {
    position: relative;
    width: 56px;
    height: 90px;
    padding: 8px 3px 4px 3px;
    box-sizing: border-box;
    background: url('@/assets/images/tree-custom/battery.svg') no-repeat;
    .battery-percent{
      position: relative;
      width: 100%;
      height: 100%;
      &:hover{
        opacity: 0.7;
      }
      .percent{
        position: absolute;
        bottom: 0;
        left: 0;
        // z-index: 9;
        width: 100%;
        background: linear-gradient(90deg, #21BB97 0%, #6ECB88 100%);
        border-radius: 0 0 4px 4px;
        color: #353D5C;
        &.full{
          border-radius: 4px;
          // line-height: 78px;
        }
        &.empty{
          height: 100%;
          background: #DBDEE3;
          color: #969DAF;
          border-radius: 4px;
          line-height: 78px;
        }
        .text-box{
          width: 100%;
          height: 100%;
          position: relative;
          .text{
            position: absolute;
            left: 0;
            width: 100%;
            font-size: 12px;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
