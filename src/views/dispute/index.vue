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
            <v-row align="center">
              <v-col cols="12" md="2">
                <v-select v-model="eventCategory" :items="eventCategories" item-title="text" item-value="value"
                  label="比赛类别" variant="outlined" density="compact" hide-details clearable
                  @update:model-value="fetchData(true)"></v-select>
              </v-col>
              <v-col cols="12" md="2">
                <v-select v-model="statusFilter" :items="statusItems" item-title="text" item-value="value" label="申诉状态"
                  variant="outlined" density="compact" hide-details clearable
                  @update:model-value="fetchData(true)"></v-select>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field v-model="startTime" type="datetime-local" label="开始时间" variant="outlined"
                  density="compact" hide-details clearable @update:model-value="fetchData(true)"></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field v-model="endTime" type="datetime-local" label="结束时间" variant="outlined" density="compact"
                  hide-details clearable @update:model-value="fetchData(true)"></v-text-field>
              </v-col>
              <v-col cols="12" md="1">
                <v-btn color="error" variant="outlined" @click="resetFilters" block>
                  <v-icon left>mdi-refresh</v-icon>
                  重置
                </v-btn>
              </v-col>
              <v-col cols="12" md="1">
                <v-btn color="#42b883" @click="fetchData(true)" block>
                  <v-icon left>mdi-magnify</v-icon>
                  查询
                </v-btn>
              </v-col>
            </v-row>
            <!-- 争议案件列表 -->
            <v-data-table :headers="headers" :items="disputes" v-model:options="options" :server-items-length="total"
              :loading="loading" :items-per-page-options="[10, 20, 50, 100]" show-current-page class="dispute-table"
              hover>
              <template v-slot:item.status="{ item }">
                <v-chip :color="getStatusColor(item.status)" :text-color="getStatusTextColor(item.status)" small>
                  {{ getStatusText(item.status) }}
                </v-chip>
              </template>

              <template v-slot:item.createTime="{ item }">
                {{ formatDate(item.createTime) }}
              </template>

              <template v-slot:item.endTime="{ item }">
                {{ formatDate(item.endTime) }}
              </template>

              <template v-slot:item.evidenceUrl="{ item }">
                <a v-if="item.evidenceUrl" :href="item.evidenceUrl" target="_blank" class="evidence-link">
                  <v-icon small>mdi-link</v-icon>
                  查看证据
                </a>
                <span v-else>-</span>
              </template>

              <template v-slot:item.actions="{ item }">
                <v-btn color="#42b883" small variant="outlined" @click="viewDisputeDetail(item.id)">
                  <v-icon left small>mdi-eye</v-icon>
                  查看详情
                </v-btn>
              </template>

              <template v-slot:bottom>
                <v-divider />
                <v-card-actions class="justify-end">
                  <v-pagination v-model="options.page" :length="Math.ceil(total / options.itemsPerPage)"
                    :total-visible="7" color="#42b883" @update:model-value="handlePageChange" />
                </v-card-actions>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/api/axios'

const router = useRouter()

// 查询参数
const eventCategory = ref('')
const startTime = ref('')
const endTime = ref('')
const statusFilter = ref('')



// 表格相关
const loading = ref(false)
const disputes = ref([])
const total = ref(0)
const options = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
  sortDesc: [],
  multiSort: false,
  mustSort: false
})

// 状态选项
const statusItems = [
  { text: '全部', value: '' },
  { text: '待处理', value: '0' },
  { text: '已处理', value: '1' },
  { text: '驳回', value: '2' }
]

// 比赛类别选项 - 从API获取
const eventCategories = ref([
  { text: '全部', value: '' }
])

// 表格头 - 与后端属性对应，不包含id、reviewOpinion、reason
const headers = [
  { title: '比赛记录ID', key: 'playMatchId', align: 'start' },
  { title: '申诉标题', key: 'title', align: 'start' },
  { title: '证据材料', key: 'evidenceUrl', align: 'start' },
  { title: '申诉状态', key: 'status', align: 'center' },
  { title: '项目类别', key: 'category', align: 'start' },
  { title: '创建时间', key: 'createTime', align: 'start' },
  { title: '审核时间', key: 'reviewTime', align: 'start' },
  { title: '操作', key: 'actions', align: 'center', sortable: false }
]

// 状态相关方法
const getStatusColor = (status) => {
  const colors = {
    '0': 'orange',
    '1': 'green',
    '2': 'red'
  }
  return colors[status] || 'grey'
}

const getStatusText = (status) => {
  const texts = {
    '0': '待处理',
    '1': '已处理',
    '2': '驳回'
  }
  return texts[status] || status
}

const getStatusTextColor = () => 'white'

// 时间格式化方法
const formatDate = (dateString) => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return dateString
  }
}

// 查看详情
const viewDisputeDetail = (id) => {
  router.push(`/dispute/detail/${id}`)
}

// 获取比赛类别列表
const fetchEventCategories = async () => {
  try {
    const response = await axios.get('http://localhost:9090/events/getCategory')
    if (response.data && Array.isArray(response.data)) {
      const categories = response.data.map(item => ({
        text: item.category,
        value: item.category
      }))
      eventCategories.value = [
        { text: '全部', value: '' },
        ...categories
      ]
    }
  } catch (error) {
    console.error('获取比赛类别失败:', error)
  }
}



// 格式化时间 - 移除T并确保格式正确
const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return ''
  return dateTimeStr.replace('T', ' ')
}

// 获取数据
const fetchData = async (resetPage = false) => {
  loading.value = true
  try {
    // 如果重置页码，强制回到第一页
    if (resetPage) {
      options.value.page = 1
    }
    
    const params = {
      pageNum: options.value.page,
      pageSize: options.value.itemsPerPage
    }

    // 只添加有值的参数，并格式化时间
    if (startTime.value) params.startTime = formatDateTime(startTime.value)
    if (endTime.value) params.endTime = formatDateTime(endTime.value)
    if (eventCategory.value) params.eventCategory = eventCategory.value
    if (statusFilter.value !== '') params.status = statusFilter.value

    const response = await axios.post('http://localhost:9090/disputes/list', params)

    disputes.value = response.data.list
    total.value = response.data.total
    
    // 如果当前页码大于总页数，重置到第一页
    const totalPages = Math.ceil(total.value / options.value.itemsPerPage)
    if (options.value.page > totalPages && totalPages > 0) {
      options.value.page = 1
      fetchData() // 重新获取第一页数据
      return
    }
  } catch (error) {
    console.error('获取争议列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 监听表格选项变化（仅分页、排序等，不包含筛选条件）
  watch(
    () => options.value,
    (newOptions, oldOptions) => {
      // 只有当页码或每页条数变化时才重新获取数据
      if (newOptions.page !== oldOptions.page || newOptions.itemsPerPage !== oldOptions.itemsPerPage) {
        console.log('分页参数变化:', newOptions)
        fetchData()
      }
    },
    { deep: true }
  )

// 手动分页切换
const handlePageChange = (page) => {
  options.value.page = page
  fetchData()
}

// 重置筛选条件
const resetFilters = () => {
  eventCategory.value = ''
  statusFilter.value = ''
  startTime.value = ''
  endTime.value = ''
  options.value.page = 1
  fetchData()
}

// 页面加载时获取数据
onMounted(() => {
  fetchEventCategories()
  fetchData()
})
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

.evidence-link {
  color: #42b883;
  text-decoration: none;
  font-size: 14px;
}

.evidence-link:hover {
  text-decoration: underline;
}
</style>