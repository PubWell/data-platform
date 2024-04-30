import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      redirect: 'comp-lib/index',
    },
  ]
})

export async function setupRouter(app) {
  await initRoute()
  app.use(router)
}

const modules = import.meta.glob('@/router/**/index.js', { eager: true })
let asyncRoutes = []
Object.keys(modules).forEach((key) => {
  asyncRoutes.push(modules[key].default)
})

const initRoute = async () => {
  asyncRoutes.forEach((route) => {
    !router.hasRoute(route.name) && router.addRoute(route)
  })
}

// router.beforeEach(async (to, from, next) => {
//   await initRoute()
//   next()
// })

export default asyncRoutes
