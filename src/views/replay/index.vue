<template>
  <v-container fluid class="replay-container">

    <v-row>
      <v-col cols="12">
        <v-card class="replay-card">
          <v-card-title>
            <v-icon left>mdi-video</v-icon>
            回放系统
          </v-card-title>
          <v-card-text>

            <v-row class="mb-4">
              <v-col cols="12" md="3">
                <v-select v-model="selectedEvent" label="比赛项目" :items="eventOptions" variant="outlined"
                  density="compact" hide-details clearable></v-select>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field v-model="selectedDate" label="选择日期" type="date" variant="outlined" density="compact"
                  hide-details clearable></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field v-model="searchKeyword" label="搜索选手" prepend-icon="mdi-magnify" variant="outlined"
                  density="compact" hide-details clearable></v-text-field>
              </v-col>
              <v-col cols="12" md="3" class="d-flex align-end">
                <v-btn color="grey" prepend-icon="mdi-restore" @click="resetFilters" class="mr-2" size="small">
                  重置
                </v-btn>
                <v-btn color="#42b883" prepend-icon="mdi-filter" @click="applyFilters" size="small">
                  筛选
                </v-btn>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" lg="8">
                <v-card class="video-player" style="aspect-ratio: 16/9; max-height: 600px;">
                  <!-- 主视频窗口 -->
                  <video 
                    v-if="selectedMatch && currentVideoUrl" 
                    ref="mainVideo"
                    :src="currentVideoUrl" 
                    controls 
                    autoplay
                    class="video-element" 
                    @error="handleVideoError" 
                    @loadedmetadata="onVideoLoaded"
                    @timeupdate="syncVideoTime"
                    style="width: 100%; height: 100%; object-fit: cover;">
                    您的浏览器不支持视频播放。
                  </video>
                  <v-card-text v-else class="text-center d-flex flex-column align-center justify-center" style="height: 100%;">
                    <v-icon size="64" color="grey">mdi-video-off</v-icon>
                    <p class="text-h6 mt-4">暂无视频回放</p>
                    <p>请选择比赛场次开始观看</p>
                  </v-card-text>
                </v-card>
                
                <!-- 视角切换窗口 -->
                <v-card v-if="selectedMatch" class="mt-3" style="background-color: #f5f5f5;">
                  <v-card-text class="pa-3">
                    <div class="text-subtitle-2 mb-2 text-center">
                      视角切换 - {{ getPerspectiveName(currentPerspective) }}
                    </div>
                    <v-row no-gutters class="justify-center">
                      <v-col cols="4" class="pa-1">
                        <v-card 
                          :class="['perspective-card', { 'active': currentPerspective === 'front' }]"
                          @click="switchPerspective('front')"
                          class="text-center cursor-pointer"
                          style="aspect-ratio: 16/9; max-height: 100px;"
                        >
                          <video 
                            v-if="selectedMatch.videoFront" 
                            ref="frontVideo"
                            :src="selectedMatch.videoFront" 
                            muted 
                            autoplay
                            loop
                            class="perspective-video"
                            @loadedmetadata="onPerspectiveLoaded"
                          ></video>
                          <div v-else class="d-flex flex-column align-center justify-center" style="height: 100%;">
                            <v-icon color="grey">mdi-video-account</v-icon>
                            <span class="text-caption">正面</span>
                          </div>
                        </v-card>
                      </v-col>
                      <v-col cols="4" class="pa-1">
                        <v-card 
                          :class="['perspective-card', { 'active': currentPerspective === 'side' }]"
                          @click="switchPerspective('side')"
                          class="text-center cursor-pointer"
                          style="aspect-ratio: 16/9; max-height: 100px;"
                        >
                          <video 
                            v-if="selectedMatch.videoSide" 
                            ref="sideVideo"
                            :src="selectedMatch.videoSide" 
                            muted 
                            autoplay
                            loop
                            class="perspective-video"
                            @loadedmetadata="onPerspectiveLoaded"
                          ></video>
                          <div v-else class="d-flex flex-column align-center justify-center" style="height: 100%;">
                            <v-icon color="grey">mdi-video-account</v-icon>
                            <span class="text-caption">侧面</span>
                          </div>
                        </v-card>
                      </v-col>
                      <v-col cols="4" class="pa-1">
                        <v-card 
                          :class="['perspective-card', { 'active': currentPerspective === 'back' }]"
                          @click="switchPerspective('back')"
                          class="text-center cursor-pointer"
                          style="aspect-ratio: 16/9; max-height: 100px;"
                        >
                          <video 
                            v-if="selectedMatch.videoBack" 
                            ref="backVideo"
                            :src="selectedMatch.videoBack" 
                            muted 
                            autoplay
                            loop
                            class="perspective-video"
                            @loadedmetadata="onPerspectiveLoaded"
                          ></video>
                          <div v-else class="d-flex flex-column align-center justify-center" style="height: 100%;">
                            <v-icon color="grey">mdi-video-account</v-icon>
                            <span class="text-caption">背面</span>
                          </div>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" lg="4">
                <v-card class="match-list" max-height="600" style="overflow-y: auto;">
                  <v-card-title class="sticky-title">
                    比赛场次
                    <v-chip v-if="filteredMatches.length !== matches.length" small color="#42b883" class="ml-2">
                      {{ filteredMatches.length }} 场
                    </v-chip>
                  </v-card-title>
                  <v-card-text class="pa-0">
                    <v-list density="compact" style="max-height: 520px; overflow-y: auto;">
                      <v-list-item v-for="(match, index) in filteredMatches" :key="match.id"
                        :class="{ 'selected-match': selectedMatch?.id === match.id }" @click="selectMatch(match)"
                        class="match-item" :style="{ borderTop: index === 0 ? 'none' : '1px solid #f0f0f0' }">
                        <v-list-item-title class="text-body-2 font-weight-medium">{{ match.title }}</v-list-item-title>
                        <v-list-item-subtitle class="text-caption">
                          {{ match.event }} • {{ match.date }} {{ match.time }}
                        </v-list-item-subtitle>
                        <template v-slot:append>
                          <v-icon v-if="selectedMatch?.id === match.id" color="#42b883" size="20">
                            mdi-play-circle
                          </v-icon>
                        </template>
                      </v-list-item>
                      <v-list-item v-if="filteredMatches.length === 0" class="text-center py-4">
                        <v-list-item-title class="text-grey text-body-2">
                          暂无匹配的比赛
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'

