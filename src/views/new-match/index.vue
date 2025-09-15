<template>
  <v-container fluid class="new-match-container">
    <v-row>
      <!-- 左侧视频列表 -->
      <v-col cols="12" md="4" class="video-list-col">
        <v-card class="video-list-card">
          <v-card-title class="d-flex align-center pa-3">
            <v-icon left color="#42b883">mdi-video</v-icon>
            待处理视频
            <v-spacer></v-spacer>
            <v-btn
              icon="mdi-refresh"
              variant="text"
              density="compact"
              @click="refreshVideoList"
              :loading="loadingVideos"
              size="small"
              color="primary"
              class="ml-2"
            ></v-btn>
          </v-card-title>
          <v-card-text class="pa-0">
            <div class="video-scroll-container">
              <v-list class="video-list">
                <div v-for="session in videoList" :key="session.sessionId" class="session-group mb-4">
                  <v-card 
                    flat 
                    class="session-card mb-2 cursor-pointer"
                    :class="{ 
                      'processed': session.videos.every(v => v.processed),
                      'selected': selectedSession?.sessionId === session.sessionId 
                    }"
                    @click="selectSession(session)"
                    :disabled="session.videos.every(v => v.processed)"
                  >
                    <v-card-text class="py-3 px-3">
                      <div class="d-flex align-center mb-2">
                        <v-icon left color="primary" size="20">mdi-account-group</v-icon>
                        <div class="text-subtitle-1 font-weight-medium">{{ session.sessionName }}</div>
                        <v-spacer></v-spacer>
                        <v-chip
                          x-small
                          :color="session.videos.every(v => v.processed) ? 'success' : 'warning'"
                          text-color="white"
                        >
                          {{ session.videos.every(v => v.processed) ? '全部已处理' : '待处理' }}
                        </v-chip>
                      </div>
                      <div class="text-caption grey--text">
                        <v-icon small>mdi-clock</v-icon> {{ session.time }} 
                        <v-icon small class="ml-2">mdi-map-marker</v-icon> {{ session.location }}
                      </div>
                      <div class="text-caption grey--text mt-1">
                        <v-icon small>mdi-video</v-icon> 3个机位视频
                      </div>
                    </v-card-text>
                  </v-card>
                </div>
              </v-list>
              
              <div v-if="availableVideos.length === 0" class="text-center py-8">
                <v-icon size="48" color="grey lighten-1">mdi-video-off</v-icon>
                <div class="text-subtitle-1 grey--text mt-2">暂无待处理视频</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- 右侧表单区域 -->
        <v-col cols="12" md="8">
          <v-card class="form-card">
            <v-card-title class="d-flex align-center">
              <v-icon left color="#42b883">mdi-form-textbox</v-icon>
              填写赛事信息
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="form-content">
              <v-form ref="form" v-model="valid">
                <!-- 基本信息 -->
              <div class="section-title">基本信息</div>
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="matchForm.matchName"
                    label="赛事名称"
                    :rules="[v => !!v || '请输入赛事名称']"
                    required
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-trophy"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="matchForm.event"
                    :items="eventOptions"
                    label="比赛项目"
                    :rules="[v => !!v || '请选择比赛项目']"
                    required
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-karate"
                  ></v-select>
                </v-col>
              </v-row>

              <v-row dense>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="matchForm.date"
                    label="比赛日期"
                    type="date"
                    :rules="[v => !!v || '请选择比赛日期']"
                    required
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-calendar"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="matchForm.time"
                    label="比赛时间"
                    type="time"
                    :rules="[v => !!v || '请选择比赛时间']"
                    required
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-clock"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="matchForm.location"
                    label="比赛地点"
                    :rules="[v => !!v || '请输入比赛地点']"
                    required
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-map-marker"
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- 场次信息 -->
              <div class="section-title">场次信息</div>
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-autocomplete
                    v-model="matchForm.player"
                    :items="filteredPlayers"
                    label="选择选手"
                    :rules="[v => !!v || '请选择选手']"
                    required
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-account"
                    clearable
                    item-title="name"
                    item-value="id"
                    @update:model-value="onPlayerSelect"
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props">
                        <template v-slot:title>
                          {{ item.raw.name }}
                        </template>
                        <template v-slot:subtitle>
                          {{ item.raw.team }} • 编号: {{ item.raw.number }}
                        </template>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="matchForm.playerNumber"
                    label="选手编号"
                    type="number"
                    :rules="[v => !!v || '请输入选手编号']"
                    required
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-numeric"
                    readonly
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row dense>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="matchForm.playerTeam"
                    label="代表队"
                    :rules="[v => !!v || '请输入代表队']"
                    required
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-shield-account"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="matchForm.level"
                    :items="levelOptions"
                    label="比赛级别"
                    :rules="[v => !!v || '请选择比赛级别']"
                    required
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-medal"
                  ></v-select>
                </v-col>
              </v-row>

              <!-- 选中场次信息 -->
              <div class="section-title">选中场次信息</div>
              <v-row dense v-if="selectedSession">
                <v-col cols="12">
                  <v-card outlined class="pa-3">
                    <div class="d-flex align-center mb-2">
                      <v-icon color="primary" size="20" class="mr-2">mdi-account-group</v-icon>
                      <span class="text-subtitle-1 font-weight-medium">{{ selectedSession.sessionName }}</span>
                    </div>
                    <div class="text-caption grey--text mb-2">
                      <v-icon small>mdi-clock</v-icon> {{ selectedSession.time }} 
                      <v-icon small class="ml-2">mdi-map-marker</v-icon> {{ selectedSession.location }}
                    </div>
                    <div class="text-caption grey--text">
                      <v-icon small>mdi-video</v-icon> 包含3个机位视频：正面、侧面、俯视
                    </div>
                  </v-card>
                </v-col>
              </v-row>

              <!-- 备注信息 -->
              <div class="section-title">备注信息</div>
              <v-row dense>
                <v-col cols="12">
                  <v-textarea
                    v-model="matchForm.notes"
                    label="比赛备注"
                    rows="3"
                    variant="outlined"
                    density="comfortable"
                    placeholder="请输入比赛相关的特殊说明或备注信息..."
                    prepend-inner-icon="mdi-note-text"
                  ></v-textarea>
                </v-col>
              </v-row>

              <!-- 操作按钮 -->
              <v-row dense class="mt-4">
                <v-col cols="12" class="d-flex justify-end">
                  <v-btn
                    color="grey"
                    variant="outlined"
                    class="mr-3"
                    @click="resetForm"
                    :disabled="isSubmitting"
                  >
                    <v-icon left>mdi-restore</v-icon>
                    重置
                  </v-btn>
                  <v-btn
                    color="#42b883"
                    :loading="isSubmitting"
                    :disabled="!valid || isSubmitting || !selectedSession"
                    @click="submitForm"
                  >
                    <v-icon left>mdi-check</v-icon>
                    提交赛事信息
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>


      </v-col>
    </v-row>

    <!-- 视频预览对话框 -->
    <v-dialog v-model="previewDialog" max-width="800">
      <v-card>
        <v-card-title class="d-flex align-center">
          视频预览
          <v-spacer></v-spacer>
          <v-btn icon @click="previewDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-0">
          <video
            v-if="selectedVideo?.url"
            :src="selectedVideo.url"
            controls
            style="width: 100%; max-height: 500px;"
          ></video>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- 提交成功对话框 -->
    <v-dialog v-model="successDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">
          <v-icon left color="success">mdi-check-circle</v-icon>
          提交成功
        </v-card-title>
        <v-card-text>
          赛事信息已成功提交！该场次的所有视频已标记为已处理。
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="successDialog = false">
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'

