import { Coin } from '@element-plus/icons-vue'
const Layout = () => import('@/layout/index.vue')

export default {
  name: 'dataChart',
  path: '/data-chart',
  redirect: '/data-chart/index',
  component: Layout,
  meta: {
    order: 1,
    title: '自助分析',
    icon: Coin
  },
  children: [
    {
      name: 'dataChartIndex',
      path: '/data-chart/index',
      component: () => import('@/views/data-chart/index.vue'),
      meta: {
        title: '自助分析',
        order: 1,
        icon: Coin
      },
    },
    {
      name: 'dataChartDemo',
      path: '/data-chart/demo',
      component: () => import('@/views/data-chart/Flexible.vue'),
      meta: {
        title: 'Test',
        order: 1,
        icon: Coin
      },
    }
  ]
}