// 视频引用
const mainVideo = ref(null)
const frontVideo = ref(null)
const sideVideo = ref(null)
const backVideo = ref(null)

// 选中的比赛
const selectedMatch = ref(null)

// 当前视角
const currentPerspective = ref('front')

// 当前视频地址
const currentVideoUrl = computed(() => {
  if (!selectedMatch.value) return null

  switch (currentPerspective.value) {
    case 'front':
      return selectedMatch.value.videoFront || selectedMatch.value.videoUrl
    case 'side':
      return selectedMatch.value.videoSide || selectedMatch.value.videoUrl
    case 'back':
      return selectedMatch.value.videoBack || selectedMatch.value.videoUrl
    default:
      return selectedMatch.value.videoUrl
  }
})

// 筛选条件
const selectedEvent = ref('')
const selectedDate = ref('')
const searchKeyword = ref('')

// 比赛项目选项
const eventOptions = ['太极拳', '长拳', '南拳', '剑术', '刀术']

// 模拟比赛数据（添加更多字段用于筛选）
const matches = ref([
  {
    id: 1,
    title: '场次 001 - 张三 vs 李四',
    event: '太极拳',
    time: '10:30',
    date: '2024-01-15',
    player1: '张三',
    player2: '李四',
    videoUrl: 'https://wushu-demo.oss-cn-beijing.aliyuncs.com/%E8%A7%86%E9%A2%91demo.mp4',
    videoFront: 'https://wushu-demo.oss-cn-beijing.aliyuncs.com/%E8%A7%86%E9%A2%91demo.mp4',
    videoSide: 'https://v.xinmin.cn/uploads/videos/2024/12/30/BFOL852349.mp4',
    videoBack: 'https://wushu-demo.oss-cn-beijing.aliyuncs.com/%E8%A7%86%E9%A2%91demo_back.mp4'
  },
  {
    id: 2,
    title: '场次 002 - 王五 vs 赵六',
    event: '长拳',
    time: '11:00',
    date: '2024-01-15',
    player1: '王五',
    player2: '赵六',
    videoUrl: 'https://v.xinmin.cn/uploads/videos/2024/12/30/BFOL852349.mp4',
    videoFront: 'https://v.xinmin.cn/uploads/videos/2024/12/30/BFOL852349_front.mp4',
    videoSide: 'https://v.xinmin.cn/uploads/videos/2024/12/30/BFOL852349_side.mp4',
    videoBack: 'https://v.xinmin.cn/uploads/videos/2024/12/30/BFOL852349_back.mp4'
  },
  {
    id: 3,
    title: '场次 003 - 陈七 vs 刘八',
    event: '南拳',
    time: '11:30',
    date: '2024-01-15',
    player1: '陈七',
    player2: '刘八',
    videoUrl: '/videos/match003.mp4',
    videoFront: '/videos/match003_front.mp4',
    videoSide: '/videos/match003_side.mp4',
    videoBack: '/videos/match003_back.mp4'
  },
  {
    id: 4,
    title: '场次 004 - 孙九 vs 周十',
    event: '太极拳',
    time: '14:00',
    date: '2024-01-16',
    player1: '孙九',
    player2: '周十',
    videoUrl: '/videos/match004.mp4',
    videoFront: '/videos/match004_front.mp4',
    videoSide: '/videos/match004_side.mp4',
    videoBack: '/videos/match004_back.mp4'
  },
  {
    id: 5,
    title: '场次 005 - 吴一 vs 郑二',
    event: '剑术',
    time: '14:30',
    date: '2024-01-16',
    player1: '吴一',
    player2: '郑二',
    videoUrl: '/videos/match005.mp4',
    videoFront: '/videos/match005_front.mp4',
    videoSide: '/videos/match005_side.mp4',
    videoBack: '/videos/match005_back.mp4'
  },
  {
    id: 6,
    title: '场次 006 - 王二 vs 张三',
    event: '刀术',
    time: '15:00',
    date: '2024-01-16',
    player1: '王二',
    player2: '张三',
    videoUrl: '/videos/match006.mp4',
    videoFront: '/videos/match006_front.mp4',
    videoSide: '/videos/match006_side.mp4',
    videoBack: '/videos/match006_back.mp4'
  },
  {
    id: 7,
    title: '场次 007 - 李四 vs 王五',
    event: '太极拳',
    time: '15:30',
    date: '2024-01-16',
    player1: '李四',
    player2: '王五',
    videoUrl: '/videos/match007.mp4',
    videoFront: '/videos/match007_front.mp4',
    videoSide: '/videos/match007_side.mp4',
    videoBack: '/videos/match007_back.mp4'
  },
  {
    id: 8,
    title: '场次 008 - 赵六 vs 孙七',
    event: '长拳',
    time: '16:00',
    date: '2024-01-16',
    player1: '赵六',
    player2: '孙七',
    videoUrl: '/videos/match008.mp4',
    videoFront: '/videos/match008_front.mp4',
    videoSide: '/videos/match008_side.mp4',
    videoBack: '/videos/match008_back.mp4'
  },
  {
    id: 9,
    title: '场次 009 - 周八 vs 吴九',
    event: '南拳',
    time: '16:30',
    date: '2024-01-16',
    player1: '周八',
    player2: '吴九',
    videoUrl: '/videos/match009.mp4',
    videoFront: '/videos/match009_front.mp4',
    videoSide: '/videos/match009_side.mp4',
    videoBack: '/videos/match009_back.mp4'
  },
  {
    id: 10,
    title: '场次 010 - 郑十 vs 王十一',
    event: '剑术',
    time: '17:00',
    date: '2024-01-16',
    player1: '郑十',
    player2: '王十一',
    videoUrl: '/videos/match010.mp4',
    videoFront: '/videos/match010_front.mp4',
    videoSide: '/videos/match010_side.mp4',
    videoBack: '/videos/match010_back.mp4'
  },
  {
    id: 11,
    title: '场次 011 - 王十二 vs 郑十三',
    event: '刀术',
    time: '17:30',
    date: '2024-01-16',
    player1: '王十二',
    player2: '郑十三',
    videoUrl: '/videos/match011.mp4',
    videoFront: '/videos/match011_front.mp4',
    videoSide: '/videos/match011_side.mp4',
    videoBack: '/videos/match011_back.mp4'
  },
  {
    id: 12,
    title: '场次 012 - 王十三 vs 郑十四',
    event: '刀术',
    time: '18:00',
    date: '2024-01-16',
    player1: '王十三',
    player2: '郑十四',
    videoUrl: '/videos/match012.mp4',
    videoFront: '/videos/match012_front.mp4',
    videoSide: '/videos/match012_side.mp4',
    videoBack: '/videos/match012_back.mp4'
  },
  {
    id: 13,
    title: '场次 013 - 王十四 vs 郑十五',
    event: '刀术',
    time: '18:30',
    date: '2024-01-16',
    player1: '王十四',
    player2: '郑十五',
    videoUrl: '/videos/match013.mp4',
    videoFront: '/videos/match013_front.mp4',
    videoSide: '/videos/match013_side.mp4',
    videoBack: '/videos/match013_back.mp4'
  },

])

