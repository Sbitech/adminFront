import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/login/index.vue'
import JudgeLayout from '../layouts/JudgeLayout.vue'
import DashboardView from '../views/dashboard/index.vue'
import DisputeView from '../views/dispute/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/',
      component: JudgeLayout,
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: DashboardView
        },
        {
          path: 'dispute',
          name: 'dispute',
          component: DisputeView
        },
        {
          path: 'replay',
          name: 'replay',
          component: () => import('../views/replay/index.vue')
        },
        {
          path: 'ai-score',
          name: 'ai-score',
          component: () => import('../views/ai-score/index.vue')
        },
        {
          path: 'manual-score',
          name: 'manual-score',
          component: () => import('../views/manual-score/index.vue')
        },
        {
          path: 'backup',
          name: 'backup',
          component: () => import('../views/backup/index.vue')
        },
        {
          path: 'report',
          name: 'report',
          component: () => import('../views/report/index.vue')
        },
        {
          path: 'history',
          name: 'history',
          component: () => import('../views/history/index.vue')
        }
      ]
    }
  ]
})

export default router