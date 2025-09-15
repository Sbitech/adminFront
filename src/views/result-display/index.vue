<template>
  <div class="result-display-container">
    <!-- 头部标题 -->
    <div class="header-section">
      <h1 class="main-title">武术比赛结果展示</h1>
      <div class="subtitle">{{ currentDateTime }}</div>
    </div>

    <!-- 主要内容区域 -->
    <div class="content-section">
      <!-- 金牌区域 -->
      <div class="medal-section gold-medal">
        <div class="medal-header">
          <v-icon class="medal-icon" color="amber">mdi-medal</v-icon>
          <span class="medal-title">冠军</span>
        </div>
        <div class="result-card gold">
          <div class="player-info">
            <div class="player-name">{{ goldMedalist?.name || '待定' }}</div>
            <div class="player-id">ID: {{ goldMedalist?.id || '--' }}</div>
            <div class="player-event">{{ goldMedalist?.event || '--' }}</div>
          </div>
          <div class="score-display">
            <span class="score-label">最终得分</span>
            <span class="score-value gold-score">{{ goldMedalist?.score || '--' }}</span>
          </div>
        </div>
      </div>

      <!-- 银牌区域 -->
      <div class="medal-section silver-medal">
        <div class="medal-header">
          <v-icon class="medal-icon" color="blue-grey">mdi-medal</v-icon>
          <span class="medal-title">亚军</span>
        </div>
        <div class="result-card silver">
          <div class="player-info">
            <div class="player-name">{{ silverMedalist?.name || '待定' }}</div>
            <div class="player-id">ID: {{ silverMedalist?.id || '--' }}</div>
            <div class="player-event">{{ silverMedalist?.event || '--' }}</div>
          </div>
          <div class="score-display">
            <span class="score-label">最终得分</span>
            <span class="score-value silver-score">{{ silverMedalist?.score || '--' }}</span>
          </div>
        </div>
      </div>

      <!-- 铜牌区域 -->
      <div class="medal-section bronze-medal">
        <div class="medal-header">
          <v-icon class="medal-icon" color="brown">mdi-medal</v-icon>
          <span class="medal-title">季军</span>
        </div>
        <div class="result-card bronze">
          <div class="player-info">
            <div class="player-name">{{ bronzeMedalist?.name || '待定' }}</div>
            <div class="player-id">ID: {{ bronzeMedalist?.id || '--' }}</div>
            <div class="player-event">{{ bronzeMedalist?.event || '--' }}</div>
          </div>
          <div class="score-display">
            <span class="score-label">最终得分</span>
            <span class="score-value bronze-score">{{ bronzeMedalist?.score || '--' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 完整排名表格 -->
    <div class="ranking-section">
      <v-card class="ranking-card">
        <v-card-title>
          <v-icon left>mdi-trophy</v-icon>
          完整排名
        </v-card-title>
        <v-card-text>
          <div class="ranking-table">
            <div class="table-header">
              <div class="col rank">排名</div>
              <div class="col name">选手姓名</div>
              <div class="col id">选手ID</div>
              <div class="col event">参赛类目</div>
              <div class="col score">最终分数</div>
            </div>
            <div class="table-body">
              <div 
                v-for="(player, index) in sortedResults" 
                :key="player.id"
                class="table-row"
                :class="getRowClass(index)"
              >
                <div class="col rank">
                  <span class="rank-badge" :class="getRankClass(index)">
                    {{ index + 1 }}
                  </span>
                </div>
                <div class="col name">{{ player.name }}</div>
                <div class="col id">{{ player.id }}</div>
                <div class="col event">{{ player.event }}</div>
                <div class="col score" :class="getScoreClass(index)">
                  {{ player.score }}
                </div>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <!-- 实时数据更新提示 -->
    <div class="update-indicator" :class="{ 'updating': isUpdating }">
      <v-icon small>mdi-sync</v-icon>
      <span>{{ updateStatus }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 响应式数据
const results = ref([])
const currentDateTime = ref('')
const isUpdating = ref(false)
const updateStatus = ref('数据已更新')

// 模拟比赛结果数据
const mockResults = [
  { id: 'W001', name: '李小龙', event: '太极拳', score: 9.85 },
  { id: 'W002', name: '王太极', event: '太极拳', score: 9.78 },
  { id: 'W003', name: '张长拳', event: '长拳', score: 9.72 },
  { id: 'W004', name: '陈南拳', event: '南拳', score: 9.65 },
  { id: 'W005', name: '李剑法', event: '剑术', score: 9.58 },
  { id: 'W006', name: '王刀法', event: '刀术', score: 9.52 },
  { id: 'W007', name: '赵枪法', event: '枪术', score: 9.45 },
  { id: 'W008', name: '孙棍法', event: '棍术', score: 9.38 },
  { id: 'W009', name: '周腿法', event: '腿法', score: 9.32 },
  { id: 'W010', name: '吴身法', event: '身法', score: 9.25 }
]

// 计算属性
const sortedResults = computed(() => {
  return [...results.value].sort((a, b) => b.score - a.score)
})

const goldMedalist = computed(() => sortedResults.value[0])
const silverMedalist = computed(() => sortedResults.value[1])
const bronzeMedalist = computed(() => sortedResults.value[2])

// 方法
const updateDateTime = () => {
  const now = new Date()
  currentDateTime.value = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const getRowClass = (index) => {
  if (index === 0) return 'gold-row'
  if (index === 1) return 'silver-row'
  if (index === 2) return 'bronze-row'
  return ''
}

const getRankClass = (index) => {
  if (index === 0) return 'gold-rank'
  if (index === 1) return 'silver-rank'
  if (index === 2) return 'bronze-rank'
  return 'normal-rank'
}

const getScoreClass = (index) => {
  if (index === 0) return 'gold-text'
  if (index === 1) return 'silver-text'
  if (index === 2) return 'bronze-text'
  return 'normal-text'
}

const refreshData = () => {
  isUpdating.value = true
  updateStatus.value = '数据更新中...'
  
  // 模拟API调用
  setTimeout(() => {
    results.value = [...mockResults]
    isUpdating.value = false
    updateStatus.value = '数据已更新'
    
    // 3秒后恢复状态
    setTimeout(() => {
      updateStatus.value = '数据已更新'
    }, 3000)
  }, 1000)
}

const startAutoRefresh = () => {
  // 每30秒自动刷新一次数据
  return setInterval(() => {
    refreshData()
  }, 30000)
}

// 生命周期
onMounted(() => {
  updateDateTime()
  results.value = [...mockResults]
  
  // 每秒更新时间
  const timeInterval = setInterval(updateDateTime, 1000)
  
  // 自动刷新数据
  const refreshInterval = startAutoRefresh()
  
  // 清理定时器
  onUnmounted(() => {
    clearInterval(timeInterval)
    clearInterval(refreshInterval)
  })
})
</script>

<style scoped>
.result-display-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

.header-section {
  text-align: center;
  margin-bottom: 40px;
}

.main-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

.content-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.medal-section {
  text-align: center;
}

.medal-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.medal-icon {
  font-size: 2.5rem;
  margin-right: 10px;
}

.medal-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.result-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 30px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;
}

.result-card:hover {
  transform: translateY(-5px);
}

.player-info {
  margin-bottom: 20px;
}

.player-name {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.player-id {
  font-size: 1rem;
  opacity: 0.8;
  margin-bottom: 5px;
}

.player-event {
  font-size: 1.2rem;
  color: #ffd700;
}

.score-display {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.score-label {
  font-size: 1rem;
  opacity: 0.8;
  margin-bottom: 5px;
}

.score-value {
  font-size: 2.5rem;
  font-weight: bold;
}

.gold-score { color: #ffd700; }
.silver-score { color: #c0c0c0; }
.bronze-score { color: #cd7f32; }

.ranking-section {
  margin-top: 40px;
}

.ranking-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.ranking-table {
  width: 100%;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 80px 200px 120px 150px 100px;
  gap: 20px;
  padding: 15px;
  align-items: center;
}

.table-header {
  font-weight: bold;
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
}

.table-row {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: background-color 0.3s ease;
}

.table-row:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.col {
  text-align: center;
}

.rank-badge {
  display: inline-block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  line-height: 40px;
  font-weight: bold;
  color: white;
}

.gold-rank { background-color: #ffd700; }
.silver-rank { background-color: #c0c0c0; }
.bronze-rank { background-color: #cd7f32; }
.normal-rank { background-color: rgba(255, 255, 255, 0.3); }

.gold-text { color: #ffd700; }
.silver-text { color: #c0c0c0; }
.bronze-text { color: #cd7f32; }

.update-indicator {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.update-indicator.updating {
  background: rgba(76, 175, 80, 0.8);
}

@media (max-width: 768px) {
  .content-section {
    grid-template-columns: 1fr;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .main-title {
    font-size: 2rem;
  }
}
</style>