<template>
  <v-container fluid class="history-container">

    <v-row>
      <v-col cols="12">
        <v-card class="history-card">
          <v-card-title>
            <v-icon left>mdi-database-search</v-icon>
            历史数据查询
          </v-card-title>
          <v-card-text>
            
            <v-row align="center" class="mb-4">
              <v-col cols="12" md="2">
                <v-text-field
                  v-model="searchForm.playerName"
                  label="选手姓名"
                  variant="outlined"
                  density="compact"
                  hide-details
                  clearable
                  @update:model-value="fetchHistoryData(true)"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="2">
                <v-select
                  v-model="searchForm.event"
                  label="比赛项目"
                  :items="eventCategories"
                  item-title="text"
                  item-value="value"
                  variant="outlined"
                  density="compact"
                  hide-details
                  clearable
                  @update:model-value="fetchHistoryData(true)"
                ></v-select>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="searchForm.startDate"
                  label="开始时间"
                  type="datetime-local"
                  variant="outlined"
                  density="compact"
                  hide-details
                  clearable
                  @update:model-value="fetchHistoryData(true)"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="searchForm.endDate"
                  label="结束时间"
                  type="datetime-local"
                  variant="outlined"
                  density="compact"
                  hide-details
                  clearable
                  @update:model-value="fetchHistoryData(true)"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="1">
                <v-btn
                  color="error"
                  variant="outlined"
                  @click="handleReset"
                  block
                >
                  <v-icon left>mdi-refresh</v-icon>
                  重置
                </v-btn>
              </v-col>
              <v-col cols="12" md="1">
                <v-btn
                  color="#42b883"
                  @click="fetchHistoryData(true)"
                  block
                >
                  <v-icon left>mdi-magnify</v-icon>
                  查询
                </v-btn>
              </v-col>
            </v-row>

            <v-data-table
              :headers="headers"
              :items="historyData"
              :loading="loading"
              :server-items-length="totalItems"
              v-model:options="options"
              :items-per-page-options="[5, 10, 15, 20]"
              class="history-table"
              hover
            >
              <template v-slot:item.actions="{ item }">
                <v-btn
                  color="#42b883"
                  small
                  variant="outlined"
                  @click="viewDetail(item.id)"
                >
                  <v-icon left small>mdi-eye</v-icon>
                  查看详情
                </v-btn>
              </template>

              <template v-slot:bottom>
                <v-divider />
                <v-card-actions class="justify-end">
                  <v-pagination 
                    v-model="options.page" 
                    :length="Math.ceil(totalItems / options.itemsPerPage)"
                    :total-visible="7" 
                    color="#42b883"
                    @update:model-value="() => fetchHistoryData()"
                  />
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

// 分页相关变量
const loading = ref(false)
const totalItems = ref(0)
const options = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
  sortDesc: [],
  multiSort: false,
  mustSort: false
})

// 查询条件
const searchForm = ref({
  playerName: '',
  event: '',
  startDate: '',
  endDate: ''
})

// 比赛项目列表
const eventCategories = ref([
  { text: '全部', value: '' }
])

const handleReset = () => {
  searchForm.value = {
    playerName: '',
    event: '',
    startDate: '',
    endDate: ''
  }
  fetchHistoryData(true)
}

const viewDetail = (id) => {
  router.push(`/history/detail/${id}`)
}

// 获取历史数据
const fetchHistoryData = async (resetPage = false) => {
  try {
    loading.value = true
    
    // 如果重置页码，强制回到第一页
    if (resetPage) {
      options.value.page = 1
    }
    
    // 构建查询参数
    const params = {
      pageNum: options.value.page,
      pageSize: options.value.itemsPerPage
    }
    
    // 添加搜索条件
    if (searchForm.value.playerName) {
      params.name = searchForm.value.playerName
    }
    if (searchForm.value.event) {
      params.category = searchForm.value.event
    }
    // 添加日期筛选条件 - 将datetime-local格式转换为yyyy-MM-dd HH:mm格式
    if (searchForm.value.startDate) {
      params.startTime = searchForm.value.startDate.replace('T', ' ')
    }
    if (searchForm.value.endDate) {
      params.endTime = searchForm.value.endDate.replace('T', ' ')
    }
    
    const response = await axios.post('http://localhost:9090/history/list', params)
    
    if (response.data && response.data.list) {
      // 转换后端数据格式
      historyData.value = response.data.list.map(item => ({
        id: item.id,
        datetime: item.time,
        playerName: item.realName || item.username || `选手${item.playerNumber}`,
        event: item.category,
        finalScore: item.score
      }))
      
      totalItems.value = response.data.total
    } else {
      historyData.value = []
      totalItems.value = 0
    }
    
    // 如果当前页码大于总页数，重置到第一页
    const totalPages = Math.ceil(totalItems.value / options.value.itemsPerPage)
    if (options.value.page > totalPages && totalPages > 0) {
      options.value.page = 1
      fetchHistoryData() // 重新获取第一页数据
      return
    }
  } catch (error) {
    console.error('获取历史数据失败:', error)
    // 如果API调用失败，清空数据
    historyData.value = []
    totalItems.value = 0
  } finally {
    loading.value = false
  }
}

// 获取比赛项目列表
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

// 使用模拟数据
const useMockData = () => {
  historyData.value = []
  totalItems.value = 0
}

// 监听表格选项变化（仅分页、排序等，不包含筛选条件）
watch(
  () => options.value,
  (newOptions, oldOptions) => {
    // 只有当页码或每页条数变化时才重新获取数据
    if (newOptions.page !== oldOptions.page || newOptions.itemsPerPage !== oldOptions.itemsPerPage) {
      console.log('分页参数变化:', newOptions)
      fetchHistoryData()
    }
  },
  { deep: true }
)

// 页面加载时获取数据
onMounted(() => {
  fetchEventCategories()
  fetchHistoryData()
})

// 表格头
const headers = [
  { title: '日期时间', key: 'datetime', align: 'start' },
  { title: '选手姓名', key: 'playerName', align: 'start' },
  { title: '比赛项目', key: 'event', align: 'start' },
  { title: '评分', key: 'finalScore', align: 'center' },
  { title: '操作', key: 'actions', align: 'center', sortable: false }
]

// 历史数据
const historyData = ref([])
</script>

<style scoped>
.history-container {
  background-color: #f0f2f5;
  background-image: linear-gradient(135deg, #f0f2f5 0%, #e4e7ed 100%);
  min-height: auto;
  padding: 20px;
}

.history-header {
  text-align: center;
  margin-bottom: 30px;
}

.history-title {
  color: #2c3e50;
  font-weight: 600;
  font-size: 2rem;
  margin-bottom: 8px;
}

.history-subtitle {
  color: #666;
  font-size: 1.1rem;
}

.history-card {
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: none;
  /* 移除hover效果 */
}

.history-table {
  border-radius: 8px;
  overflow: hidden;
}

.v-table th {
  font-weight: 600;
  color: #2c3e50;
}

.v-btn {
  text-transform: none;
  font-weight: 500;
}
</style>