// 响应式数据
const form = ref(null)
const valid = ref(false)
const isSubmitting = ref(false)
const loadingVideos = ref(false)
const successDialog = ref(false)
const previewDialog = ref(false)
const playerSearch = ref('')

const selectedSession = ref(null)
const videoList = ref([])

// 比赛项目选项
const eventOptions = [
  '长拳', '南拳', '太极拳', '刀术', '剑术', '枪术', '棍术',
  '南棍', '南刀', '太极剑', '对练', '集体项目'
]

// 比赛级别选项
const levelOptions = [
  '个人赛', '团体赛', '预赛', '决赛', '半决赛', '四分之一决赛'
]

// 视频质量选项
const qualityOptions = [
  '高清 (1080p)', '标清 (720p)', '流畅 (480p)', '自定义'
]

// 选手数据（模拟）
const allPlayers = [
  { id: 1, name: '张三', team: '北京队', number: '001' },
  { id: 2, name: '李四', team: '上海队', number: '002' },
  { id: 3, name: '王五', team: '广东队', number: '003' },
  { id: 4, name: '赵六', team: '四川队', number: '004' },
  { id: 5, name: '陈七', team: '江苏队', number: '005' },
  { id: 6, name: '刘八', team: '浙江队', number: '006' },
  { id: 7, name: '周九', team: '山东队', number: '007' },
  { id: 8, name: '吴十', team: '福建队', number: '008' }
]

