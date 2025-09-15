<template>
  <v-container fluid class="final-score-page">
  
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
                  <th class="text-right">得分</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(movement, index) in movements" :key="index">
                  <td>{{ movement.name }}</td>
                  <td class="text-right">{{ movement.baseScore.toFixed(2) }}</td>
                  <td class="text-right">{{ movement.difficultyScore.toFixed(2) }}</td>
                  <td class="text-right">{{ movement.completionScore.toFixed(2) }}</td>
                  <td class="text-right font-weight-bold">{{ movement.finalScore.toFixed(2) }}</td>
                </tr>
                <!-- 汇总行 -->
                <tr class="summary-row">
                  <td><strong>总计</strong></td>
                  <td class="text-right"><strong>{{ totalBaseScore.toFixed(2) }}</strong></td>
                  <td class="text-right"><strong>{{ totalDifficultyScore.toFixed(2) }}</strong></td>
                  <td class="text-right"><strong>{{ totalCompletionScore.toFixed(2) }}</strong></td>
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
import { ref, computed } from 'vue'

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
const finalTotalScore = ref(75.30)
const finalPenaltyScore = ref(1.40)

// 招式评分数据
const movements = ref([
  { name: '起势', baseScore: 9.20, difficultyScore: 2.0, completionScore: 9.20, finalScore: 9.20 },
  { name: '野马分鬃', baseScore: 9.50, difficultyScore: 2.5, completionScore: 9.50, finalScore: 9.50 },
  { name: '白鹤亮翅', baseScore: 9.30, difficultyScore: 2.3, completionScore: 9.30, finalScore: 9.30 },
  { name: '搂膝拗步', baseScore: 9.40, difficultyScore: 2.4, completionScore: 9.40, finalScore: 9.40 },
  { name: '手挥琵琶', baseScore: 9.10, difficultyScore: 2.2, completionScore: 9.10, finalScore: 9.10 },
  { name: '倒卷肱', baseScore: 9.60, difficultyScore: 2.6, completionScore: 9.60, finalScore: 9.60 },
  { name: '左揽雀尾', baseScore: 9.70, difficultyScore: 2.7, completionScore: 9.70, finalScore: 9.70 },
  { name: '右揽雀尾', baseScore: 9.50, difficultyScore: 2.5, completionScore: 9.50, finalScore: 9.50 }
])

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

const subtotalScore = computed(() => {
  return movements.value.reduce((sum, movement) => sum + movement.finalScore, 0)
})
</script>

<style scoped>
.final-score-page {
  padding: 20px;
  background-color: #f5f5f5;
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
</style>