<template>
  <v-container fluid class="history-detail-container">
    <v-row>
      <v-col cols="12">
        <v-card class="detail-card">
          <v-card-title class="detail-header">
            <div class="d-flex align-center">
              <v-btn
                icon="mdi-arrow-left"
                variant="text"
                @click="$router.push('/history')"
                class="mr-3"
              ></v-btn>
              <v-icon left size="28" color="#42b883">mdi-file-document-outline</v-icon>
              评分详情记录
            </div>
            <v-chip color="#42b883" variant="elevated">
              {{ formatDateTime(detailData.datetime) }}
            </v-chip>
          </v-card-title>

          <v-card-text>
            <v-row>
              <!-- 基本信息卡片 -->
              <v-col cols="12" md="6">
                <v-card variant="outlined" class="info-card">
                  <v-card-title class="text-subtitle-1 font-weight-bold">
                    <v-icon left>mdi-account</v-icon>
                    选手信息
                  </v-card-title>
                  <v-card-text>
                    <v-list density="compact">
                      <v-list-item>
                        <template v-slot:prepend>
                          <v-icon>mdi-account-circle</v-icon>
                        </template>
                        <v-list-item-title>选手姓名</v-list-item-title>
                        <v-list-item-subtitle>{{ detailData.playerName }}</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                        <template v-slot:prepend>
                          <v-icon>mdi-medal</v-icon>
                        </template>
                        <v-list-item-title>比赛项目</v-list-item-title>
                        <v-list-item-subtitle>{{ detailData.event }}</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                        <template v-slot:prepend>
                          <v-icon>mdi-clock</v-icon>
                        </template>
                        <v-list-item-title>比赛时间</v-list-item-title>
                        <v-list-item-subtitle>{{ formatDateTime(detailData.datetime) }}</v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- 评分信息卡片 -->
              <v-col cols="12" md="6">
                <v-card variant="outlined" class="info-card">
                  <v-card-title class="text-subtitle-1 font-weight-bold">
                    <v-icon left>mdi-star</v-icon>
                    评分结果
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" sm="4">
                        <v-card class="score-card" color="blue-lighten-5">
                          <v-card-text class="text-center">
                            <div class="text-h5 font-weight-bold text-blue">{{ detailData.aiScore }}</div>
                            <div class="text-caption">AI评分</div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <v-card class="score-card" color="green-lighten-5">
                          <v-card-text class="text-center">
                            <div class="text-h5 font-weight-bold text-green">{{ detailData.manualScore }}</div>
                            <div class="text-caption">人工评分</div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <v-card class="score-card" color="purple-lighten-5">
                          <v-card-text class="text-center">
                            <div class="text-h5 font-weight-bold text-purple">{{ detailData.finalScore }}</div>
                            <div class="text-caption">最终评分</div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- 详细评分过程 -->
              <v-col cols="12">
                <v-card variant="outlined" class="info-card">
                  <v-card-title class="text-subtitle-1 font-weight-bold">
                    <v-icon left>mdi-chart-line</v-icon>
                    评分过程分析
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" md="8">
                        <v-timeline density="compact">
                          <v-timeline-item
                            dot-color="blue"
                            size="small"
                          >
                            <div class="d-flex justify-space-between align-center">
                              <div>
                                <strong>AI评分阶段</strong>
                                <div class="text-caption">AI系统完成自动评分</div>
                              </div>
                              <v-chip size="small" color="blue">{{ detailData.aiScore }}分</v-chip>
                            </div>
                          </v-timeline-item>
                          <v-timeline-item
                            dot-color="green"
                            size="small"
                          >
                            <div class="d-flex justify-space-between align-center">
                              <div>
                                <strong>人工复核阶段</strong>
                                <div class="text-caption">裁判进行人工评分调整</div>
                              </div>
                              <v-chip size="small" color="green">{{ detailData.manualScore }}分</v-chip>
                            </div>
                          </v-timeline-item>
                          <v-timeline-item
                            dot-color="purple"
                            size="small"
                          >
                            <div class="d-flex justify-space-between align-center">
                              <div>
                                <strong>最终确认</strong>
                                <div class="text-caption">综合评分结果确认</div>
                              </div>
                              <v-chip size="small" color="purple">{{ detailData.finalScore }}分</v-chip>
                            </div>
                          </v-timeline-item>
                        </v-timeline>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-card class="stats-card" color="grey-lighten-4">
                          <v-card-text>
                            <div class="text-center">
                              <v-icon size="48" color="grey">mdi-information</v-icon>
                              <div class="text-h6 mt-2">评分说明</div>
                              <div class="text-caption mt-2">
                                最终评分为AI评分与人工评分的加权平均值，
                                确保评分的客观性与准确性。
                              </div>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- 操作记录 -->
              <v-col cols="12">
                <v-card variant="outlined" class="info-card">
                  <v-card-title class="text-subtitle-1 font-weight-bold">
                    <v-icon left>mdi-history</v-icon>
                    操作记录
                  </v-card-title>
                  <v-card-text>
                    <v-table density="compact">
                      <thead>
                        <tr>
                          <th>时间</th>
                          <th>操作类型</th>
                          <th>操作人</th>
                          <th>备注</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{{ detailData.datetime }}</td>
                          <td><v-chip size="small" color="blue">AI评分</v-chip></td>
                          <td>系统自动</td>
                          <td>AI完成自动评分分析</td>
                        </tr>
                        <tr>
                          <td>{{ detailData.datetime }}</td>
                          <td><v-chip size="small" color="green">人工复核</v-chip></td>
                          <td>裁判组</td>
                          <td>人工评分确认与调整</td>
                        </tr>
                        <tr>
                          <td>{{ detailData.datetime }}</td>
                          <td><v-chip size="small" color="purple">结果确认</v-chip></td>
                          <td>系统管理员</td>
                          <td>最终评分结果确认</td>
                        </tr>
                      </tbody>
                    </v-table>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions class="pa-4">
            <v-spacer></v-spacer>
            <v-btn
              color="grey"
              variant="outlined"
              @click="$router.push('/history')"
            >
              <v-icon left>mdi-arrow-left</v-icon>
              返回列表
            </v-btn>
            <v-btn
              color="#42b883"
              @click="exportDetail"
            >
              <v-icon left>mdi-download</v-icon>
              导出详情
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 详情数据
const detailData = ref({
  id: route.params.id || '1',
  datetime: '2024-01-15 10:30:00',
  playerName: '张三',
  event: '太极拳',
  aiScore: 8.5,
  manualScore: 8.3,
  finalScore: 8.4,
  duration: '2分15秒',
  judge: '李裁判',
  status: '已完成',
  notes: '动作规范，节奏准确'
})

