<template>
  <v-app>
    <!-- 左侧响应式模块栏 -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail && !isMobile"
      :temporary="isMobile"
      rail-width="56"
      width="240"
      class="judge-sidebar"
      elevation="2"
    >
      <v-list-item
        prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
        title="裁判工作台"
        subtitle=""
        nav
      >
        <!-- <template v-slot:append>
          <v-btn
            v-if="!isMobile"
            variant="text"
            :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
            @click.stop="rail = !rail"
          ></v-btn>
        </template> -->
      </v-list-item>

      <v-divider></v-divider>

      <!-- 功能模块导航 -->
      <v-list density="compact" nav>
        <v-list-item 
          prepend-icon="mdi-home" 
          title="主页" 
          value="dashboard" 
          to="/dashboard"
          exact
        ></v-list-item>
        <v-list-item 
          prepend-icon="mdi-play-box-multiple" 
          title="实时回放" 
          value="replay" 
          to="/replay"
          exact
        ></v-list-item>
        <v-list-item 
          prepend-icon="mdi-robot" 
          title="AI评分明细" 
          value="ai-score" 
          to="/ai-score"
          exact
        ></v-list-item>
        <v-list-item 
          prepend-icon="mdi-account-edit" 
          title="人工评分干预" 
          value="manual-score" 
          to="/manual-score"
          exact
        ></v-list-item>
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
      </v-list>

      <template v-slot:append>
        <v-list density="compact" nav>
          <v-list-item 
            prepend-icon="mdi-logout" 
            title="退出登录" 
            @click="logout"
          ></v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>

    <!-- 顶部工具栏 -->
    <v-app-bar color="#42b883" dark>
      <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
      <v-app-bar-title>武术裁判评分系统</v-app-bar-title>
      
      <v-spacer></v-spacer>
      
      <v-btn icon>
        <v-icon>mdi-bell</v-icon>
        <v-badge color="red" content="3" overlap></v-badge>
      </v-btn>
      
      <v-btn icon>
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
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

const drawer = ref(true)
const rail = ref(false)
const router = useRouter()
const windowWidth = ref(window.innerWidth)

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
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth)
})

const toggleDrawer = () => {
  if (isMobile.value) {
    drawer.value = !drawer.value
  } else {
    rail.value = !rail.value
  }
}

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<style scoped>
.judge-sidebar {
  background: white;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  border-right: 1px solid #e0e0e0;
  z-index: 1000;
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