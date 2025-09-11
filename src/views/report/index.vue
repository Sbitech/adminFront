<template>
  <v-container fluid class="report-container">

    <v-row>
      <v-col cols="12" lg="5">
        <v-card class="report-card">
          <v-card-title>
            <v-icon left>mdi-file-document</v-icon>
            报告生成
          </v-card-title>
          <v-card-text>
            <v-card class="report-form">
              <v-card-title>生成选项</v-card-title>
              <v-card-text>
                <v-form>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="reportForm.type"
                        label="报告类型"
                        :items="['日报告', '周报告', '月报告', '比赛报告', '选手报告']"
                        variant="outlined"
                        density="compact"
                        class="mb-3"
                      ></v-select>
                    </v-col>
                    
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="reportForm.format"
                        label="导出格式"
                        :items="['PDF', 'Excel', 'Word']"
                        variant="outlined"
                        density="compact"
                        class="mb-3"
                      ></v-select>
                    </v-col>
                  </v-row>
                  
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="reportForm.event"
                        label="比赛项目"
                        :items="eventOptions"
                        variant="outlined"
                        density="compact"
                        class="mb-3"
                        clearable
                      ></v-select>
                    </v-col>
                    
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="reportForm.player"
                        label="选择选手"
                        :items="playerOptions"
                        variant="outlined"
                        density="compact"
                        class="mb-3"
                        clearable
                      ></v-select>
                    </v-col>
                  </v-row>
                  
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="reportForm.startDate"
                        label="开始日期"
                        type="date"
                        variant="outlined"
                        density="compact"
                        class="mb-3"
                      ></v-text-field>
                    </v-col>
                    
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="reportForm.endDate"
                        label="结束日期"
                        type="date"
                        variant="outlined"
                        density="compact"
                        class="mb-3"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  
                  <v-btn 
                    color="#42b883" 
                    block 
                    @click="generateReport"
                    :loading="generating"
                    :disabled="!reportForm.startDate || !reportForm.endDate"
                    size="large"
                  >
                    <v-icon left>mdi-file-pdf</v-icon>
                    生成{{ reportForm.format }}报告
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" lg="7">
        <!-- 历史报告 -->
        <v-card class="report-history">
          <v-card-title>
            <v-icon left>mdi-history</v-icon>
            历史报告
            <v-chip small color="#42b883" class="ml-2">{{ filteredReports.length }}</v-chip>
          </v-card-title>
          <v-card-text>
            <!-- 高级筛选功能 -->
            <v-row dense class="mb-3">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="searchQuery"
                  label="搜索报告"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  clearable
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="filterType"
                  label="文件类型"
                  :items="['全部', 'PDF', 'Excel', 'Word']"
                  variant="outlined"
                  density="compact"
                  hide-details
                ></v-select>
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="sortOrder"
                  label="排序方式"
                  :items="['最新优先', '最旧优先', '名称升序', '名称降序']"
                  variant="outlined"
                  density="compact"
                  hide-details
                ></v-select>
              </v-col>
            </v-row>
            
            <v-list density="compact">
              <v-list-item
                v-for="report in filteredReports"
                :key="report.id"
                class="report-item"
              >
                <template v-slot:prepend>
                  <v-icon 
                    :color="report.type === 'PDF' ? '#e74c3c' : report.type === 'Excel' ? '#27ae60' : '#3498db'"
                    size="28"
                  >
                    {{ report.type === 'PDF' ? 'mdi-file-document' : 
                       report.type === 'Excel' ? 'mdi-file-table' : 'mdi-file-word' }}
                  </v-icon>
                </template>
                
                <v-list-item-title>{{ report.title }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ report.size }} • {{ report.date }}
                </v-list-item-subtitle>
                
                <template v-slot:append>
                  <v-btn
                    variant="text"
                    size="small"
                    color="primary"
                    @click="downloadReport(report)"
                  >
                    <v-icon>mdi-download</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
            
            <div v-if="filteredReports.length === 0" class="text-center pa-4">
              <v-icon size="48" color="grey">
                {{ searchQuery ? 'mdi-file-search-outline' : 'mdi-file-document-outline' }}
              </v-icon>
              <p class="text-grey mt-2">
                {{ searchQuery ? `未找到包含 "${searchQuery}" 的报告` : '暂无报告' }}
              </p>
              <v-btn 
                v-if="searchQuery" 
                variant="text" 
                color="primary" 
                size="small" 
                @click="searchQuery = ''"
                class="mt-2"
              >
                清空搜索
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <!-- 生成成功提示对话框 -->
    <v-dialog v-model="showSuccessDialog" max-width="400" persistent>
      <v-card class="success-dialog">
        <v-card-text class="text-center pa-6">
          <v-icon size="64" color="#42b883" class="mb-4">
            mdi-check-circle
          </v-icon>
          <h3 class="text-h5 mb-2">报告生成成功！</h3>
          <p class="text-body-1 text-grey mb-4">
            {{ generatedReportInfo?.title }} 已成功生成
          </p>
          <div class="report-details mb-4">
            <v-chip color="primary" size="small" class="mr-2">
              {{ generatedReportInfo?.type }}
            </v-chip>
            <v-chip color="success" size="small">
              {{ generatedReportInfo?.size }}
            </v-chip>
          </div>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="elevated" @click="downloadReport(generatedReportInfo)">
            <v-icon left>mdi-download</v-icon>
            立即下载
          </v-btn>
          <v-btn color="grey" variant="outlined" @click="showSuccessDialog = false">
            稍后查看
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>

  <!-- 轻量级成功提示 -->
  <v-snackbar
    v-model="showSuccessSnackbar"
    color="success"
    timeout="5000"
    location="top"
    elevation="8"
  >
    <div class="d-flex align-center">
      <v-icon left>mdi-check-circle</v-icon>
      <span>{{ generatedReportInfo?.title }} 生成成功！</span>
      <v-spacer></v-spacer>
      <v-btn
        variant="text"
        size="small"
        @click="downloadReport(generatedReportInfo)"
      >
        下载
      </v-btn>
      <v-btn
        variant="text"
        size="small"
        @click="showSuccessDetails"
      >
        详情
      </v-btn>
    </div>
  </v-snackbar>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

