import { ScaleToOriginal, CollectionTag } from '@element-plus/icons-vue'

const Layout = () => import('@/layout/index.vue')

export default {
  name: 'templateMenu',
  path: '/template-menu',
  redirect: '/template-menu/index',
  component: Layout,
  meta: {
    order: 5,
    title: '测试菜单',
    icon: ScaleToOriginal
  },
  children: [
    {
      name: 'templateMenuIndex',
      path: '/template-menu/index',
      component: () => import('@/views/template-menu/index.vue'),
      meta: {
        title: '测试菜单',
        order: 1,
        icon: ScaleToOriginal
      },
    },
  ]
}