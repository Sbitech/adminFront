<template>
  <v-container fluid class="dispute-container">

    <v-row>
      <v-col cols="12">
        <v-card class="dispute-card">
          <v-card-title>
            <v-icon left>mdi-file-document-edit</v-icon>
            争议复核管理
          </v-card-title>
          
          <v-card-text>
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
                  @click="viewDisputeDetail(item.id)"
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
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 搜索和筛选
const search = ref('')
const statusFilter = ref('')
const dateFilter = ref('')

// 状态选项
const statusItems = ['全部', '待处理', '处理中', '已解决', '已驳回']
const dateItems = ['全部', '今日', '本周', '本月']

// 表格头
const headers = [
  { title: '案件编号', key: 'caseNo', align: 'start' },
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
    id: 1,
    caseNo: 'DS001',
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
    id: 2,
    caseNo: 'DS002',
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
    id: 3,
    caseNo: 'DS003',
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

// 查看详情
const viewDisputeDetail = (id) => {
  router.push(`/dispute/detail/${id}`)
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
  min-height: auto;
  padding: 20px;
}

.dispute-header {
  text-align: center;
  margin-bottom: 30px;
}

.dispute-card {
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: none;
  /* 移除hover效果 */
}

.dispute-table {
  border-radius: 8px;
  overflow: hidden;
}

.dispute-detail-card {
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
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