// 报告表单数据
const reportForm = ref({
  type: '日报告',
  event: '',
  player: '',
  startDate: '',
  endDate: '',
  format: 'PDF'
})

// 选项数据
const eventOptions = ['全部项目', '太极拳', '长拳', '南拳', '剑术', '刀术']
const playerOptions = ['全部选手', '张三', '李四', '王五', '赵六', '陈七']

// 生成状态
const generating = ref(false)
const showSuccessDialog = ref(false)
const showSuccessSnackbar = ref(false)
const generatedReportInfo = ref(null)

// 预览数据
const previewData = ref(null)

// 搜索和筛选功能
const searchQuery = ref('')
const filterType = ref('全部')
const sortOrder = ref('最新优先')

// 筛选后的报告列表
const filteredReports = computed(() => {
  let filtered = reports.value
  
  // 类型筛选
  if (filterType.value !== '全部') {
    filtered = filtered.filter(report => report.type === filterType.value)
  }
  
  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(report => 
      report.title.toLowerCase().includes(query) ||
      report.type.toLowerCase().includes(query) ||
      report.date.toLowerCase().includes(query)
    )
  }
  
  // 排序
  const sorted = [...filtered]
  switch (sortOrder.value) {
    case '最新优先':
      return sorted.sort((a, b) => b.id - a.id)
    case '最旧优先':
      return sorted.sort((a, b) => a.id - b.id)
    case '名称升序':
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    case '名称降序':
      return sorted.sort((a, b) => b.title.localeCompare(a.title))
    default:
      return sorted
  }
})