// 筛选后的比赛列表
const filteredMatches = computed(() => {
  return matches.value.filter(match => {
    // 比赛项目筛选
    if (selectedEvent.value && match.event !== selectedEvent.value) {
      return false
    }

    // 日期筛选
    if (selectedDate.value && match.date !== selectedDate.value) {
      return false
    }

    // 选手姓名搜索
    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase()
      const title = match.title.toLowerCase()
      const player1 = match.player1.toLowerCase()
      const player2 = match.player2.toLowerCase()

      return title.includes(keyword) ||
        player1.includes(keyword) ||
        player2.includes(keyword)
    }

    return true
  })
})

// 选择比赛场次
const selectMatch = (match) => {
  selectedMatch.value = match
  currentPerspective.value = 'front'
  console.log('选择的比赛:', match)
  // 重置所有视频
  nextTick(() => {
    syncAllVideos()
  })
}

// 切换视角
const switchPerspective = (perspective) => {
  currentPerspective.value = perspective
}

// 获取视角显示名称
const getPerspectiveName = (perspective) => {
  const names = {
    'front': '正面视角',
    'side': '侧面视角',
    'back': '背面视角'
  }
  return names[perspective] || '未知视角'
}

// 视频加载完成
const onVideoLoaded = () => {
  syncAllVideos()
}

