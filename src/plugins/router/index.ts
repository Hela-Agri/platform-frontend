import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'active',
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (to.matched.some(record => record.meta.hasPerm)) {

      if (localStorage.getItem('access_token')){
        next()
      }
      else
      {
        next('/login')
      }
    }
  }
  else {
    next()
  }
})
export default function (app: App) {
  app.use(router)
}

export { router }
