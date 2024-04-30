import { ScaleToOriginal, CollectionTag, Grid } from '@element-plus/icons-vue'

const Layout = () => import('@/layout/index.vue')

export default {
  name: 'customLayout',
  path: '/custom-layout',
  redirect: '/custom-layout/index',
  component: Layout,
  meta: {
    order: 4,
    title: '自定义布局',
    icon: Grid
  },
  children: [
    {
      name: 'customLayoutIndex',
      path: '/custom-layout/index',
      component: () => import('@/views/custom-layout/index.vue'),
      meta: {
        title: '自定义布局',
        order: 1,
        icon: Grid
      },
    },
    // {
    //   name: 'customLayoutDemo',
    //   path: '/custom-layout/demo',
    //   component: () => import('@/views/custom-layout/Demo.vue'),
    //   meta: {
    //     title: 'Demo',
    //     order: 1,
    //     icon: CollectionTag
    //   },
    // }
  ]
}