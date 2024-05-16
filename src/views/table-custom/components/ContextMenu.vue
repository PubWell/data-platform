<template>
  <div
    id="context-menu-wrapper"
    class="contextmenu-container list-box"
    :style="{ left: left + 'px', top: top + 'px' }"
  >
    <div class="item" @click="exec('INSERT_ABOVE')">
      <span class="name">上方插入</span>
    </div>
    <div class="item" @click="exec('INSERT_BELOW')">
      <span class="name">下方插入</span>
    </div>
    <div class="item" @click="exec('DELETE')">
      <span class="name">删除</span>
    </div>
    <div class="item" @click="exec('MERGE')" v-if="isMerge">
      <span class="name">合并</span>
    </div>
    <div class="item" @click="exec('UNMERGE')" v-if="isUnmerge">
      <span class="name">撤销合并</span>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  selection: {
    type: Array
  },
  left: {
    type: Number,
    default: 0
  },
  top: {
    type: Number,
    default: 0
  }
})
const emits = defineEmits(['exec-command'])

const isUnmerge = computed(() => {
  return props.selection.every((item) => item.cfg.mergeStatus)
})

const isMerge = computed(() => {
  return props.selection.length > 1 && props.selection.some((item) => !item.cfg.mergeStatus)
})

onMounted(() => {
  console.log(props.selection)
})
const exec = (e) => {
  emits('exec-command', e)
}

const getRect = () => {
  let dom = document.getElementById('context-menu-wrapper')
  let rect = dom.getBoundingClientRect()
  return rect
}

defineExpose({
  getRect
})
</script>

<style lang="scss" scoped>
.list-box {
  width: 250px;
  background: #fff;
  box-shadow: 0 4px 12px 0 hsla(0, 0%, 69%, 0.5);
  border-radius: 4px;
  padding-top: 16px;
  padding-bottom: 16px;
}
.contextmenu-container {
  position: fixed;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #1a1a1a;
  .item {
    position: relative;
    height: 28px;
    line-height: 28px;
    padding: 0 16px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;

    &:hover {
      background: #f5f5f5;
    }

    &.disabled {
      color: grey;
      cursor: not-allowed;
      pointer-events: none;

      &:hover {
        background: #fff;
      }
    }

    .name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .desc {
      color: #999;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .subItems {
      position: absolute;
      left: 100%;
      top: 0;
      visibility: hidden;
    }
  }
}
</style>