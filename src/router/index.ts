import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import DayConception from '@/views/DayConception/dayConception.vue';
import ChildBirthday from '@/views/ChildBirthday/childBirthday.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/dayConception',
    name: 'DayConception',
    component: DayConception
  },
  {
    path: '/childBirthday',
    name: 'ChildBirthday',
    component: ChildBirthday
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
