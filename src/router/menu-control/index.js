import { ScaleToOriginal, CollectionTag } from '@element-plus/icons-vue'

const Layout = () => import('@/layout/index.vue')

export default {
  name: 'menuControl',
  path: '/menu-control',
  redirect: '/menu-control/index',
  component: Layout,
  meta: {
    order: 3,
    title: '自定义菜单',
    icon: ScaleToOriginal
  },
  children: [
    {
      name: 'menuControlIndex',
      path: '/menu-control/index',
      component: () => import('@/views/menu-control/index.vue'),
      meta: {
        title: '自定义菜单',
        order: 1,
        icon: ScaleToOriginal
      },
    },
  ]
}