// 格式化日期时间
const formatDateTime = (datetime) => {
  if (!datetime) return ''
  const date = new Date(datetime)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 导出详情
const exportDetail = () => {
  // 模拟导出功能
  const data = {
    ...detailData.value,
    exportTime: new Date().toLocaleString('zh-CN')
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `评分详情_${detailData.value.playerName}_${detailData.value.event}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  
  // 提示用户
  alert('详情已导出！')
}

// 加载详情数据
onMounted(() => {
  // 这里可以根据route.params.id从API获取真实数据
  console.log('加载详情数据，ID:', route.params.id)
})
</script>

<style scoped>
.history-detail-container {
  background-color: #f0f2f5;
  background-image: linear-gradient(135deg, #f0f2f5 0%, #e4e7ed 100%);
  min-height: auto;
  padding: 20px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}

.detail-card {
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.info-card {
  border-radius: 12px;
  margin-bottom: 20px;
  border: 1px solid #e0e0e0;
}

.score-card {
  border-radius: 12px;
  text-align: center;
}

.stats-card {
  border-radius: 12px;
  height: 100%;
  display: flex;
  align-items: center;
}

:deep(.v-timeline-item__dot) {
  background-color: white;
}

:deep(.v-timeline-item__body) {
  padding-left: 16px;
}

@media (max-width: 960px) {
  .detail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}
</style>