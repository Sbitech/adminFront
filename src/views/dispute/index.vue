<template>
  <v-container fluid class="dispute-container">
    <v-row>
      <v-col cols="12">
        <div class="dispute-header">
          <h1 class="dispute-title">
            <v-icon left color="#42b883">mdi-alert-circle</v-icon>
            争议复核
          </h1>
          <p class="dispute-subtitle">处理评分争议案件</p>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card class="dispute-card">
          <v-card-title class="dispute-title">
            争议复核管理
          </v-card-title>
          
          <v-card-text>
            <!-- 搜索和筛选 -->
            <v-row class="mb-4">
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="search"
                  prepend-inner-icon="mdi-magnify"
                  label="搜索争议案件"
                  variant="outlined"
                  density="compact"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="statusFilter"
                  :items="statusItems"
                  label="状态筛选"
                  variant="outlined"
                  density="compact"
                  hide-details
                ></v-select>
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="dateFilter"
                  :items="dateItems"
                  label="时间筛选"
                  variant="outlined"
                  density="compact"
                  hide-details
                ></v-select>
              </v-col>
              <v-col cols="12" md="2">
                <v-btn color="#42b883" block height="40" @click="refreshData">
                  <v-icon left>mdi-refresh</v-icon>
                  刷新
                </v-btn>
              </v-col>
            </v-row>

            <!-- 争议案件列表 -->
            <v-data-table
              :headers="headers"
              :items="disputes"
              :search="search"
              class="dispute-table"
              hover
            >
              <template v-slot:item.status="{ item }">
                <v-chip
                  :color="getStatusColor(item.status)"
                  :text-color="getStatusTextColor(item.status)"
                  small
                >
                  {{ getStatusText(item.status) }}
                </v-chip>
              </template>
              
              <template v-slot:item.priority="{ item }">
                <v-chip
                  :color="getPriorityColor(item.priority)"
                  :text-color="getPriorityTextColor(item.priority)"
                  small
                >
                  {{ getPriorityText(item.priority) }}
                </v-chip>
              </template>
              
              <template v-slot:item.actions="{ item }">
                <v-btn
                  color="#42b883"
                  small
                  variant="outlined"
                  @click="openDisputeDetail(item)"
                >
                  <v-icon left small>mdi-eye</v-icon>
                  查看详情
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 争议详情对话框 -->
    <v-dialog v-model="detailDialog" max-width="900px" persistent>
      <v-card class="dispute-detail-card">
        <v-card-title class="dispute-detail-title d-flex align-center">
          <v-icon left>mdi-file-document-edit</v-icon>
          <span>争议案件详情</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDetailDialog" class="ml-2">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-card class="detail-section">
                <v-card-title class="section-title">基本信息</v-card-title>
                <v-card-text>
                  <v-list dense>
                    <v-list-item>
                      <v-list-item-title>案件编号</v-list-item-title>
                      <v-list-item-subtitle>{{ selectedDispute.id }}</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>选手姓名</v-list-item-title>
                      <v-list-item-subtitle>{{ selectedDispute.playerName }}</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>比赛项目</v-list-item-title>
                      <v-list-item-subtitle>{{ selectedDispute.event }}</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>原始评分</v-list-item-title>
                      <v-list-item-subtitle>{{ selectedDispute.originalScore }}</v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
            
            <v-col cols="12" md="6">
              <v-card class="detail-section">
                <v-card-title class="section-title">争议信息</v-card-title>
                <v-card-text>
                  <v-list dense>
                    <v-list-item>
                      <v-list-item-title>争议类型</v-list-item-title>
                      <v-list-item-subtitle>{{ selectedDispute.disputeType }}</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>提出时间</v-list-item-title>
                      <v-list-item-subtitle>{{ selectedDispute.createdTime }}</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>争议理由</v-list-item-title>
                      <v-list-item-subtitle>{{ selectedDispute.reason }}</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>当前状态</v-list-item-title>
                      <v-list-item-subtitle>
                        <v-chip small :color="getStatusColor(selectedDispute.status)">
                          {{ getStatusText(selectedDispute.status) }}
                        </v-chip>
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- 评分对比 -->
          <v-row>
            <v-col cols="12">
              <v-card class="detail-section">
                <v-card-title class="section-title">评分对比分析</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-card class="score-card">
                        <v-card-text class="text-center">
                          <div class="score-label">AI评分</div>
                          <div class="score-value">{{ selectedDispute.aiScore || '-' }}</div>
                        </v-card-text>
                      </v-card>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-card class="score-card">
                        <v-card-text class="text-center">
                          <div class="score-label">人工评分</div>
                          <div class="score-value">{{ selectedDispute.originalScore || '-' }}</div>
                        </v-card-text>
                      </v-card>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-card class="score-card">
                        <v-card-text class="text-center">
                          <div class="score-label">建议评分</div>
                          <div class="score-value">{{ selectedDispute.suggestedScore || '-' }}</div>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- 复核操作 -->
          <v-row>
            <v-col cols="12">
              <v-card class="detail-section">
                <v-card-title class="section-title">复核操作</v-card-title>
                <v-card-text>
                  <v-form ref="disputeForm">
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="finalScore"
                          label="最终评分"
                          type="number"
                          :rules="scoreRules"
                          variant="outlined"
                          density="compact"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="finalStatus"
                          :items="finalStatusItems"
                          label="处理结果"
                          variant="outlined"
                          density="compact"
                        ></v-select>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12">
                        <v-textarea
                          v-model="comment"
                          label="复核意见"
                          rows="3"
                          variant="outlined"
                          density="compact"
                        ></v-textarea>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="outlined" @click="closeDetailDialog">
            取消
          </v-btn>
          <v-btn color="#42b883" @click="submitDisputeResult">
            <v-icon left>mdi-check</v-icon>
            确认复核
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'