// 视角视频加载完成
const onPerspectiveLoaded = () => {
  syncAllVideos()
}

// 同步所有视频进度
const syncAllVideos = () => {
  if (!mainVideo.value) return
  
  const currentTime = mainVideo.value.currentTime || 0
  const isPlaying = !mainVideo.value.paused
  
  // 同步小窗口视频
  const perspectiveVideos = [frontVideo.value, sideVideo.value, backVideo.value]
  perspectiveVideos.forEach(video => {
    if (video) {
      // 确保静音
      video.muted = true
      // 同步时间
      if (Math.abs(video.currentTime - currentTime) > 0.3) {
        video.currentTime = currentTime
      }
      // 同步播放状态
      if (isPlaying && video.paused) {
        video.play().catch(() => {}) // 静默处理自动播放错误
      } else if (!isPlaying && !video.paused) {
        video.pause()
      }
    }
  })
}

// 主视频时间更新时同步
const syncVideoTime = () => {
  syncAllVideos()
}

// 应用筛选
const applyFilters = () => {
  console.log('应用筛选:', {
    event: selectedEvent.value,
    date: selectedDate.value,
    keyword: searchKeyword.value
  })
}

// 重置筛选
const resetFilters = () => {
  selectedEvent.value = ''
  selectedDate.value = ''
  searchKeyword.value = ''
  selectedMatch.value = null
  console.log('重置筛选')
}

// 处理视频加载错误
const handleVideoError = () => {
  console.error('视频加载失败，请检查视频路径')
}
</script>

<style scoped>
.replay-container {
  background-color: #f0f2f5;
  background-image: linear-gradient(135deg, #f0f2f5 0%, #e4e7ed 100%);
  min-height: auto;
  padding: 20px;
}

.replay-header {
  text-align: center;
  margin-bottom: 30px;
}

.replay-title {
  color: #2c3e50;
  font-weight: 600;
  font-size: 2rem;
  margin-bottom: 8px;
}

.replay-subtitle {
  color: #666;
  font-size: 1.1rem;
}

.replay-card {
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: none;
}

.video-player {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.match-list {
  border-radius: 8px;
  position: relative;
}

.sticky-title {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  border-bottom: 1px solid #f0f0f0;
}

.video-element {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: #000;
}

.perspective-card {
  border: 2px solid transparent;
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
}

.perspective-card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.perspective-card.active {
  border-color: #1976d2;
  background-color: #e3f2fd;
}

.perspective-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

.match-item {
  cursor: pointer;
  transition: all 0.3s ease;
}

.match-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.selected-match {
  border-left: 4px solid #1976d2;
  background-color: #f5f5f5;
}

.cursor-pointer {
  cursor: pointer;
}
</style>