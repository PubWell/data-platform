import { Memo } from '@element-plus/icons-vue'
const Layout = () => import('@/layout/index.vue')

export default {
  name: 'compLib',
  path: '/comp-lib',
  redirect: '/comp-lib/index',
  component: Layout,
  meta: {
    order: 2,
    title: '图表库',
    icon: Memo
  },
  children: [
    {
      name: 'compLibIndex',
      path: '/comp-lib/index',
      component: () => import('@/views/comp-lib/index.vue'),
      meta: {
        title: '图表库',
        order: 1,
        icon: Memo
      },
    }
  ]
}