// 搜索和筛选
const search = ref('')
const statusFilter = ref('全部')
const dateFilter = ref('全部')

// 状态选项
const statusItems = ['全部', '待处理', '处理中', '已解决', '已驳回']
const dateItems = ['全部', '今日', '本周', '本月']

// 表格头
const headers = [
  { title: '案件编号', key: 'id', align: 'start' },
  { title: '选手姓名', key: 'playerName', align: 'start' },
  { title: '比赛项目', key: 'event', align: 'start' },
  { title: '争议类型', key: 'disputeType', align: 'start' },
  { title: '状态', key: 'status', align: 'center' },
  { title: '优先级', key: 'priority', align: 'center' },
  { title: '提出时间', key: 'createdTime', align: 'start' },
  { title: '操作', key: 'actions', align: 'center', sortable: false }
]

// 模拟争议数据
const disputes = ref([
  {
    id: 'DS001',
    playerName: '张三',
    event: '太极拳',
    disputeType: '评分偏差',
    status: 'pending',
    priority: 'high',
    createdTime: '2025-06-15 14:30',
    originalScore: 8.2,
    aiScore: 8.5,
    reason: 'AI评分与人工评分差异较大，需要复核',
    suggestedScore: 8.4
  },
  {
    id: 'DS002',
    playerName: '李四',
    event: '长拳',
    disputeType: '技术动作争议',
    status: 'processing',
    priority: 'medium',
    createdTime: '2025-07-15 15:45',
    originalScore: 7.8,
    aiScore: 8.1,
    reason: '对某个技术动作的评分标准存在争议',
    suggestedScore: 8.0
  },
  {
    id: 'DS003',
    playerName: '王五',
    event: '南拳',
    disputeType: '评分标准',
    status: 'resolved',
    priority: 'low',
    createdTime: '2025-08-15 16:20',
    originalScore: 9.0,
    aiScore: 8.8,
    reason: '评分标准理解不一致',
    suggestedScore: 8.9
  }
])

// 状态相关方法
const getStatusColor = (status) => {
  const colors = {
    pending: 'orange',
    processing: 'blue',
    resolved: 'green',
    rejected: 'red'
  }
  return colors[status] || 'grey'
}

const getStatusText = (status) => {
  const texts = {
    pending: '待处理',
    processing: '处理中',
    resolved: '已解决',
    rejected: '已驳回'
  }
  return texts[status] || status
}

const getStatusTextColor = (status) => {
  return 'white'
}

// 优先级相关方法
const getPriorityColor = (priority) => {
  const colors = {
    high: 'red',
    medium: 'orange',
    low: 'green'
  }
  return colors[priority] || 'grey'
}

const getPriorityText = (priority) => {
  const texts = {
    high: '高',
    medium: '中',
    low: '低'
  }
  return texts[priority] || priority
}

const getPriorityTextColor = (priority) => {
  return 'white'
}

// 详情对话框
const detailDialog = ref(false)
const selectedDispute = ref({})
const finalScore = ref('')
const finalStatus = ref('')
const comment = ref('')

// 最终状态选项
const finalStatusItems = ['维持原判', '调整分数', '重新评分']

// 分数验证规则
const scoreRules = [
  v => !!v || '请输入最终评分',
  v => (v >= 0 && v <= 10) || '评分必须在0-10之间'
]

// 打开详情
const openDisputeDetail = (item) => {
  selectedDispute.value = item
  finalScore.value = item.suggestedScore || item.originalScore
  finalStatus.value = '维持原判'
  comment.value = ''
  detailDialog.value = true
}

// 关闭详情
const closeDetailDialog = () => {
  detailDialog.value = false
  selectedDispute.value = {}
}

// 提交复核结果
const submitDisputeResult = () => {
  // 这里可以添加提交逻辑
  console.log('提交复核结果:', {
    disputeId: selectedDispute.value.id,
    finalScore: finalScore.value,
    finalStatus: finalStatus.value,
    comment: comment.value
  })
  
  // 更新状态
  const index = disputes.value.findIndex(d => d.id === selectedDispute.value.id)
  if (index !== -1) {
    disputes.value[index].status = 'resolved'
  }
  
  closeDetailDialog()
}

// 刷新数据
const refreshData = () => {
  // 这里可以添加数据刷新逻辑
  console.log('刷新争议数据')
}
</script>

<style scoped>
.dispute-container {
  background-color: #f0f2f5;
  background-image: linear-gradient(135deg, #f0f2f5 0%, #e4e7ed 100%);
  min-height: 100vh;
  padding: 20px;
}

.dispute-header {
  text-align: center;
  margin-bottom: 30px;
}

.dispute-title {
  color: #2c3e50;
  font-weight: 600;
  font-size: 2rem;
  margin-bottom: 8px;
}

.dispute-subtitle {
  color: #666;
  font-size: 1.1rem;
}

.dispute-card {
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  border: none;
}

.dispute-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.dispute-table {
  border-radius: 8px;
  overflow: hidden;
}

.dispute-detail-card {
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.dispute-detail-title {
  background-color: #42b883;
  color: white;
  font-weight: 600;
}

.detail-section {
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-title {
  color: #2c3e50;
  font-weight: 600;
  font-size: 1.1rem;
}

.score-card {
  text-align: center;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.score-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 5px;
}

.score-value {
  font-size: 2rem;
  font-weight: bold;
  color: #42b883;
}

.v-btn {
  text-transform: none;
  font-weight: 500;
}

.v-table th {
  font-weight: 600;
  color: #2c3e50;
}

.v-chip {
  font-weight: 500;
}
</style>