<template>
  <v-container fluid class="history-detail-container">
    <v-row>
      <v-col cols="12">
        <v-card class="detail-card">
          <v-card-title class="detail-header" style="background-color: transparent; color: #333;">
            <div class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <v-btn
                  icon="mdi-arrow-left"
                  variant="text"
                  @click="$router.push('/dispute')"
                  class="mr-3"
                ></v-btn>
                <v-icon left size="28" color="#42b883" class="mr-2">mdi-alert-circle-outline</v-icon>
                争议详情记录
              </div>
              <v-chip color="#42b883" variant="elevated">
                {{ formatDateTime(disputeDetail.createdAt) }}
              </v-chip>
            </div>
          </v-card-title>

          <v-card-text>
            <v-row>
              <!-- 选手基本信息卡片 -->
              <v-col cols="12" md="6">
                <v-card variant="outlined" class="info-card">
                  <v-card-title class="text-subtitle-1 font-weight-bold" style="background-color: transparent;">
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
                        <v-list-item-subtitle>{{ disputeDetail.playerName }}</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                        <template v-slot:prepend>
                          <v-icon>mdi-medal</v-icon>
                        </template>
                        <v-list-item-title>比赛项目</v-list-item-title>
                        <v-list-item-subtitle>{{ disputeDetail.event }}</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                        <template v-slot:prepend>
                          <v-icon>mdi-clock</v-icon>
                        </template>
                        <v-list-item-title>比赛时间</v-list-item-title>
                        <v-list-item-subtitle>{{ formatDateTime(disputeDetail.matchTime) }}</v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- 争议信息卡片 -->
              <v-col cols="12" md="6">
                <v-card variant="outlined" class="info-card">
                  <v-card-title class="text-subtitle-1 font-weight-bold">
                    <v-icon left>mdi-alert</v-icon>
                    争议信息
                  </v-card-title>
                  <v-card-text>
                    <v-list density="compact">
                      <v-list-item>
                        <template v-slot:prepend>
                          <v-icon>mdi-identifier</v-icon>
                        </template>
                        <v-list-item-title>案件编号</v-list-item-title>
                        <v-list-item-subtitle>{{ disputeDetail.caseNo }}</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                        <template v-slot:prepend>
                          <v-icon>mdi-calendar</v-icon>
                        </template>
                        <v-list-item-title>创建时间</v-list-item-title>
                        <v-list-item-subtitle>{{ formatDateTime(disputeDetail.createdAt) }}</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                        <template v-slot:prepend>
                          <v-icon>mdi-information</v-icon>
                        </template>
                        <v-list-item-title>状态</v-list-item-title>
                        <v-list-item-subtitle>
                          <v-chip :color="getStatusColor(disputeDetail.status)" size="small">
                            {{ disputeDetail.status }}
                          </v-chip>
                        </v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- 评分对比分析 -->
              <v-col cols="12">
                <v-card variant="outlined" class="info-card">
                  <v-card-title class="text-subtitle-1 font-weight-bold">
                    <v-icon left>mdi-chart-compare</v-icon>
                    评分对比分析
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" sm="4">
                        <v-card class="score-card" color="blue-lighten-5">
                          <v-card-text class="text-center">
                            <div class="text-h5 font-weight-bold text-blue">{{ disputeDetail.originalScore }}</div>
                            <div class="text-caption">原始评分</div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <v-card class="score-card" color="red-lighten-5">
                          <v-card-text class="text-center">
                            <div class="text-h5 font-weight-bold text-red">{{ disputeDetail.disputeScore }}</div>
                            <div class="text-caption">争议评分</div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <v-card class="score-card" color="green-lighten-5">
                          <v-card-text class="text-center">
                            <div class="text-h5 font-weight-bold text-green">{{ disputeDetail.finalScore }}</div>
                            <div class="text-caption">复核评分</div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- 争议原因和技术分析 -->
              <v-col cols="12">
                <v-card variant="outlined" class="info-card">
                  <v-card-title class="text-subtitle-1 font-weight-bold">
                    <v-icon left>mdi-file-document</v-icon>
                    争议原因与技术分析
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" md="8">
                        <div class="text-h6 mb-2">争议原因</div>
                        <v-card class="pa-4 mb-4" color="red-lighten-5">
                          <div class="text-body-1">{{ disputeDetail.reason }}</div>
                        </v-card>
                        
                        <div class="text-h6 mb-2">技术分析</div>
                        <v-card class="pa-4" color="blue-lighten-5">
                          <div class="text-body-1">{{ disputeDetail.analysis }}</div>
                        </v-card>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-card class="stats-card" color="grey-lighten-4">
                          <v-card-text>
                            <div class="text-center">
                              <v-icon size="48" color="grey">mdi-information</v-icon>
                              <div class="text-h6 mt-2">复核说明</div>
                              <div class="text-caption mt-2">
                                争议处理经过技术专家分析，
                                结合评分标准和比赛规则进行最终判定。
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
                          <td>{{ formatDateTime(disputeDetail.createdAt) }}</td>
                          <td><v-chip size="small" color="red">争议提出</v-chip></td>
                          <td>{{ disputeDetail.playerName }}</td>
                          <td>争议原因：{{ disputeDetail.reason }}</td>
                        </tr>
                        <tr>
                          <td>{{ formatDateTime(disputeDetail.reviewTime) }}</td>
                          <td><v-chip size="small" color="blue">技术审核</v-chip></td>
                          <td>技术专家组</td>
                          <td>技术分析完成，确认评分调整</td>
                        </tr>
                        <tr>
                          <td>{{ formatDateTime(disputeDetail.resolveTime) }}</td>
                          <td><v-chip size="small" color="green">争议解决</v-chip></td>
                          <td>裁判长</td>
                          <td>争议处理完成，最终评分：{{ disputeDetail.finalScore }}分</td>
                        </tr>
                      </tbody>
                    </v-table>
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

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'DisputeDetail',
  setup() {
    const route = useRoute()
    const disputeDetail = ref({
      caseNo: '',
      playerName: '',
      event: '',
      matchTime: '',
      createdAt: '',
      status: '',
      originalScore: 0,
      disputeScore: 0,
      finalScore: 0,
      reason: '',
      analysis: '',
      reviewTime: '',
      resolveTime: ''
    })

    const loadDisputeDetail = () => {
      const id = route.params.id
      disputeDetail.value = {
        caseNo: `DSP-2024-${String(id).padStart(3, '0')}`,
        playerName: '张武术',
        event: '男子长拳',
        matchTime: '2024-01-15 14:30:00',
        createdAt: '2024-01-15 15:45:00',
        status: '已解决',
        originalScore: 8.5,
        disputeScore: 9.2,
        finalScore: 8.8,
        reason: '认为动作完成度评分偏低，特别是腾空飞脚的高度和远度',
        analysis: '经技术专家组复核，原评分8.5分确实偏低。选手腾空飞脚动作标准，高度和远度均达到优秀水平，应给予更高评分。综合考虑动作难度系数和完成质量，最终调整为8.8分。',
        reviewTime: '2024-01-15 16:30:00',
        resolveTime: '2024-01-15 17:00:00'
      }
    }

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

    const getStatusColor = (status) => {
      const colorMap = {
        '待处理': 'orange',
        '处理中': 'blue',
        '已解决': 'green',
        '已拒绝': 'red'
      }
      return colorMap[status] || 'grey'
    }

    onMounted(() => {
      loadDisputeDetail()
    })

    return {
      disputeDetail,
      formatDateTime,
      getStatusColor
    }
  }
}
</script>

<style scoped>
.history-detail-container {
  padding: 24px;
}

.detail-card {
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.detail-header {
  background-color: transparent;
  color: #333;
  padding: 20px 24px 0px 24px;
  border-radius: 8px 8px 0 0;
  border: none;
}

.info-card {
  border-radius: 12px;
  border-color: #e0e0e0;
}

.score-card {
  border-radius: 12px;
}

.stats-card {
  border-radius: 12px;
}

@media (max-width: 600px) {
  .history-detail-container {
    padding: 12px;
  }
  
  .detail-header {
    padding: 16px;
  }
}
</style>