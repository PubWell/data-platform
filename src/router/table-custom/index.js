import { Menu, CollectionTag, Grid } from '@element-plus/icons-vue'

const Layout = () => import('@/layout/index.vue')

export default {
  name: 'customTable',
  path: '/custom-table',
  redirect: '/custom-table/index',
  component: Layout,
  meta: {
    order: 6,
    title: '自定义表格',
    icon: Menu
  },
  children: [
    {
      name: 'customTableIndex',
      path: '/custom-table/index',
      component: () => import('@/views/table-custom/index.vue'),
      meta: {
        title: '自定义表格',
        order: 1,
        icon: Menu
      },
    },
  ]
}