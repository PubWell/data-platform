const moveableCfg = {
  // 【 draggable 】
  draggable: true,
  throttleDrag: 1, // 步长，默认 0
  throttleDragRotate: 0, // 拖拽角度，默认 0 不限制
  startDragRotate: 0, // 初始拖拽角度
  edgeDraggable: false, // 是否通过拖动边缘线移动，默认 false
  // 【 resizable 】
  resizable: true,
  throttleResize: 1,
  // 【 scalable 】
  scalable: true,
  throttleScale: 0,
  // 【 rotatable 】
  // rotatable: true,
  // throttleRotate: 0,
  // 【 snappable 】
  // snappable: true, // 是否自动吸附，默认 false
  // snapCenter: true, // 中心吸附
  snapHorizontal: true, // 使用水平参考线
  horizontalGuidelines: [100, 400, 700],
  snapVertical: true, // 使用垂直参考线
  verticalGuidelines: [100, 400, 700],
  bounds: { // 限制外框范围
    left: 0,
    right: 700,
    top: 0,
    bottom: 700
  },
  // innerBounds: [], // 限制内框范围
  snapElement: true,
  snapGap: true,
  snapThreshold: 5, // default 5
  snapDigit: 50,
  isDisplaySnapDigit: true,
  snapDistFormat: (distance) => {return `距离: $ {distance}`},
  // 【 pinchable 】
  // pinchable: true, // 移动设备 - 双指 ["draggable", "resizable", "scalable", "rotatable"] 
  // 【 groupable 】
  // groupable: true,
  // target: [],
  // 【 ... 】
  // 【 others 】
  keepRatio: true, // 保持比例
  className: 'test-control', // 指定控制箱 class
  origin: false, // 原点控制箱是否可见
  zoom: 1, // 控制箱手柄大小
  padding: { // 设置目标边距，以增加可拖动区域
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  dragArea: false, // 将事件添加到可移动区域，而不是将目标添加到 stopPropagation 的目标 (默认值：false，组中为true)
  // container: '',
  edge: true
}

export const seriesTypeEnum = (type) => {
  switch (type) {
    case 1:
      return 'line'
    case 2:
      return 'bar'
    default:
      return 'line'
  }
}

export const colorTypeEnum = (type) => {
  switch (type) {
    case 1:
      return ['#0FB86E', '#0080FF']
    case 2:
      return ['#ADEABA', '#8DD4FC']
    default:
      return ['#0FB86E', '#0080FF']
  }
}