<template>
  <div class="wh-100">
    <div id="canvas"></div>
  </div>
</template>

<script setup>
import { SVG, Box } from '@svgdotjs/svg.js'
import '@svgdotjs/svg.draggable.js'

let draw = null
let rect = null
let constraints = null

onMounted(() => {
  console.log(new Box())
  draw = SVG()
    .addTo('#canvas')
    .size(400, 400)
  rect = draw.rect(100, 100)
  rect.draggable()
  constraints = new Box(100, 100, 400, 400)

  // bind
  rect.on('dragstart.namespace', function (event) {
    // event.detail.event hold the given data explained below
    // this == rect
  })

  rect.on('dragmove.namespace', e => {
    const { handler, box } = e.detail
    e.preventDefault()

    handler.move(box.x - (box.x % 50), box.y - (box.y % 50))
  })

  // rect.on('dragmove.namespace', e => {
  //   const { handler, box } = e.detail
  //   e.preventDefault()

  //   let { x, y } = box

  //   // In case your dragged element is a nested element,
  //   // you are better off using the rbox() instead of bbox()

  //   if (x < constraints.x) {
  //     x = constraints.x
  //   }

  //   if (y < constraints.y) {
  //     y = constraints.y
  //   }

  //   if (box.x2 > constraints.x2) {
  //     x = constraints.x2 - box.w
  //   }

  //   if (box.y2 > constraints.y2) {
  //     y = constraints.y2 - box.h
  //   }

  //   handler.move(x - (x % 50), y - (y % 50))
  // })
})

onUnmounted(() => {
  // unbind
  rect.off('dragstart.namespace')
})
</script>

<style lang="scss" scoped>

</style>