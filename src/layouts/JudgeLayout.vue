<template>
  <v-app>

    <!-- 顶部工具栏 - 整合侧边栏功能 -->
    <v-app-bar 
      color="white" 
      elevation="2"
      :style="{ display: isFullscreen ? 'none' : 'flex' }"
      style="border-bottom: 1px solid #e2e8f0;"
    >
      <v-app-bar-title class="text-h6 font-weight-bold" style="color: #2c3e50;">
        武术裁判评分系统
      </v-app-bar-title>
      
      <v-spacer></v-spacer>
      
      <!-- 主导航菜单 -->
      <v-btn-group class="mr-4" variant="text">
        <v-btn to="/home" exact style="color: #2c3e50;">
          <v-icon left color="#42b883">mdi-home</v-icon>
          主页
        </v-btn>
        
        <!-- 回放处理下拉菜单 -->
        <v-menu offset-y>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" style="color: #2c3e50;">
              <v-icon left color="#42b883">mdi-video</v-icon>
              回放处理
              <v-icon right>mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item to="/replay" exact>
              <v-icon left color="#42b883">mdi-play-circle</v-icon>
              实时回放
            </v-list-item>
            <v-list-item to="/history" exact>
              <v-icon left color="#42b883">mdi-history</v-icon>
              历史回放
            </v-list-item>
          </v-list>
        </v-menu>
        
        <v-btn to="/new-match" exact style="color: #2c3e50;">
          <v-icon left color="#42b883">mdi-plus-box</v-icon>
          新建比赛
        </v-btn>
        
        <v-btn to="/backup" exact style="color: #2c3e50;">
          <v-icon left color="#42b883">mdi-database</v-icon>
          数据回溯
        </v-btn>
        
        <v-btn to="/dispute" exact style="color: #2c3e50;">
          <v-icon left color="#42b883">mdi-alert-circle</v-icon>
          争议复核
        </v-btn>
        
        <v-btn to="/notification" exact style="color: #2c3e50;">
          <v-icon left color="#42b883">mdi-bell</v-icon>
          消息通知
        </v-btn>
        
        <v-btn to="/final-score-display" exact style="color: #2c3e50;">
          <v-icon left color="#42b883">mdi-medal</v-icon>
          大屏评分
        </v-btn>
        
        <!-- 权限与规则下拉菜单 -->
        <v-menu offset-y>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" style="color: #2c3e50;">
              <v-icon left color="#42b883">mdi-shield-account</v-icon>
              权限与规则
              <v-icon right>mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item to="/permission" exact>
              <v-icon left color="#42b883">mdi-account-key</v-icon>
              权限配置
            </v-list-item>
            <v-list-item to="/scoring-rules" exact>
              <v-icon left color="#42b883">mdi-tune-variant</v-icon>
              评分规则
            </v-list-item>
            <v-list-item to="/rule-library" exact>
              <v-icon left color="#42b883">mdi-book-open-variant</v-icon>
              规则库
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn-group>
      
      <v-spacer></v-spacer>
      

      
      <!-- 消息通知按钮 -->
      <v-menu
        v-model="notificationMenu"
        :close-on-content-click="false"
        offset-y
        max-width="400"
      >
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props" @click="markAllAsRead" style="color: #2c3e50;">
            <v-icon>mdi-bell</v-icon>
            <v-badge 
              v-if="unreadCount > 0" 
              color="#42b883" 
              :content="unreadCount" 
              overlap
            ></v-badge>
          </v-btn>
        </template>

        <v-card class="notification-card">
          <v-card-title class="notification-header">
            <span>消息通知</span>
            <v-btn
              variant="text"
              size="small"
              @click="clearAllNotifications"
              :disabled="notifications.length === 0"
            >
              <v-icon left>mdi-delete-sweep</v-icon>
              清空
            </v-btn>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="notification-content" v-if="notifications.length > 0">
            <v-list density="compact">
              <v-list-item
                v-for="notification in notifications"
                :key="notification.id"
                class="notification-item"
                :class="{ 'unread': !notification.read }"
                @click="handleNotificationClick(notification)"
              >
                <template v-slot:prepend>
                  <v-icon
                    :color="getNotificationIconColor(notification.type)"
                    :icon="getNotificationIcon(notification.type)"
                  ></v-icon>
                </template>

                <v-list-item-title class="notification-title">
                  {{ notification.title }}
                </v-list-item-title>
                <v-list-item-subtitle class="notification-subtitle">
                  {{ notification.message }}
                </v-list-item-subtitle>
                <v-list-item-subtitle class="notification-time">
                  {{ formatTime(notification.time) }}
                </v-list-item-subtitle>

                <template v-slot:append>
                  <v-btn
                    variant="text"
                    size="x-small"
                    icon="mdi-close"
                    @click.stop="removeNotification(notification.id)"
                  ></v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>

          <v-card-text v-else class="text-center pa-8">
            <v-icon size="48" color="grey">mdi-bell-off</v-icon>
            <p class="text-grey mt-2">暂无新消息</p>
          </v-card-text>

          <v-divider v-if="notifications.length > 0"></v-divider>
        </v-card>
      </v-menu>
      
      <!-- 用户头像按钮 -->
      <v-menu offset-y>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props" style="color: #2c3e50;">
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </template>
        
        <v-card min-width="200">
          <v-card-text class="text-center">
            <v-avatar size="48" color="#42b883">
              <v-icon size="32">mdi-account</v-icon>
            </v-avatar>
            <div class="mt-2">
              <div class="text-subtitle-1 font-weight-medium">{{ refereeName }}</div>
              <div class="text-caption text-grey">超级管理员</div>
            </div>
          </v-card-text>
          
          <v-divider></v-divider>
          
          <v-list density="compact">
            <v-list-item @click="$router.push('/profile')">
              <v-icon left>mdi-account</v-icon>
              个人资料
            </v-list-item>
            <v-list-item @click="$router.push('/settings')">
              <v-icon left>mdi-cog</v-icon>
              系统设置
            </v-list-item>
            <v-list-item @click="logout">
              <v-icon left>mdi-logout</v-icon>
              退出登录
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-app-bar>

    <!-- 主内容区域 -->
    <v-main class="judge-main">
      <v-container fluid class="content-container">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

