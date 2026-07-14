import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import DayConception from '@/views/DayConception/dayConception.vue';
import ChildBirthday from '@/views/ChildBirthday/childBirthday.vue';
import MensCalendar from '@/views/MensCalendar/mensCalendar.vue';
import WomensCalendar from '@/views/WomensCalendar/womensCalendar.vue';
import LifeProgress from '@/views/LifeProgress/lifeProgress.vue';

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
  },
  {
    path: '/mensCalendar',
    name: 'MensCalendar',
    component: MensCalendar
  },
  {
    path: '/womensCalendar',
    name: 'WomensCalendar',
    component: WomensCalendar
  },
  {
    path: '/lifeProgress',
    name: 'LifeProgress',
    component: LifeProgress
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
