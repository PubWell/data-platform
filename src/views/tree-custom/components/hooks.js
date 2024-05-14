// https://github.com/wanglin2/mind-map/blob/main/simple-mind-map/src/themes/default.js
export const themeConfig = {
  lineDasharray: 5,
  lineColor: '#0CB86E',
  lineWidth: 2.5,
  lineAnimation: true,
  lineAnimationPositive: true,
  // lineRadius: 10, // 无效果
  showLineMarker: true,
  // 曲线（curve）【仅支持logicalStructure、mindMap、verticalTimeline三种结构】、直线（straight）、直连（direct）【仅支持logicalStructure、mindMap、organizationStructure、verticalTimeline四种结构】
  // 修改源码后，organizationStructure结构可实现curve
  lineStyle: 'straight',
  // 曲线连接时，根节点和其他节点的连接线样式保持统一，默认根节点为 ( 型，其他节点为 { 型，设为true后，都为 { 型。仅支持logicalStructure、mindMap两种结构
  rootLineKeepSameInCurve: true,
  root: {
    fillColor: "transparent",
    lineMarkerDir: 'mid',
  },
  second: {
    fillColor: "transparent",
    borderWidth: 0,
    marginX: 150,
    // marginY: 200,
    lineMarkerDir: 'mid',
    lineAnimation: true,
  },
  node: {
    marginX: 100,
    // marginY: 50,
    lineMarkerDir: 'mid',
    lineAnimation: true,
  }
}