// 裁判姓名
const refereeName = ref('')

// 获取裁判姓名
const getRefereeName = () => {
  // 从完整的refereeInfo中提取裁判姓名
  try {
    const refereeInfo = JSON.parse(localStorage.getItem('refereeInfo') || '{}')
    refereeName.value = refereeInfo.name || refereeInfo.username || '裁判'
  } catch (error) {
    console.error('获取裁判信息失败:', error)
    refereeName.value = '裁判'
  }
}

// 消息通知相关状态
const notifications = ref([
  { id: 1, type: 'info', title: '系统更新', message: '评分系统已更新至 v2.1.3', time: Date.now() - 1000 * 60 * 5, read: false },
  { id: 2, type: 'warning', title: '争议复核', message: '有 3 条新的争议申请待处理', time: Date.now() - 1000 * 60 * 30, read: false },
  { id: 3, type: 'success', title: '数据备份完成', message: '今日数据已成功备份', time: Date.now() - 1000 * 60 * 60, read: true }
])
const notificationMenu = ref(false)
const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

const getNotificationIcon = (type) => {
  const iconMap = { info: 'mdi-information', warning: 'mdi-alert', success: 'mdi-check-circle', error: 'mdi-close-circle' }
  return iconMap[type] || 'mdi-information'
}

const getNotificationIconColor = (type) => {
  const colorMap = { info: 'info', warning: 'warning', success: 'success', error: 'error' }
  return colorMap[type] || 'info'
}