// 选手选项（根据搜索过滤）
const filteredPlayers = computed(() => {
  if (!playerSearch.value) return allPlayers
  const search = playerSearch.value.toLowerCase()
  return allPlayers.filter(player => 
    player.name.toLowerCase().includes(search) ||
    player.team.toLowerCase().includes(search) ||
    player.number.includes(search)
  )
})

// 可用视频列表
const availableVideos = computed(() => {
  return videoList.value.flatMap(session => 
    session.videos.map(video => ({
      ...video,
      sessionName: session.sessionName
    }))
  )
})

// 表单数据
const matchForm = reactive({
  matchName: '',
  event: '',
  date: '',
  time: '',
  location: '',
  player: null,
  playerNumber: '',
  playerTeam: '',
  level: '',
  frontCamera: null,
  sideCamera: null,
  overheadCamera: null,
  notes: ''
})

// 选择选手
const onPlayerSelect = (playerId) => {
  if (playerId) {
    const player = allPlayers.find(p => p.id === playerId)
    if (player) {
      matchForm.playerName = player.name
      matchForm.playerTeam = player.team
      matchForm.playerNumber = player.number
    }
  } else {
    matchForm.playerName = ''
    matchForm.playerTeam = ''
    matchForm.playerNumber = ''
  }
}

// 选择场次（包含三个机位的视频）
const selectSession = (session) => {
  selectedSession.value = session
  // 重置表单并关联场次信息
  resetForm()
  // 可以自动填充场次相关信息
  if (session) {
    matchForm.matchName = session.sessionName
    // 从场次名称中提取项目信息（如果有的话）
    const projectMatch = session.sessionName.match(/-(.*?)个人赛|团体赛/)
    if (projectMatch) {
      const project = projectMatch[1]?.trim()
      if (eventOptions.includes(project)) {
        matchForm.event = project
      }
    }
    // 设置时间和地点（如果有的话）
    matchForm.time = session.time
    matchForm.location = session.location
  }
}