export const data =  {
  "data": {
    "text": "电网",
    // "uid": "root",
    "type": "root"
  },
  "children": [
    // {
    //   "data": {
    //     "text": "1-1# PCS",
    //     "expand": true,
    //     // "uid": "1",
    //     "type": 'pcs',
    //     "status": {
    //       "color": "#eeeeee",
    //       "text": "offline"
    //     },
    //     "switch": 0
    //   },
    //   "children": [
    //     {
    //       "data": {
    //         "text": "1# 电池簇",
    //         // "uid": "4",
    //         "type": 'bcc',
    //       }
    //     },
    //     {
    //       "data": {
    //         "text": "2# 电池簇",
    //         // "uid": "5",
    //         "type": 'bcc',
    //       }
    //     },
    //     {
    //       "data": {
    //         "text": "3# 电池簇",
    //         // "uid": "6",
    //         "type": 'bcc',
    //       }
    //     },
    //     {
    //       "data": {
    //         "text": "4# 电池簇",
    //         // "uid": "7",
    //         "type": 'bcc',
    //       }
    //     },
    //     {
    //       "data": {
    //         "text": "1# 电池簇",
    //         // "uid": "4",
    //         "type": 'bcc',
    //       }
    //     },
    //     {
    //       "data": {
    //         "text": "2# 电池簇",
    //         // "uid": "5",
    //         "type": 'bcc',
    //       }
    //     },
    //     {
    //       "data": {
    //         "text": "3# 电池簇",
    //         // "uid": "6",
    //         "type": 'bcc',
    //       }
    //     },
    //     {
    //       "data": {
    //         "text": "4# 电池簇",
    //         // "uid": "7",
    //         "type": 'bcc',
    //       }
    //     }
    //   ]
    // },
    // {
    //   "data": {
    //     "text": "1-2# PCS",
    //     "expand": false,
    //     // "uid": "2",
    //     "type": 'pcs',
    //   },
    //   "children": [
        
    //     // {
    //     //   "data": {
    //     //     "text": "1# 电池簇",
    //     //     // "uid": "4",
    //     //     "type": 'bcc',
    //     //   }
    //     // },
    //     // {
    //     //   "data": {
    //     //     "text": "2# 电池簇",
    //     //     // "uid": "5",
    //     //     "type": 'bcc',
    //     //   }
    //     // },
    //     // {
    //     //   "data": {
    //     //     "text": "3# 电池簇",
    //     //     // "uid": "6",
    //     //     "type": 'bcc',
    //     //   }
    //     // },
    //     // {
    //     //   "data": {
    //     //     "text": "4# 电池簇",
    //     //     // "uid": "7",
    //     //     "type": 'bcc',
    //     //   }
    //     // },
    //     // {
    //     //   "data": {
    //     //     "text": "1# 电池簇",
    //     //     // "uid": "4",
    //     //     "type": 'bcc',
    //     //   }
    //     // },
    //     // {
    //     //   "data": {
    //     //     "text": "2# 电池簇",
    //     //     // "uid": "5",
    //     //     "type": 'bcc',
    //     //   }
    //     // },
    //     // {
    //     //   "data": {
    //     //     "text": "3# 电池簇",
    //     //     // "uid": "6",
    //     //     "type": 'bcc',
    //     //   }
    //     // },
    //     // {
    //     //   "data": {
    //     //     "text": "4# 电池簇",
    //     //     // "uid": "7",
    //     //     "type": 'bcc',
    //     //   }
    //     // }
    //   ]
    // },
    // {
    //   "data": {
    //     "text": "2-1# PCS",
    //     "expand": false,
    //     // "uid": "3",
    //     "type": 'pcs',
    //   },
    //   "children": [
        
    //     {
    //       "data": {
    //         "text": "1# 电池簇",
    //         // "uid": "4",
    //         "type": 'bcc',
    //       }
    //     },
    //     {
    //       "data": {
    //         "text": "2# 电池簇",
    //         // "uid": "5",
    //         "type": 'bcc',
    //       }
    //     },
    //     {
    //       "data": {
    //         "text": "3# 电池簇",
    //         // "uid": "6",
    //         "type": 'bcc',
    //       }
    //     },
    //     {
    //       "data": {
    //         "text": "4# 电池簇",
    //         // "uid": "7",
    //         "type": 'bcc',
    //       }
    //     },
    //     {
    //       "data": {
    //         "text": "1# 电池簇",
    //         // "uid": "4",
    //         "type": 'bcc',
    //       }
    //     },
    //     {
    //       "data": {
    //         "text": "2# 电池簇",
    //         // "uid": "5",
    //         "type": 'bcc',
    //       }
    //     },
    //     {
    //       "data": {
    //         "text": "3# 电池簇",
    //         // "uid": "6",
    //         "type": 'bcc',
    //       }
    //     },
    //     {
    //       "data": {
    //         "text": "4# 电池簇",
    //         // "uid": "7",
    //         "type": 'bcc',
    //       }
    //     }
    //   ]
    // },
    // {
    //   "data": {
    //     "text": "2-2# PCS",
    //     "expand": false,
    //     // "uid": "8",
    //     "type": 'pcs',
    //   },
    //   "children": [
    //     {
    //       "data": {
    //         "text": "1# 电池簇",
    //         // "uid": "4",
    //         "type": 'bcc',
    //       }
    //     },
    //     {
    //       "data": {
    //         "text": "2# 电池簇",
    //         // "uid": "5",
    //         "type": 'bcc',
    //       }
    //     },
    //     {
    //       "data": {
    //         "text": "3# 电池簇",
    //         // "uid": "6",
    //         "type": 'bcc',
    //       }
    //     },
    //     {
    //       "data": {
    //         "text": "4# 电池簇",
    //         // "uid": "7",
    //         "type": 'bcc',
    //       }
    //     },
    //     {
    //       "data": {
    //         "text": "1# 电池簇",
    //         // "uid": "4",
    //         "type": 'bcc',
    //       }
    //     },
    //     {
    //       "data": {
    //         "text": "2# 电池簇",
    //         // "uid": "5",
    //         "type": 'bcc',
    //       }
    //     },
    //     {
    //       "data": {
    //         "text": "3# 电池簇",
    //         // "uid": "6",
    //         "type": 'bcc',
    //       }
    //     },
    //     {
    //       "data": {
    //         "text": "4# 电池簇",
    //         // "uid": "7",
    //         "type": 'bcc',
    //       }
    //     }
    //   ]
    // }
  ]
}