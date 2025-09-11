<template>
  <v-container fluid class="history-detail-container">
    <v-row>
      <v-col cols="12">
        <v-card class="detail-card">
          <div v-if="loading" class="d-flex justify-center align-center" style="height: 400px;">
            <v-progress-circular indeterminate color="#42b883" size="64"></v-progress-circular>
          </div>
          <v-card-title class="detail-header" style="background-color: transparent; color: #333;">
            <div class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <v-btn icon="mdi-arrow-left" variant="text" @click="$router.push('/dispute')" class="mr-3"></v-btn>
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
                        <v-list-item-subtitle>{{ disputeDetail.name }} - {{ disputeDetail.category
                        }}</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                        <template v-slot:prepend>
                          <v-icon>mdi-star</v-icon>
                        </template>
                        <v-list-item-title>评分</v-list-item-title>
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
                        <v-chip size="small" :color="getStatusColor(disputeDetail.status)"
                          :class="{ 'font-weight-bold': true, 'text-red': disputeDetail.status === 2 || getStatusText(disputeDetail.status) === '驳回' }">
                          <span class="font-weight-bold">{{ getStatusText(disputeDetail.status) }}</span>
                        </v-chip>
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
                        <div class="text-caption">评分</div>
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

            </v-row>

            <!-- 争议处理区域 - 仅当状态为待处理时显示 -->
            <v-row v-if="disputeDetail.status === '0'">
              <v-col cols="12">
                <v-card variant="outlined" class="info-card">
                  <v-card-title class="text-subtitle-1 font-weight-bold">
                    <v-icon left>mdi-gavel</v-icon>
                    争议处理
                  </v-card-title>
                  <v-card-text>
                    <v-form ref="disputeForm" v-model="formValid">
                      <v-row>
                        <v-col cols="12" md="4">
                          <v-select v-model="actionType" :items="actionOptions" label="处理操作"
                            :rules="[v => !!v || '请选择处理操作']" variant="outlined" density="comfortable"
                            required></v-select>
                        </v-col>
                        <v-col cols="12" md="8" v-if="actionType === '处理争议'">
                          <v-text-field v-model.number="newScore" label="修改分数" type="number" variant="outlined"
                            density="comfortable" suffix="分" :rules="[
                              v => v !== null && v !== '' || '请输入分数',
                              v => v >= 0 && v <= 100 || '分数必须在0-100之间'
                            ]" required></v-text-field>
                        </v-col>
                        <v-col cols="12" md="8" v-else-if="actionType === '驳回'">
                          <v-card color="red-lighten-1" variant="outlined" class="pa-3">
                            <div class="text-subtitle-2 text-red">
                              驳回说明
                            </div>
                            <div class="text-caption mt-1">选择驳回后，该争议将被标记为已驳回状态</div>
                          </v-card>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col cols="12">
                          <v-textarea v-model="reviewOpinion" label="复核意见" :rules="[v => !!v || '请输入复核意见']" rows="4"
                            variant="outlined" density="comfortable" placeholder="请详细说明复核理由和处理依据..."
                            required></v-textarea>
                        </v-col>
                      </v-row>

                      <v-divider class="my-4"></v-divider>

                      <v-row>
                        <v-col cols="12" class="d-flex justify-end ga-3">
                          <v-btn color="grey" variant="text" @click="resetForm" :disabled="submitting">
                            重置
                          </v-btn>
                          <v-btn color="success" variant="elevated" @click="submitDispute" :loading="submitting"
                            :disabled="!formValid">
                            确认处理
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- 操作记录 -->
            <v-row>
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
                          <td>
                            <v-chip size="small" :color="getStatusColor(disputeDetail.status)"
                              :class="{ 'font-weight-bold': true, 'text-red': disputeDetail.status === 2 || getStatusText(disputeDetail.status) === '驳回' }">
                              <span class="font-weight-bold">{{ getStatusText(disputeDetail.status) }}</span>
                            </v-chip>
                          </td>
                          <td>{{ disputeDetail.realName }}</td>
                          <td>争议原因：{{ disputeDetail.reason }}</td>
                        </tr>
                        <tr v-if="disputeDetail.reviewTime && disputeDetail.reviewOpinion">
                          <td>{{ formatDateTime(disputeDetail.reviewTime) }}</td>
                          <td>
                            <v-chip size="small" color="blue" class="font-weight-bold">
                              <span class="font-weight-bold">复核完成</span>
                            </v-chip>
                          </td>
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

  <!-- Snackbar提示消息 -->
  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    :timeout="snackbar.timeout"
    location="top"
    position="absolute"
  >
    {{ snackbar.message }}
    <template v-slot:actions>
      <v-btn
        color="white"
        variant="text"
        @click="snackbar.show = false"
      >
        关闭
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from '@/api/axios'

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
    const formValid = ref(false)
    const actionType = ref('')
    const newScore = ref(null)
    const reviewOpinion = ref('')
    const submitting = ref(false)
    const actionOptions = ['驳回', '处理争议']
    const snackbar = ref({
      show: false,
      message: '',
      color: 'success',
      timeout: 3000
    })

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
          status: Number(data.status) || '0',
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
        '0': '待处理',
        '1': '已处理',
        '2': '驳回'
      }
      return statusMap[status] || status
    }

    const disputeForm = ref(null)

    const submitDispute = async () => {
      try {
        submitting.value = true

        // 构建URL参数
        const params = new URLSearchParams()
        params.append('id', disputeDetail.value.id)
        params.append('status', actionType.value === '驳回' ? '2' : '1')
        params.append('reviewOpinion', reviewOpinion.value)

        // 如果是处理争议，添加分数参数
        if (actionType.value === '处理争议' && newScore.value !== null) {
          params.append('score', newScore.value.toString())
        }

        const response = await axios.put(`http://localhost:9090/disputes/update/${disputeDetail.value.id}?${params.toString()}`)
        const result = response.data

        // 显示成功消息
        snackbar.value = {
          show: true,
          message: '争议处理成功！',
          color: 'success',
          timeout: 3000
        }

        // 重新加载争议详情
        await loadDisputeDetail()

        // 重置表单
        resetForm()

      } catch (error) {
        console.error('处理争议失败:', error)
        snackbar.value = {
          show: true,
          message: '处理争议失败，请重试！',
          color: 'error',
          timeout: 3000
        }
      } finally {
        submitting.value = false
      }
    }

    const resetForm = () => {
      actionType.value = ''
      newScore.value = null
      reviewOpinion.value = ''
      if (disputeForm.value) {
        disputeForm.value.reset()
      }
    }

    onMounted(() => {
      loadDisputeDetail()
    })

    return {
      disputeDetail,
      loading,
      formatDateTime,
      getStatusColor,
      getStatusText,
      formValid,
      actionType,
      newScore,
      reviewOpinion,
      submitting,
      actionOptions,
      submitDispute,
      resetForm,
      disputeForm,
      snackbar
    }
  }
}</script>

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