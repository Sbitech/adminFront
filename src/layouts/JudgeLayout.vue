<template>
  <v-app>

    <v-navigation-drawer
      v-model="drawer"
      :rail="rail && !isMobile"
      :temporary="isMobile"
      rail-width="56"
      width="240"
      class="judge-sidebar"
      elevation="2"
      :style="{ display: isFullscreen ? 'none' : 'flex' }"
      style="flex-direction: column; height: 100vh;"
    >
      <v-list-item
        prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
        :title="refereeName"
        subtitle=""
        nav
      >

      </v-list-item>
    
      <v-divider></v-divider>

      <div class="sidebar-content">
        <v-list density="compact" nav class="sidebar-main-menu">
          <v-list-item 
            prepend-icon="mdi-home"   
            title="主页" 
            value="home" 
            to="/home"
            exact
          ></v-list-item>
          <v-list-group value="replay-management" fluid>
            <template v-slot:activator="{ props }">
              <v-list-item
                prepend-icon="mdi-play-box-multiple"
                title="回放处理"
                v-bind="props"
              ></v-list-item>
            </template>
            
            <v-list-item
              prepend-icon="mdi-play"
              title="实时回放"
              value="replay"
              to="/replay"
              exact
              style="padding-left: 32px !important;"
            ></v-list-item>
            <v-list-item
              prepend-icon="mdi-video-plus"
              title="新增赛事"
              value="new-match"
              to="/new-match"
              exact
              style="padding-left: 32px !important;"
            ></v-list-item>
          </v-list-group>
          <v-list-item 
            prepend-icon="mdi-database" 
            title="数据备份" 
            value="backup" 
            to="/backup"
            exact
          ></v-list-item>
          <v-list-item 
            prepend-icon="mdi-file-pdf-box" 
            title="报告PDF" 
            value="report" 
            to="/report"
            exact
          ></v-list-item>
          <v-list-item 
            prepend-icon="mdi-history" 
            title="数据回溯" 
            value="history" 
            to="/history"
            exact
          ></v-list-item>
          <v-list-item 
            prepend-icon="mdi-alert-circle" 
            title="争议复核" 
            value="dispute" 
            to="/dispute"
            exact
          ></v-list-item>
          <v-list-item 
            prepend-icon="mdi-bell" 
            title="消息通知" 
            value="notification" 
            to="/notification"
            exact
          ></v-list-item>

          <v-list-item 
            prepend-icon="mdi-medal" 
            title="大屏评分" 
            value="final-score-display" 
            to="/final-score-display"
            exact
          ></v-list-item>
          <v-list-group value="permission" fluid>
            <template v-slot:activator="{ props }">
              <v-list-item
                prepend-icon="mdi-shield-account"
                title="权限与规则"
                v-bind="props"
              ></v-list-item>
            </template>
            
            <v-list-item
              prepend-icon="mdi-account-key"
              title="权限配置"
              value="permission-config"
              to="/permission"
              exact
              style="padding-left: 32px !important;"
            ></v-list-item>
            <v-list-item
              prepend-icon="mdi-tune-variant"
              title="评分规则"
              value="scoring-rules"
              to="/scoring-rules"
              exact
              style="padding-left: 32px !important;"
            ></v-list-item>
            <v-list-item
              prepend-icon="mdi-book-open-variant"
              title="规则库"
              value="rule-library"
              to="/rule-library"
              exact
              style="padding-left: 32px !important;"
            ></v-list-item>
          </v-list-group>
        </v-list>
        
        <div class="sidebar-footer">
          <v-divider></v-divider>
          <v-list-item 
            prepend-icon="mdi-logout" 
            title="退出登录" 
            @click="logout"
            class="logout-item"
          ></v-list-item>
        </div>
      </div>
    </v-navigation-drawer>

    <!-- 顶部工具栏 -->
    <v-app-bar color="#42b883" dark :style="{ display: isFullscreen ? 'none' : 'flex' }">
      <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
      <v-app-bar-title>武术裁判评分系统</v-app-bar-title>
      
      <v-spacer></v-spacer>
      
      <!-- 消息通知按钮 -->
      <v-menu
        v-model="notificationMenu"
        :close-on-content-click="false"
        offset-y
        max-width="400"
      >
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props" @click="markAllAsRead">
            <v-icon>mdi-bell</v-icon>
            <v-badge 
              v-if="unreadCount > 0" 
              color="red" 
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
          <v-btn icon v-bind="props">
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </template>
        
        <v-card min-width="200">
          <v-card-text class="text-center">
            <v-avatar size="48" color="#42b883">
              <v-icon size="32">mdi-account</v-icon>
            </v-avatar>
            <div class="mt-2">
              <div class="text-subtitle-1 font-weight-medium">管理员</div>
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

const drawer = ref(true)
const rail = ref(false)
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
  // 初始化时根据窗口大小设置状态
  if (isMobile.value) {
    drawer.value = false
  }
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
  
  // 隐藏/显示侧边栏和顶部栏
  if (isFullscreen.value) {
    drawer.value = false
  } else {
    // 恢复原来的状态
    drawer.value = !isMobile.value
  }
}

const toggleDrawer = () => {
  if (isMobile.value) {
    drawer.value = !drawer.value
  } else {
    rail.value = !rail.value
  }
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
.judge-sidebar {
  background: white;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  border-right: 1px solid #e0e0e0;
  z-index: 1000;
  height: 100vh !important;
  overflow: hidden !important; /* 完全隐藏滚动条 */
}

.judge-main {
  background-color: #f0f2f5;
  background-image: linear-gradient(135deg, #f0f2f5 0%, #e4e7ed 100%);
  min-height: 100vh;
  transition: padding-left 0.3s ease;
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

/* 消息通知样式 */
.notification-card {
  max-height: 500px;
  overflow-y: auto;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px !important;
  font-size: 16px;
  font-weight: 600;
}

.notification-content {
  padding: 0 !important;
}

.notification-item {
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-left: 3px solid transparent;
}

.notification-item:hover {
  background-color: rgba(66, 184, 131, 0.08);
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

/* 固定头像大小 */
:deep(.v-list-item__prepend) .v-avatar {
  width: 40px !important;
  height: 40px !important;
  flex: 0 0 40px !important;
}

:deep(.v-list-item--nav) .v-list-item__prepend .v-avatar {
  width: 40px !important;
  height: 40px !important;
  flex: 0 0 40px !important;
}

/* 侧边栏布局样式 */
.sidebar-content {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px); /* 减去头像区域的高度 */
  overflow: hidden !important; /* 完全隐藏滚动条 */
}

.sidebar-main-menu {
  flex: 1;
  overflow: hidden !important; /* 完全隐藏滚动条 */
  padding-bottom: 8px; /* 添加一些底部间距 */
}

.sidebar-footer {
  flex-shrink: 0;
  background: white;
  border-top: 1px solid #e0e0e0;
  margin-top: auto; /* 确保在底部 */
}

.logout-item {
  background: white;
  font-size: 14px !important; /* 统一字体大小 */
  font-weight: 500 !important;
}

.logout-item:hover {
  background-color: rgba(239, 83, 80, 0.08) !important;
  color: #ef5353 !important;
}

/* 统一所有菜单项的字体大小 */
:deep(.v-list-item-title) {
  font-size: 14px !important;
  font-weight: 500 !important;
}

:deep(.v-list-item--nav) {
  font-size: 14px !important;
}

/* 响应式布局优化 */
@media (max-width: 1264px) {
  .judge-main {
    padding-left: 0 !important;
  }
  
  .content-container {
    padding: 16px;
  }
  
  .judge-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 1001;
  }
}
</style>