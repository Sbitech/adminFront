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

    <!-- 招式评分详情表格 -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon left>mdi-sword</v-icon>
            招式评分详情
          </v-card-title>
          <v-card-text>
            <v-table class="movement-score-table">
              <thead>
                <tr>
                  <th class="text-left">招式名称</th>
                  <th class="text-right">基础分</th>
                  <th class="text-right">难度分</th>
                  <th class="text-right">完成分</th>
                  <th class="text-right">扣分</th>
                  <th class="text-right">得分</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(movement, index) in movements" :key="index">
                  <td>{{ movement.name }}</td>
                  <td class="text-right">{{ movement.baseScore.toFixed(2) }}</td>
                  <td class="text-right">{{ movement.difficultyScore.toFixed(2) }}</td>
                  <td class="text-right">{{ movement.completionScore.toFixed(2) }}</td>
                  <td class="text-right text-red">{{ movement.deduction.toFixed(2) }}</td>
                  <td class="text-right font-weight-bold">{{ calculateFinalScore(movement).toFixed(2) }}</td>
                </tr>
                <!-- 汇总行 -->
                <tr class="summary-row">
                  <td><strong>总计</strong></td>
                  <td class="text-right"><strong>{{ totalBaseScore.toFixed(2) }}</strong></td>
                  <td class="text-right"><strong>{{ totalDifficultyScore.toFixed(2) }}</strong></td>
                  <td class="text-right"><strong>{{ totalCompletionScore.toFixed(2) }}</strong></td>
                  <td class="text-right text-red"><strong>{{ totalDeduction.toFixed(2) }}</strong></td>
                  <td class="text-right"><strong>{{ subtotalScore.toFixed(2) }}</strong></td>
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
  return movements.value.reduce((sum, movement) => sum + calculateFinalScore(movement), 0)
})
const finalPenaltyScore = computed(() => {
  return movements.value.reduce((sum, movement) => sum + movement.deduction, 0)
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

// 招式评分数据
const movements = ref([
  { name: '起势', baseScore: 9.20, difficultyScore: 2.0, completionScore: 9.20, deduction: 0.20 },
  { name: '野马分鬃', baseScore: 9.50, difficultyScore: 2.5, completionScore: 9.50, deduction: 0.15 },
  { name: '白鹤亮翅', baseScore: 9.30, difficultyScore: 2.3, completionScore: 9.30, deduction: 0.10 },
  { name: '搂膝拗步', baseScore: 9.40, difficultyScore: 2.4, completionScore: 9.40, deduction: 0.25 },
  { name: '手挥琵琶', baseScore: 9.10, difficultyScore: 2.2, completionScore: 9.10, deduction: 0.30 },
  { name: '倒卷肱', baseScore: 9.60, difficultyScore: 2.6, completionScore: 9.60, deduction: 0.20 },
  { name: '左揽雀尾', baseScore: 9.70, difficultyScore: 2.7, completionScore: 9.70, deduction: 0.15 },
  { name: '右揽雀尾', baseScore: 9.50, difficultyScore: 2.5, completionScore: 9.50, deduction: 0.10 }
])

// 计算属性 - 单个招式最终得分（基础分 + 难度分 + 完成分 - 扣分）
const calculateFinalScore = (movement) => {
  return movement.baseScore + movement.difficultyScore + movement.completionScore - movement.deduction
}

// 计算属性 - 汇总数据
const totalBaseScore = computed(() => {
  return movements.value.reduce((sum, movement) => sum + movement.baseScore, 0)
})

const totalDifficultyScore = computed(() => {
  return movements.value.reduce((sum, movement) => sum + movement.difficultyScore, 0)
})

const totalCompletionScore = computed(() => {
  return movements.value.reduce((sum, movement) => sum + movement.completionScore, 0)
})

const totalDeduction = computed(() => {
  return movements.value.reduce((sum, movement) => sum + movement.deduction, 0)
})

const subtotalScore = computed(() => {
  return movements.value.reduce((sum, movement) => sum + calculateFinalScore(movement), 0)
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
  font-size: 3.5rem;
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

/* 全屏时的额外样式 */
:deep(.v-main) {
  transition: padding 0.3s ease;
}

</style>