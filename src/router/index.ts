import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'

Vue.use(VueRouter)

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'Home',
    redirect: '/login',
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../pages/Home.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/login/Index.vue'),
  },
  {
    path: '/admin/user',
    name: 'admin-user',
    component: () => import('../pages/admin/user/index.vue'),
  },
]


const router = new VueRouter({
  mode: 'history',
  // @ts-ignore
  base: process.env.BASE_URL,
  routes,
})

export default router
