<template>
  <v-container fluid class="history-detail-container">
    <v-row>
      <v-col cols="12">
        <v-card class="detail-card">
          <div v-if="loading" class="d-flex justify-center align-center" style="height: 400px;">
            <v-progress-circular
              indeterminate
              color="#42b883"
              size="64"
            ></v-progress-circular>
          </div>
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
                {{ formatDateTime(disputeDetail.createTime) }}
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
                        <v-list-item-subtitle>{{ disputeDetail.realName }}</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                        <template v-slot:prepend>
                          <v-icon>mdi-medal</v-icon>
                        </template>
                        <v-list-item-title>比赛项目</v-list-item-title>
                        <v-list-item-subtitle>{{ disputeDetail.name }} - {{ disputeDetail.category }}</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                        <template v-slot:prepend>
                          <v-icon>mdi-star</v-icon>
                        </template>
                        <v-list-item-title>原始评分</v-list-item-title>
                        <v-list-item-subtitle>{{ disputeDetail.score }}分</v-list-item-subtitle>
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
                        <v-list-item-subtitle>{{ disputeDetail.id }}</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                        <template v-slot:prepend>
                          <v-icon>mdi-calendar</v-icon>
                        </template>
                        <v-list-item-title>创建时间</v-list-item-title>
                        <v-list-item-subtitle>{{ formatDateTime(disputeDetail.createTime) }}</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                        <template v-slot:prepend>
                          <v-icon>mdi-format-title</v-icon>
                        </template>
                        <v-list-item-title>争议标题</v-list-item-title>
                        <v-list-item-subtitle>{{ disputeDetail.title }}</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                          <template v-slot:prepend>
                            <v-icon>mdi-information</v-icon>
                          </template>
                          <v-list-item-title>状态</v-list-item-title>
                          <v-list-item-subtitle>
                            <v-chip :color="getStatusColor(disputeDetail.status)" size="small">
                              {{ getStatusText(disputeDetail.status) }}
                            </v-chip>
                          </v-list-item-subtitle>
                        </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- 评分信息 -->
              <v-col cols="12" md="4">
                <v-card variant="outlined" class="info-card">
                  <v-card-title class="text-subtitle-1 font-weight-bold">
                    <v-icon left>mdi-star</v-icon>
                    评分信息
                  </v-card-title>
                  <v-card-text>
                    <v-card class="score-card" color="blue-lighten-5">
                      <v-card-text class="text-center">
                        <div class="text-h4 font-weight-bold text-blue">{{ disputeDetail.score }}</div>
                        <div class="text-caption">原始评分</div>
                      </v-card-text>
                    </v-card>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- 争议详情 -->
              <v-col cols="12" md="8">
                <v-card variant="outlined" class="info-card">
                  <v-card-title class="text-subtitle-1 font-weight-bold">
                    <v-icon left>mdi-file-document</v-icon>
                    争议详情
                  </v-card-title>
                  <v-card-text>
                    <div class="text-h6 mb-2">争议原因</div>
                    <v-card class="pa-4 mb-4" color="red-lighten-5">
                      <div class="text-body-1">{{ disputeDetail.reason }}</div>
                    </v-card>
                    
                    <div v-if="disputeDetail.evidenceUrl" class="text-h6 mb-2">证据链接</div>
                    <v-card v-if="disputeDetail.evidenceUrl" class="pa-4 mb-4" color="purple-lighten-5">
                      <a :href="disputeDetail.evidenceUrl" target="_blank" class="text-body-1" style="color: #42b883;">
                        {{ disputeDetail.evidenceUrl }}
                      </a>
                    </v-card>
                    
                    <div v-if="disputeDetail.reviewOpinion" class="text-h6 mb-2">复核意见</div>
                    <v-card v-if="disputeDetail.reviewOpinion" class="pa-4" color="blue-lighten-5">
                      <div class="text-body-1">{{ disputeDetail.reviewOpinion }}</div>
                    </v-card>
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
                          <td>{{ formatDateTime(disputeDetail.createTime) }}</td>
                          <td><v-chip size="small" :color="getStatusColor(disputeDetail.status)">{{ getStatusText(disputeDetail.status) }}</v-chip></td>
                          <td>{{ disputeDetail.realName }}</td>
                          <td>争议原因：{{ disputeDetail.reason }}</td>
                        </tr>
                        <tr v-if="disputeDetail.reviewTime && disputeDetail.reviewOpinion">
                          <td>{{ formatDateTime(disputeDetail.reviewTime) }}</td>
                          <td><v-chip size="small" color="blue">复核完成</v-chip></td>
                          <td>技术专家组</td>
                          <td>复核意见：{{ disputeDetail.reviewOpinion }}</td>
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
import axios from 'axios'

export default {
  name: 'DisputeDetail',
  setup() {
    const route = useRoute()
    const disputeDetail = ref({
      id: '',
      playMatchId: '',
      title: '',
      reason: '',
      evidenceUrl: '',
      status: '',
      reviewOpinion: '',
      createTime: '',
      reviewTime: '',
      name: '',
      category: '',
      score: 0,
      realName: ''
    })
    const loading = ref(true)

    const loadDisputeDetail = async () => {
      const id = route.params.id
      loading.value = true
      try {
        const response = await axios.get(`http://localhost:9090/disputes/detail/${id}`)
        const data = response.data
        
        // 映射后端数据到前端结构
        disputeDetail.value = {
          id: data.id || '',
          playMatchId: data.playMatchId || '',
          title: data.title || '',
          reason: data.reason || '',
          evidenceUrl: data.evidenceUrl || '',
          status: data.status || '',
          reviewOpinion: data.reviewOpinion || '',
          createTime: data.createTime || '',
          reviewTime: data.reviewTime || '',
          name: data.name || '',
          category: data.category || '',
          score: data.score || 0,
          realName: data.realName || ''
        }
      } catch (error) {
        console.error('获取争议详情失败:', error)
        // 可以添加错误提示
      } finally {
        loading.value = false
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
      const statusText = getStatusText(status)
      const colorMap = {
        '待处理': 'orange',
        '已处理': 'green',
        '驳回': 'red'
      }
      return colorMap[statusText] || 'grey'
    }

    const getStatusText = (status) => {
      const statusMap = {
        0: '待处理',
        1: '已处理',
        2: '驳回'
      }
      return statusMap[status] || status
    }

    onMounted(() => {
      loadDisputeDetail()
    })

    return {
      disputeDetail,
      loading,
      formatDateTime,
      getStatusColor,
      getStatusText
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