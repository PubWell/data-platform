<template>
  <div
    id="context-menu-wrapper"
    class="contextmenuContainer listBox"
    :style="{ left: left + 'px', top: top + 'px' }"
    :class="{ isDark: isDark }"
  >
    <template v-if="type === 'node'">
      <div
        class="item"
        @click="exec('INSERT_NODE', insertNodeBtnDisabled, false)"
        :class="{ disabled: insertNodeBtnDisabled }"
      >
        <span class="name">插入同级节点</span>
        <span class="desc">Enter</span>
      </div>
      <div
        class="item"
        @click="exec('INSERT_CHILD_NODE', false, false)"
        :class="{ disabled: isGeneralization }"
      >
        <span class="name">插入子级节点</span>
        <span class="desc">Tab</span>
      </div>
      <div
        class="item"
        @click="exec('INSERT_PARENT_NODE', false, false)"
        :class="{ disabled: insertNodeBtnDisabled }"
      >
        <span class="name">插入父节点</span>
        <span class="desc">Shift + Tab</span>
      </div>
      <!-- <div
        class="item"
        @click="exec('ADD_GENERALIZATION')"
        :class="{ disabled: insertNodeBtnDisabled }"
      >
        <span class="name">插入概要</span>
        <span class="desc">Ctrl + G</span>
      </div> -->
      <div
        class="item"
        @click="exec('UP_NODE')"
        :class="{ disabled: upNodeBtnDisabled }"
      >
        <span class="name">上移节点</span>
        <span class="desc">Ctrl + ↑</span>
      </div>
      <div
        class="item"
        @click="exec('DOWN_NODE')"
        :class="{ disabled: downNodeBtnDisabled }"
      >
        <span class="name">下移节点</span>
        <span class="desc">Ctrl + ↓</span>
      </div>
      <div class="item danger" @click="exec('REMOVE_NODE')">
        <span class="name">删除节点</span>
        <span class="desc">Delete</span>
      </div>
      <div class="item danger" @click="exec('REMOVE_CURRENT_NODE')">
        <span class="name">仅删除当前节点</span>
        <span class="desc">Shift + Backspace</span>
      </div>
      <div
        class="item"
        @click="exec('COPY_NODE')"
        :class="{ disabled: isGeneralization }"
      >
        <span class="name">复制节点</span>
        <span class="desc">Ctrl + C</span>
      </div>
      <div
        class="item"
        @click="exec('CUT_NODE')"
        :class="{ disabled: isGeneralization }"
      >
        <span class="name">剪切节点</span>
        <span class="desc">Ctrl + X</span>
      </div>
      <div class="item" @click="exec('PASTE_NODE')">
        <span class="name">粘贴节点</span>
        <span class="desc">Ctrl + V</span>
      </div>
      <!-- <div class="item" @click="exec('REMOVE_HYPERLINK')" v-if="hasHyperlink">
        <span class="name">移除超链接</span>
      </div> -->
      <!-- <div class="item" @click="exec('REMOVE_NOTE')" v-if="hasNote">
        <span class="name">移除备注</span>
      </div> -->
      <!-- <div class="item" @click="exec('REMOVE_CUSTOM_STYLES')">
        <span class="name">一键去除自定义样式</span>
      </div> -->
      <div class="item" @click="exec('EXPORT_CUR_NODE_TO_PNG')">
        <span class="name">导出该节点为图片</span>
      </div>
    </template>
    <template v-if="type === 'svg'">
      <div class="item" @click="exec('RETURN_CENTER')">
        <span class="name">回到根节点</span>
        <span class="desc">Ctrl + Enter</span>
      </div>
      <div class="item" @click="exec('EXPAND_ALL')">
        <span class="name">展开所有</span>
      </div>
      <div class="item" @click="exec('UNEXPAND_ALL')">
        <span class="name">收起所有</span>
      </div>
      <!-- <div class="item">
        <span class="name">展开到</span>
        <div class="subItems listBox" :class="{ isDark: isDark }">
          <div
            class="item"
            v-for="(item, index) in expandList"
            :key="item"
            @click="exec('UNEXPAND_TO_LEVEL', false, index + 1)"
          >
            {{ item }}
          </div>
        </div>
      </div> -->
      <div class="item" @click="exec('RESET_LAYOUT')">
        <span class="name">一键整理布局</span>
        <span class="desc">Ctrl + L</span>
      </div>
      <div class="item" @click="exec('FIT_CANVAS')">
        <span class="name">适应画布</span>
        <span class="desc">Ctrl + i</span>
      </div>
      <!-- <div class="item" @click="exec('TOGGLE_ZEN_MODE')">
        <span class="name">禅模式</span>
        {{ isZenMode ? '√' : '' }}
      </div>
      <div class="item" @click="exec('REMOVE_ALL_NODE_CUSTOM_STYLES')">
        <span class="name">一键去除所有节点自定义样式</span>
      </div> -->
    </template>
  </div>
</template>

<script setup>

const props = defineProps({
  node: {
    type: Object
  },
  type: {
    type: String,
  },
  left: {
    type: Number,
    default: 0
  },
  top: {
    type: Number,
    default: 0
  },
  scaleX: {
    type: Number,
    default: 1
  },
  scaleY: {
    type: Number,
    default: 1
  },
})
const emits = defineEmits(['exec-command'])

const isZenMode = computed(() => {
  return false
})

const isDark = computed(() => {
  return false
})

const expandList = computed(() => {
  return ['一级主题', '二级主题', '三级主题']
})

const insertNodeBtnDisabled = computed(() => {
  return !props.node || props.node?.isRoot || props.node?.isGeneralization
})
const upNodeBtnDisabled = computed(() => {
  if (!props.node || props.node?.isRoot || props.node?.isGeneralization) {
    return true
  }
  let isFirst =
    props.node.parent.children.findIndex(item => {
      return item === props.node
    }) === 0
  return isFirst
})

const downNodeBtnDisabled = computed(() => {
  if (!props.node || props.node?.isRoot || props.node?.isGeneralization) {
    return true
  }
  let children = props.node.parent.children
  let isLast =
    children.findIndex(item => {
      return item === props.node
    }) ===
    children.length - 1
  return isLast
})

const isGeneralization = computed(() => {
  return props.node?.isGeneralization
})

const hasHyperlink = computed(() => {
  return !!props.node.getData('hyperlink')
})

const hasNote = computed(() => {
  return !!props.node.getData('note')
})

onMounted(() => {
})

const exec = (e, ...args) => {
  emits('exec-command', e, ...args)
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
.listBox {
  width: 250px;
  background: #fff;
  box-shadow: 0 4px 12px 0 hsla(0, 0%, 69%, 0.5);
  border-radius: 4px;
  padding-top: 16px;
  padding-bottom: 16px;

  &.isDark {
    background: #363b3f;
  }
}
.contextmenuContainer {
  position: fixed;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #1a1a1a;

  &.isDark {
    color: #fff;

    .item {
      &:hover {
        background: hsla(0, 0%, 100%, 0.05);
      }
    }
  }

  .item {
    position: relative;
    height: 28px;
    line-height: 28px;
    padding: 0 16px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;

    &.danger {
      color: #f56c6c;
    }

    &:hover {
      background: #f5f5f5;

      .subItems {
        visibility: visible;
      }
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