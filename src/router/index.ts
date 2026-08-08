import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import DayConception from '@/views/DayConception/dayConception.vue';
import ChildBirthday from '@/views/ChildBirthday/childBirthday.vue';
import maleCalendar from '@/views/MaleCalendar/maleCalendar.vue';
import femaleCalendar from '@/views/FemaleCalendar/femaleCalendar.vue';
import LifeProgress from '@/views/LifeProgress/lifeProgress.vue';
import UserProfile from '@/views/UserProfile/userProfile.vue';
import AchievementsPage from '@/views/AchievementsPage/achievementsPage.vue';
import DonationsPage from '@/views/DonationsPage/donationsPage.vue';

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
    path: '/maleCalendar',
    name: 'maleCalendar',
    component: maleCalendar
  },
  {
    path: '/femaleCalendar',
    name: 'femaleCalendar',
    component: femaleCalendar
  },
  {
    path: '/lifeProgress',
    name: 'LifeProgress',
    component: LifeProgress
  },
  {
    path: '/userProfile',
    name: 'UserProfile',
    component: UserProfile
  },
  {
    path: '/achievementsPage',
    name: 'AchievementsPage',
    component: AchievementsPage
  },
  {
    path: '/donationsPage',
    name: 'DonationsPage',
    component: DonationsPage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
