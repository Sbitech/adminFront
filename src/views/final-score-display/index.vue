<template>
  <v-container fluid class="final-score-page">
    
    <!-- 全屏控制按钮 -->
    <v-row class="fullscreen-control">
      <v-col cols="12" class="text-right">
        <v-btn
          icon
          size="small"
          :color="isFullscreen ? 'primary' : 'default'"
          @click="toggleFullscreen"
          class="fullscreen-btn"
        >
          <v-icon>{{ isFullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen' }}</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  
    <!-- 选手信息卡片 -->
    <v-row>
      <v-col cols="12">
        <v-card class="player-info-card">
          <v-card-text>
            <div class="player-info">
              <div class="player-name">{{ currentPlayer.name }}</div>
              <div class="player-details">
                <div>编号: {{ currentPlayer.id }}</div>
                <div>组别: {{ currentPlayer.group }}</div>
                <div>项目: {{ currentMatch.event }}</div>
              </div>
            </div>
            <div class="final-score-display">
              <div class="score-label">最终得分</div>
              <div class="final-score">{{ finalTotalScore.toFixed(2) }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 裁判评分列表 -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon left>mdi-account-judge</v-icon>
            裁判评分列表
          </v-card-title>
          <v-card-text>
            <v-table class="judge-score-table">
              <thead>
                <tr>
                  <th class="text-left">裁判姓名</th>
                  <th class="text-center">裁判角色</th>
                  <th class="text-right">质量分</th>
                  <th class="text-right">难度分</th>
                  <th class="text-right">完成分</th>
                  <th class="text-right">综合评分</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(judge, index) in judgeScores" :key="index">
                  <td>
                    <div class="judge-info">
                      {{ judge.name }}
                    </div>
                  </td>
                  <td class="text-center">
                    <v-chip :color="getRoleColor(judge.role)" size="small" variant="flat">
                      {{ judge.role }}
                    </v-chip>
                  </td>
                  <td class="text-right">{{ judge.qualityScore.toFixed(1) }}</td>
                  <td class="text-right">{{ judge.difficultyScore.toFixed(1) }}</td>
                  <td class="text-right">{{ judge.completionScore.toFixed(1) }}</td>
                  <td class="text-right font-weight-bold">{{ judge.totalScore.toFixed(1) }}</td>
                </tr>
                <!-- 平均分汇总行 -->
                <tr class="average-row">
                  <td colspan="2"><strong>平均分</strong></td>
                  <td class="text-right"><strong>{{ averageQualityScore.toFixed(1) }}</strong></td>
                  <td class="text-right"><strong>{{ averageDifficultyScore.toFixed(1) }}</strong></td>
                  <td class="text-right"><strong>{{ averageCompletionScore.toFixed(1) }}</strong></td>
                  <td class="text-right"><strong>{{ averageTotalScore.toFixed(1) }}</strong></td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 响应式数据
const currentMatch = ref({
  session: '场次 001',
  event: '太极拳',
  time: '2024-01-01 10:00',
  chiefJudge: '张裁判'
})

const currentPlayer = ref({
  id: 'W001',
  name: '李小龙',
  event: '太极拳',
  group: '成人组'
})

// 最终评分数据
const finalTotalScore = computed(() => {
  return averageTotalScore.value
})
const finalPenaltyScore = computed(() => {
  return 0 // 裁判评分模式下不显示扣分
})

// 全屏状态管理
const isFullscreen = ref(false)

// 切换全屏状态
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  
  // 触发自定义事件通知布局组件
  const event = new CustomEvent('toggleFullscreen', {
    detail: { isFullscreen: isFullscreen.value }
  })
  window.dispatchEvent(event)
}

// 监听全屏状态变化
const handleFullscreenChange = (event) => {
  isFullscreen.value = event.detail.isFullscreen
}

onMounted(() => {
  window.addEventListener('fullscreenChanged', handleFullscreenChange)
})

onUnmounted(() => {
  window.removeEventListener('fullscreenChanged', handleFullscreenChange)
})

// 裁判评分数据
  const judgeScores = ref([
    {
      name: '张裁判',
      role: '主裁判',
      qualityScore: 8.3,
      difficultyScore: 8.5,
      completionScore: 9.0,
      totalScore: 17.5,
      status: '已评分'
    },
    {
      name: '李裁判',
      role: '副裁判',
      qualityScore: 8.1,
      difficultyScore: 8.2,
      completionScore: 8.8,
      totalScore: 17.0,
      status: '已评分'
    },
    {
      name: '王裁判',
      role: '副裁判',
      qualityScore: 8.6,
      difficultyScore: 8.7,
      completionScore: 9.1,
      totalScore: 17.8,
      status: '已评分'
    },
    {
      name: '赵裁判',
      role: '副裁判',
      qualityScore: 7.9,
      difficultyScore: 8.3,
      completionScore: 8.9,
      totalScore: 17.2,
      status: '已评分'
    },
    {
      name: '陈裁判',
      role: '副裁判',
      qualityScore: 8.2,
      difficultyScore: 8.6,
      completionScore: 8.7,
      totalScore: 17.3,
      status: '已评分'
    }
  ])

// 获取角色颜色
const getRoleColor = (role) => {
  const colorMap = {
    '主裁判': 'error',
    '副裁判': 'warning',
    '技术裁判': 'info',
    '助理裁判': 'success'
  }
  return colorMap[role] || 'default'
}

// 获取状态颜色
const getStatusColor = (status) => {
  const colorMap = {
    '已评分': 'success',
    '评分中': 'warning',
    '未评分': 'default'
  }
  return colorMap[status] || 'default'
}

// 计算属性 - 裁判评分汇总数据
const averageQualityScore = computed(() => {
  const validScores = judgeScores.value.filter(judge => judge.status === '已评分')
  if (validScores.length === 0) return 0
  const sum = validScores.reduce((sum, judge) => sum + judge.qualityScore, 0)
  return sum / validScores.length
})

const averageDifficultyScore = computed(() => {
  const validScores = judgeScores.value.filter(judge => judge.status === '已评分')
  if (validScores.length === 0) return 0
  const sum = validScores.reduce((sum, judge) => sum + judge.difficultyScore, 0)
  return sum / validScores.length
})

const averageCompletionScore = computed(() => {
  const validScores = judgeScores.value.filter(judge => judge.status === '已评分')
  if (validScores.length === 0) return 0
  const sum = validScores.reduce((sum, judge) => sum + judge.completionScore, 0)
  return sum / validScores.length
})

const averageTotalScore = computed(() => {
  const validScores = judgeScores.value.filter(judge => judge.status === '已评分')
  if (validScores.length === 0) return 0
  const sum = validScores.reduce((sum, judge) => sum + judge.totalScore, 0)
  return sum / validScores.length
})
</script>

<style scoped>
.final-score-page {
  padding: 10px;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
}

.player-info-card {
  margin-bottom: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.player-info-card .v-card-text {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
}

.player-info .player-name {
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 10px;
}

.player-details {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.player-details div {
  font-size: 1.1rem;
  color: #666;
}

.final-score-display {
  text-align: center;
}

.score-label {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 10px;
}

.final-score {
  font-size: 5rem;
  font-weight: bold;
  color: #42b883;
}

.score-table {
  border-radius: 8px;
  overflow: hidden;
}

.penalty-row {
  background-color: #ffebee;
}

.total-row {
  background-color: #e8f5e8;
  font-weight: bold;
}

.v-table th {
  background-color: #f5f5f5;
  font-weight: bold;
}

.v-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.v-card-title {
  font-size: 1.3rem;
  font-weight: 500;
  color: #2c3e50;
}

.movement-score-table {
  border-radius: 8px;
  overflow: hidden;
}

.movement-score-table tbody tr:hover {
  background-color: #f5f5f5;
}

.movement-score-table td {
  padding: 12px 16px;
}

.movement-score-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
  padding: 16px;
}

.summary-row {
  background-color: #f0f8ff;
  border-top: 2px solid #3498db;
}

.penalty-row {
  background-color: #ffebee;
}

.total-row {
  background-color: #e8f5e8;
  border-top: 2px solid #42b883;
}

@media (max-width: 768px) {
  .player-info-card .v-card-text {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .final-score {
    font-size: 2.5rem;
  }
}
.fullscreen-control {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
}

.fullscreen-btn {
  opacity: 0.7;
  transition: opacity 0.3s ease;
  background-color: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.fullscreen-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

/* 全屏模式下的样式调整 */
:deep(.v-navigation-drawer),
:deep(.v-app-bar) {
  transition: all 0.3s ease;
}

/* 全屏模式下的页面调整 */
.final-score-page {
  transition: padding 0.3s ease;
}

/* 裁判评分表格样式 */
  .judge-score-table {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .judge-score-table th {
    background-color: #f5f5f5;
    font-weight: 600;
    color: #333;
    border-bottom: 2px solid #e0e0e0;
    font-size: 1.3rem;
    padding: 16px 20px;
  }
  
  .judge-score-table td {
    border-bottom: 1px solid #f0f0f0;
    padding: 16px 20px;
    font-size: 1.2rem;
  }
  
  .judge-score-table tbody tr:hover {
    background-color: #fafafa;
  }
  
  .judge-info {
    display: flex;
    align-items: center;
    font-weight: 500;
  }
  
  .average-row {
    background-color: #e3f2fd;
    font-weight: bold;
  }
  
  .average-row td {
    border-top: 2px solid #1976d2;
  }

/* 全屏时的额外样式 */
:deep(.v-main) {
  transition: padding 0.3s ease;
}

</style>