const formatTime = (timestamp) => {
  const now = Date.now()
  const diff = now - timestamp
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`
  return `${Math.floor(diff / 86400000)} 天前`
}

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true)
}

const removeNotification = (id) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index !== -1) notifications.value.splice(index, 1)
}

const clearAllNotifications = () => {
  notifications.value = []
}

const handleNotificationClick = (notification) => {
  notification.read = true
  // 根据类型跳转对应页面
  const routeMap = { '争议复核': '/dispute', '系统更新': '/settings' }
  const route = routeMap[notification.title]
  if (route) router.push(route)
}

const viewAllNotifications = () => {
  router.push('/notification')
  notificationMenu.value = false
}

const router = useRouter()
const windowWidth = ref(window.innerWidth)

// 全屏状态管理
const isFullscreen = ref(false)

const isMobile = computed(() => windowWidth.value <= 1264)

const updateWidth = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', updateWidth)
  // 获取裁判姓名
  getRefereeName()
  
  // 监听全屏切换事件
  window.addEventListener('toggleFullscreen', handleFullscreenToggle)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth)
  window.removeEventListener('toggleFullscreen', handleFullscreenToggle)
})

// 处理全屏切换
const handleFullscreenToggle = (event) => {
  isFullscreen.value = event.detail.isFullscreen
}

const logout = () => {
  // 清除所有本地存储的用户信息
  localStorage.removeItem('token')
  localStorage.removeItem('refereeInfo')
  localStorage.removeItem('judgeName') // 如果有这个也一并清除
  
  // 跳转到登录页
  router.push('/login')
}
</script>

<style scoped>
.judge-main {
  background-color: #f0f2f5;
  background-image: linear-gradient(135deg, #f0f2f5 0%, #e4e7ed 100%);
  min-height: 100vh;
  padding-top: 64px; /* 为顶部栏留出空间 */
}

.content-container {
  padding: 20px;
  max-width: 100%;
  transition: all 0.3s ease;
}

.v-btn {
  text-transform: none;
  font-weight: 500;
}

/* 顶部导航按钮样式 - 与网页风格统一 */
:deep(.v-btn-group .v-btn) {
  height: 48px !important;
  padding: 0 16px !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  border-radius: 8px !important;
  margin: 0 2px !important;
  transition: all 0.3s ease !important;
}

:deep(.v-btn-group .v-btn:hover) {
  background-color: rgba(66, 184, 131, 0.08) !important;
  color: #42b883 !important;
}

:deep(.v-btn-group .v-btn--active) {
  background-color: rgba(66, 184, 131, 0.15) !important;
  color: #42b883 !important;
  border-bottom: 2px solid #42b883 !important;
}

/* 顶部栏标题样式 */
:deep(.v-app-bar-title) {
  font-weight: 600 !important;
  letter-spacing: 0.5px !important;
}

/* 图标按钮悬浮效果 */
:deep(.v-app-bar .v-btn--icon:hover) {
  background-color: rgba(66, 184, 131, 0.08) !important;
  color: #42b883 !important;
  transform: translateY(-1px) !important;
}

/* 消息通知样式 - 与网页风格统一 */
.notification-card {
  max-height: 500px;
  overflow-y: auto;
  border-radius: 12px !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px !important;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.notification-content {
  padding: 0 !important;
}

.notification-item {
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
  border-radius: 8px !important;
  margin: 4px 8px !important;
}

.notification-item:hover {
  background-color: rgba(66, 184, 131, 0.08);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.notification-item.unread {
  border-left-color: #42b883;
  background-color: rgba(66, 184, 131, 0.05);
}

.notification-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 2px;
}

.notification-subtitle {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.7);
  margin-bottom: 4px;
}

.notification-time {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.5);
}

/* 下拉菜单样式优化 */
:deep(.v-menu .v-list) {
  border-radius: 12px !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
  padding: 8px 0 !important;
}

:deep(.v-menu .v-list-item) {
  border-radius: 8px !important;
  margin: 2px 8px !important;
  transition: all 0.3s ease !important;
}

:deep(.v-menu .v-list-item:hover) {
  background-color: rgba(66, 184, 131, 0.08) !important;
  transform: translateY(-1px) !important;
}

/* 用户菜单样式优化 */
:deep(.v-card) {
  border-radius: 12px !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
}

/* 响应式布局优化 */
@media (max-width: 1264px) {
  .content-container {
    padding: 16px;
  }
  
  /* 移动端隐藏部分导航按钮文字 */
  @media (max-width: 768px) {
    :deep(.v-btn-group .v-btn) {
      padding: 0 8px !important;
      font-size: 12px !important;
    }
    
    :deep(.v-btn-group .v-btn .v-icon--left) {
      margin-right: 4px !important;
    }
    
    /* 移动端优化顶部栏 */
    :deep(.v-app-bar-title) {
      font-size: 1.1rem !important;
    }
  }
}
</style>