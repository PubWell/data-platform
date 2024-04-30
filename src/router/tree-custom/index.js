import { ScaleToOriginal, CollectionTag, Grid } from '@element-plus/icons-vue'

const Layout = () => import('@/layout/index.vue')

export default {
  name: 'customTree',
  path: '/custom-tree',
  redirect: '/custom-tree/index',
  component: Layout,
  meta: {
    order: 5,
    title: '自定义绘图',
    icon: Grid
  },
  children: [
    {
      name: 'customTreeIndex',
      path: '/custom-tree/index',
      component: () => import('@/views/tree-custom/index.vue'),
      meta: {
        title: '自定义绘图',
        order: 1,
        icon: Grid
      },
    },
  ]
}