// 格式化文件大小
  const formatFileSize = (bytes) => {
    if (!bytes) return '未知'
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  // 格式化时长
  const formatDuration = (seconds) => {
    if (!seconds) return '未知'
    const minutes = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

// 格式化日期
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 预览视频
const previewVideo = () => {
  if (selectedVideo.value) {
    previewDialog.value = true
  }
}

// 加载视频列表
const loadVideoList = async () => {
  loadingVideos.value = true
  try {
    // 模拟加载视频数据 - 按场次分组，每个场次三个机位
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    videoList.value = [
      {
        sessionId: 1,
        sessionName: '场次001 - 长拳个人赛',
        time: '09:30',
        location: '主赛场',
        videos: [
          {
            id: 1,
            filename: '长拳_场次001_机位1_正面.mp4',
            camera: '正面机位',
            duration: 180,
            size: 52428800,
            uploadTime: '2024-01-15T09:35:00Z',
            processed: false,
            url: '/videos/session1_camera1.mp4'
          },
          {
            id: 2,
            filename: '长拳_场次001_机位2_侧面.mp4',
            camera: '侧面机位',
            duration: 180,
            size: 51200000,
            uploadTime: '2024-01-15T09:35:00Z',
            processed: false,
            url: '/videos/session1_camera2.mp4'
          },
          {
            id: 3,
            filename: '长拳_场次001_机位3_俯视.mp4',
            camera: '俯视机位',
            duration: 180,
            size: 49807360,
            uploadTime: '2024-01-15T09:35:00Z',
            processed: false,
            url: '/videos/session1_camera3.mp4'
          }
        ]
      },
      {
        sessionId: 2,
        sessionName: '场次002 - 太极拳个人赛',
        time: '10:15',
        location: '主赛场',
        videos: [
          {
            id: 4,
            filename: '太极拳_场次002_机位1_正面.mp4',
            camera: '正面机位',
            duration: 240,
            size: 78643200,
            uploadTime: '2024-01-15T10:20:00Z',
            processed: false,
            url: '/videos/session2_camera1.mp4'
          },
          {
            id: 5,
            filename: '太极拳_场次002_机位2_侧面.mp4',
            camera: '侧面机位',
            duration: 240,
            size: 76800000,
            uploadTime: '2024-01-15T10:20:00Z',
            processed: false,
            url: '/videos/session2_camera2.mp4'
          },
          {
            id: 6,
            filename: '太极拳_场次002_机位3_俯视.mp4',
            camera: '俯视机位',
            duration: 240,
            size: 75202560,
            uploadTime: '2024-01-15T10:20:00Z',
            processed: false,
            url: '/videos/session2_camera3.mp4'
          }
        ]
      },
      {
        sessionId: 3,
        sessionName: '场次003 - 刀术个人赛',
        time: '11:00',
        location: '主赛场',
        videos: [
          {
            id: 7,
            filename: '刀术_场次003_机位1_正面.mp4',
            camera: '正面机位',
            duration: 150,
            size: 41943040,
            uploadTime: '2024-01-15T11:05:00Z',
            processed: false,
            url: '/videos/session3_camera1.mp4'
          },
          {
            id: 8,
            filename: '刀术_场次003_机位2_侧面.mp4',
            camera: '侧面机位',
            duration: 150,
            size: 40960000,
            uploadTime: '2024-01-15T11:05:00Z',
            processed: false,
            url: '/videos/session3_camera2.mp4'
          },
          {
            id: 9,
            filename: '刀术_场次003_机位3_俯视.mp4',
            camera: '俯视机位',
            duration: 150,
            size: 39845888,
            uploadTime: '2024-01-15T11:05:00Z',
            processed: false,
            url: '/videos/session3_camera3.mp4'
          }
        ]
      }
    ]
  } catch (error) {
    console.error('加载视频列表失败:', error)
  } finally {
    loadingVideos.value = false
  }
}

// 刷新视频列表
const refreshVideoList = () => {
  loadVideoList()
}

// 重置表单
const resetForm = () => {
  if (form.value) {
    form.value.reset()
  }
  Object.assign(matchForm, {
    matchName: '',
    event: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    location: '',
    player: null,
    playerNumber: '',
    playerTeam: '',
    level: '',
    notes: ''
  })
  selectedSession.value = null
}

// 提交表单
const submitForm = async () => {
  if (!form.value.validate()) return
  
  isSubmitting.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 更新整个场次的所有视频状态
    if (selectedSession.value) {
      selectedSession.value.videos.forEach(video => {
        video.processed = true
      })
    }
    
    successDialog.value = true
  } catch (error) {
    console.error('提交失败:', error)
  } finally {
    isSubmitting.value = false
  }
}



// 初始化
onMounted(() => {
  loadVideoList()
})
</script>

<style scoped>
.new-match-container {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  padding: 16px;
}

.video-list-col {
  height: calc(100vh - 32px);
}

.video-list-card {
  height: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.video-scroll-container {
  height: calc(100vh - 140px);
  overflow-y: auto;
}

.video-list {
  padding: 0;
}

.video-item {
  cursor: pointer;
  border-left: 3px solid transparent;
  transition: all 0.2s ease;
}

.video-item:hover {
  background-color: rgba(66, 184, 131, 0.05);
  border-left-color: #42b883;
}

.video-item.selected {
  background-color: rgba(66, 184, 131, 0.1);
  border-left-color: #42b883;
}

.form-card {
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.form-content {
  max-height: calc(100vh - 180px);
  overflow-y: auto;
  padding: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #42b883;
  margin: 16px 0 8px 0;
  padding-left: 8px;
  border-left: 3px solid #42b883;
}

.empty-state-card {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

:deep(.v-field__input) {
  font-size: 14px;
}

:deep(.v-list-item__icon) {
  margin-right: 12px;
}

@media (max-width: 768px) {
  .new-match-container {
    padding: 8px;
  }
  
  .video-list-col {
    height: auto;
    margin-bottom: 16px;
  }
  
  .video-scroll-container {
    height: 300px;
  }
  
  .form-content {
    padding: 16px;
    max-height: none;
  }
}

/* 滚动条样式 */
.video-scroll-container::-webkit-scrollbar {
  width: 6px;
}

.video-scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.video-scroll-container::-webkit-scrollbar-thumb {
  background: #42b883;
  border-radius: 3px;
}

.video-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #369970;
}
.session-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.session-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-color: #42b883;
}

.session-card.processed {
  border-color: #4caf50;
  background-color: rgba(76, 175, 80, 0.05);
  cursor: not-allowed;
  opacity: 0.8;
}

.session-card.selected {
  border-color: #42b883;
  border-width: 2px;
  background-color: rgba(66, 184, 131, 0.05);
  box-shadow: 0 2px 12px rgba(66, 184, 131, 0.2);
}

.session-card.processed:hover {
  border-color: #4caf50;
  box-shadow: none;
}

.session-group {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 8px;
}

.session-group:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

</style>