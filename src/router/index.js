import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/login/index.vue'
import JudgeLayout from '../layouts/JudgeLayout.vue'
import HomeView from '../views/home/index.vue'
import DisputeView from '../views/dispute/index.vue'

// 检查是否已登录（基于refereeInfo）
const isAuthenticated = () => {
  try {
    const refereeInfo = localStorage.getItem('refereeInfo')
    return !!refereeInfo // 如果有refereeInfo则认为已登录
  } catch (error) {
    return false
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
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
          path: 'home',
          name: 'home',
          component: HomeView
        },
        {
          path: 'dispute',
          name: 'dispute',
          component: DisputeView
        },
        {
          path: 'dispute/detail/:id',
          name: 'dispute-detail',
          component: () => import('../views/dispute/detail.vue')
        },
        {
          path: 'replay',
          name: 'replay',
          component: () => import('../views/replay/index.vue')
        },
        // AI评分和人工评分功能已整合到实时回放页面
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
        },
        {
          path: 'history/detail/:id',
          name: 'history-detail',
          component: () => import('../views/history/detail.vue')
        },
        {
          path: 'notification',
          name: 'notification',
          component: () => import('../views/notification/index.vue')
        },
        {
          path: 'permission',
          name: 'permission',
          component: () => import('../views/permission/index.vue')
        },
        {
          path: 'scoring-rules',
          name: 'scoring-rules',
          component: () => import('../views/scoring-rules/index.vue')
        },
        {
          path: 'rule-library',
          name: 'rule-library',
          component: () => import('../views/rule-library/index.vue')
        },
        {
          path: 'result-display',
          name: 'result-display',
          component: () => import('../views/result-display/index.vue')
        },
        {
          path: 'final-score-display',
          name: 'final-score-display',
          component: () => import('../views/final-score-display/index.vue')
        }
      ]
    }
  ]
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 如果访问的是登录页，不做检查
  if (to.path === '/login') {
    next()
    return
  }
  
  // 检查是否已登录
  if (!isAuthenticated()) {
    // 未登录，跳转到登录页
    next('/login')
  } else {
    // 已登录，正常访问
    next()
  }
})

export default router