// 历史报告数据
const reports = ref([
  {
    id: 1,
    title: '日报告 - 2025-08-19',
    type: 'PDF',
    size: '2.1 MB',
    date: '今天 14:30',
    downloadUrl: '/reports/daily-2025-08-19.pdf'
  },
  {
    id: 2,
    title: '周报告 - 2025-08-19',
    type: 'PDF',
    size: '5.3 MB',
    date: '昨天 09:15',
    downloadUrl: '/reports/weekly-2025-08-19.pdf'
  },
  {
    id: 3,
    title: '太极拳专项报告',
    type: 'Excel',
    size: '1.8 MB',
    date: '前天 16:45',
    downloadUrl: '/reports/taiji-special.xlsx'
  },
  {
    id: 4,
    title: '选手表现分析',
    type: 'PDF',
    size: '3.2 MB',
    date: '2025-08-17',
    downloadUrl: '/reports/player-analysis.pdf'
  },
  {
    id: 5,
    title: '武术训练总结报告',
    type: 'Word',
    size: '1.5 MB',
    date: '2025-08-16',
    downloadUrl: '/reports/training-summary.docx'
  }
])

// 方法
const generateReport = () => {
  generating.value = true
  
  // 模拟生成报告
    setTimeout(() => {
      const newReport = {
        id: reports.value.length + 1,
        title: `${reportForm.value.type} - ${reportForm.value.endDate}`,
        type: reportForm.value.format,
        size: (Math.random() * 5 + 1).toFixed(1) + ' MB',
        date: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        downloadUrl: `/reports/${reportForm.value.type}-${reportForm.value.endDate}.${reportForm.value.format.toLowerCase()}`
      }
      
      reports.value.unshift(newReport)
      generating.value = false
      generatedReportInfo.value = newReport
      
      // 根据用户偏好选择提示方式
      // 这里使用轻量级提示，用户可以选择查看详情
      showSuccessSnackbar.value = true
      
      // 同时更新预览数据
      updatePreview()
    }, 2000)
}



const downloadReport = (report) => {
  // 模拟下载
  console.log('下载报告:', report.title)
  
  // 实际应用中这里会触发文件下载
  const link = document.createElement('a')
  link.href = report.downloadUrl
  link.download = report.title + '.' + report.type.toLowerCase()
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const previewReport = (report) => {
  // 模拟预览功能
  console.log('预览报告:', report.title)
  // 实际应用中这里会打开预览窗口或新标签页
  window.open(report.downloadUrl, '_blank')
}



const showSuccessDetails = () => {
  showSuccessSnackbar.value = false
  showSuccessDialog.value = true
}



// 初始化日期
const today = new Date().toISOString().split('T')[0]
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
reportForm.value.startDate = yesterday
reportForm.value.endDate = today
</script>

<style scoped>
.report-container {
  background-color: #f0f2f5;
  background-image: linear-gradient(135deg, #f0f2f5 0%, #e4e7ed 100%);
  min-height: auto;
  padding: 20px;
}

.report-header {
  text-align: center;
  margin-bottom: 32px;
}

.report-title {
  font-size: 2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
}

.report-subtitle {
  font-size: 1.1rem;
  color: #7f8c8d;
  margin: 0;
}

.report-card,
.report-history,
.report-stats {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.report-form {
  background: #f8f9fa;
  border-radius: 8px;
}

.report-item {
  border-bottom: 1px solid #f0f0f0;
}

.report-item:last-child {
  border-bottom: none;
}

@media (max-width: 768px) {
  .report-container {
    padding: 16px;
  }
  
  .report-title {
    font-size: 2rem;
  }
  
  .preview-stats {
    flex-direction: column;
    gap: 16px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

.success-dialog {
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.success-dialog .v-card-text {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
}

.report-details {
  display: flex;
  justify-content: center;
  gap: 8px;
}
</style>