<template>
  <v-container fluid class="backup-container">
    <v-row>
      <v-col cols="12">
        <v-card class="backup-card">
          <v-card-title>
            <v-icon left>mdi-backup-restore</v-icon>
            精准备份管理
          </v-card-title>
          <v-card-text>
            
            <!-- 筛选和操作区域 -->
            <v-row class="mb-4">
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="searchKeyword"
                  label="搜索比赛"
                  prepend-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  hide-details
                  clearable
                  @input="filterMatches"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="selectedEvent"
                  label="比赛项目"
                  :items="eventOptions"
                  variant="outlined"
                  density="compact"
                  hide-details
                  clearable
                  @update:model-value="filterMatches"
                ></v-select>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="selectedDate"
                  label="选择日期"
                  type="date"
                  variant="outlined"
                  density="compact"
                  hide-details
                  clearable
                  @update:model-value="filterMatches"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3" class="d-flex align-end">
                <v-btn color="grey" @click="resetFilters" class="mr-2" size="small">
                  <v-icon left>mdi-restore</v-icon>
                  重置
                </v-btn>
                <v-btn color="#42b883" @click="selectAllFiltered" size="small">
                  <v-icon left>mdi-select-all</v-icon>
                  全选
                </v-btn>
              </v-col>
            </v-row>

            <!-- 已选择比赛信息 -->
            <v-row class="mb-4">
              <v-col cols="12">
                <v-card color="blue-lighten-5" class="pa-3">
                  <div class="d-flex align-center">
                    <v-icon color="blue" class="mr-2">mdi-information</v-icon>
                    <span class="text-body-1">
                      已选择 <strong>{{ selectedMatches.length }}</strong> 场比赛
                      <span v-if="selectedMatches.length > 0">
                        ，共 {{ selectedMatches.length }} 场
                      </span>
                    </span>
                    <v-spacer></v-spacer>
                    <v-btn 
                      v-if="selectedMatches.length > 0" 
                      color="red" 
                      size="small" 
                      variant="text"
                      @click="clearSelection"
                    >
                      <v-icon left>mdi-close</v-icon>
                      清空选择
                    </v-btn>
                  </div>
                </v-card>
              </v-col>
            </v-row>

            <!-- 比赛列表表格 -->
            <v-card elevation="2" class="mb-4">
              <v-card-title class="text-subtitle-1">
                <v-icon left>mdi-tournament</v-icon>
                比赛场次列表
                <v-chip v-if="filteredMatches.length !== allMatches.length" small color="#42b883" class="ml-2">
                  {{ filteredMatches.length }} / {{ allMatches.length }}
                </v-chip>
              </v-card-title>
              
              <v-card-text class="pa-0">
                <v-data-table
                  v-model="selectedMatches"
                  :headers="matchHeaders"
                  :items="filteredMatches"
                  :search="searchKeyword"
                  show-select
                  item-value="id"
                  class="elevation-0"
                  density="compact"
                  height="400"
                  fixed-header
                >
                  <template v-slot:item.date="{ item }">
                    <v-chip size="small" color="blue-grey" variant="flat">
                      {{ item.date }}
                    </v-chip>
                  </template>
                  
                  <template v-slot:item.time="{ item }">
                    <span class="text-caption">{{ item.time }}</span>
                  </template>
                  
                  <template v-slot:item.event="{ item }">
                    <v-chip size="small" :color="getEventColor(item.event)" variant="flat">
                      {{ item.event }}
                    </v-chip>
                  </template>
                  
                  <template v-slot:item.status="{ item }">
                    <v-chip 
                      size="small" 
                      :color="item.hasBackup ? 'green' : 'grey'"
                      variant="flat"
                    >
                      {{ item.hasBackup ? '已备份' : '未备份' }}
                    </v-chip>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>

            <!-- 备份操作区域 -->
            <v-row>
              <v-col cols="12" md="4">
                <v-card class="backup-actions" height="100%">
                  <v-card-title>备份操作</v-card-title>
                  <v-card-text>
                    <v-btn 
                      color="#42b883" 
                      block 
                      class="mb-3"
                      :loading="isBackingUp"
                      :disabled="selectedMatches.length === 0"
                      @click="backupSelectedMatches"
                    >
                      <v-icon left>mdi-backup</v-icon>
                      备份选中比赛 ({{ selectedMatches.length }}场)
                    </v-btn>
                    
                    <v-btn 
                      color="primary" 
                      block 
                      class="mb-3"
                      :disabled="selectedMatches.length === 0 || !hasAnyBackup(selectedMatches)"
                      @click="downloadSelectedBackup"
                    >
                      <v-icon left>mdi-download</v-icon>
                      下载选中备份
                    </v-btn>
                    
                    <v-btn 
                      color="warning" 
                      block
                      :disabled="selectedMatches.length === 0 || !hasAnyBackup(selectedMatches)"
                      @click="showRestoreDialog = true"
                    >
                      <v-icon left>mdi-restore</v-icon>
                      恢复选中比赛
                    </v-btn>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="8">
                <v-card class="backup-status" height="100%">
                  <v-card-title>备份统计</v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="6" class="text-center">
                        <div class="text-h4" style="color: #42b883;">{{ totalMatches }}</div>
                        <div class="text-caption">总比赛场次</div>
                      </v-col>
                      <v-col cols="6" class="text-center">
                        <div class="text-h4" style="color: #1976d2;">{{ backedUpMatches }}</div>
                        <div class="text-caption">已备份场次</div>
                      </v-col>
                    </v-row>
                    
                    <v-divider class="my-3"></v-divider>
                    
                    <v-list density="compact">
                      <v-list-item>
                        <v-list-item-title>上次备份</v-list-item-title>
                        <v-list-item-subtitle>{{ lastBackupTime }}</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-title>备份大小</v-list-item-title>
                        <v-list-item-subtitle>{{ totalBackupSize }}</v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 恢复确认对话框 -->
    <v-dialog v-model="showRestoreDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h6">
          <v-icon left color="warning">mdi-alert</v-icon>
          确认恢复数据
        </v-card-title>
        <v-card-text>
          <p class="mb-3">您即将恢复以下比赛数据：</p>
          <v-list density="compact" max-height="200" class="overflow-y-auto">
            <v-list-item v-for="matchId in selectedMatches" :key="matchId">
              <v-list-item-title>{{ getMatchTitle(matchId) }}</v-list-item-title>
            </v-list-item>
          </v-list>
          <v-alert type="warning" variant="tonal" class="mt-3">
            此操作将覆盖现有数据，请谨慎操作！
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="showRestoreDialog = false">取消</v-btn>
          <v-btn color="warning" @click="restoreSelectedMatches" :loading="isRestoring">
            确认恢复
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 操作成功提示 -->
    <v-snackbar v-model="showSuccessSnackbar" :color="successColor" timeout="3000">
      <v-icon left>{{ successIcon }}</v-icon>
      {{ successMessage }}
    </v-snackbar>

  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

// 响应式数据
const allMatches = ref([])
const filteredMatches = ref([])
const selectedMatches = ref([])
const searchKeyword = ref('')
const selectedEvent = ref('')
const selectedDate = ref('')
const isBackingUp = ref(false)
const isRestoring = ref(false)
const showRestoreDialog = ref(false)
const showSuccessSnackbar = ref(false)
const successMessage = ref('')
const successColor = ref('success')
const successIcon = ref('mdi-check')

// 比赛项目选项
const eventOptions = [
  '长拳',
  '南拳',
  '太极拳',
  '刀术',
  '剑术',
  '枪术',
  '棍术',
  '南棍',
  '南刀',
  '太极剑',
  '对练',
  '集体项目'
]

// 表格列定义
const matchHeaders = [
  { title: '日期', key: 'date', sortable: true, width: '100px' },
  { title: '时间', key: 'time', sortable: true, width: '80px' },
  { title: '比赛项目', key: 'event', sortable: true, width: '100px' },
  { title: '选手1', key: 'player1', sortable: true, width: '120px' },
  { title: '选手2', key: 'player2', sortable: true, width: '120px' },
  { title: '比赛名称', key: 'matchName', sortable: true, width: '150px' },
  { title: '状态', key: 'status', sortable: true, width: '80px' }
]

// 计算属性
const totalMatches = computed(() => allMatches.value.length)
const backedUpMatches = computed(() => allMatches.value.filter(m => m.hasBackup).length)
const lastBackupTime = computed(() => {
  const match = allMatches.value.find(m => m.lastBackupTime)
  return match?.lastBackupTime || '暂无备份'
})
const totalBackupSize = computed(() => {
  const size = allMatches.value.reduce((sum, match) => sum + (match.backupSize || 0), 0)
  return size > 0 ? `${(size / 1024 / 1024).toFixed(1)} MB` : '0 MB'
})

// 获取比赛数据
const fetchMatches = async () => {
  try {
    const response = await axios.get('/api/matches')
    allMatches.value = response.data.map(match => ({
      id: match.id,
      date: match.date || '2025-01-01',
      time: match.time || '10:00',
      event: match.event || '长拳',
      player1: match.player1 || '选手A',
      player2: match.player2 || '选手B',
      matchName: match.matchName || `${match.player1 || '选手A'} vs ${match.player2 || '选手B'}`,
      hasBackup: match.hasBackup || false,
      backupSize: match.backupSize || 0,
      lastBackupTime: match.lastBackupTime || null
    }))
    filteredMatches.value = [...allMatches.value]
  } catch (error) {
    console.error('获取比赛数据失败:', error)
    // 使用模拟数据
    allMatches.value = [
      {
        id: 1,
        date: '2025-01-15',
        time: '09:30',
        event: '长拳',
        player1: '张三',
        player2: '李四',
        matchName: '张三 vs 李四',
        hasBackup: true,
        backupSize: 1024 * 1024 * 15,
        lastBackupTime: '2025-01-15 10:30:00'
      },
      {
        id: 2,
        date: '2025-01-15',
        time: '10:00',
        event: '南拳',
        player1: '王五',
        player2: '赵六',
        matchName: '王五 vs 赵六',
        hasBackup: false,
        backupSize: 0,
        lastBackupTime: null
      },
      {
        id: 3,
        date: '2025-01-16',
        time: '14:00',
        event: '太极拳',
        player1: '陈七',
        player2: '刘八',
        matchName: '陈七 vs 刘八',
        hasBackup: true,
        backupSize: 1024 * 1024 * 12,
        lastBackupTime: '2025-01-16 15:00:00'
      },
      {
        id: 4,
        date: '2025-01-16',
        time: '15:30',
        event: '刀术',
        player1: '孙九',
        player2: '周十',
        matchName: '孙九 vs 周十',
        hasBackup: true,
        backupSize: 1024 * 1024 * 18,
        lastBackupTime: '2025-01-16 16:30:00'
      },
      {
        id: 5,
        date: '2025-01-17',
        time: '09:00',
        event: '剑术',
        player1: '吴一',
        player2: '郑二',
        matchName: '吴一 vs 郑二',
        hasBackup: false,
        backupSize: 0,
        lastBackupTime: null
      }
    ]
    filteredMatches.value = [...allMatches.value]
  }
}

// 筛选比赛
const filterMatches = () => {
  let filtered = allMatches.value

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(match => 
      match.player1.toLowerCase().includes(keyword) ||
      match.player2.toLowerCase().includes(keyword) ||
      match.matchName.toLowerCase().includes(keyword) ||
      match.event.toLowerCase().includes(keyword)
    )
  }

  if (selectedEvent.value) {
    filtered = filtered.filter(match => match.event === selectedEvent.value)
  }

  if (selectedDate.value) {
    filtered = filtered.filter(match => match.date === selectedDate.value)
  }

  filteredMatches.value = filtered
}

// 重置筛选
const resetFilters = () => {
  searchKeyword.value = ''
  selectedEvent.value = ''
  selectedDate.value = ''
  filteredMatches.value = [...allMatches.value]
}

// 全选当前筛选结果
const selectAllFiltered = () => {
  selectedMatches.value = filteredMatches.value.map(match => match.id)
}

// 清空选择
const clearSelection = () => {
  selectedMatches.value = []
}

// 获取比赛标题
const getMatchTitle = (matchId) => {
  const match = allMatches.value.find(m => m.id === matchId)
  return match ? match.matchName : `比赛 #${matchId}`
}

// 检查是否有备份
const hasAnyBackup = (matchIds) => {
  return matchIds.some(id => {
    const match = allMatches.value.find(m => m.id === id)
    return match && match.hasBackup
  })
}

// 获取事件颜色
const getEventColor = (event) => {
  const colorMap = {
    '长拳': '#42b883',
    '南拳': '#ff6b6b',
    '太极拳': '#4ecdc4',
    '刀术': '#45b7d1',
    '剑术': '#96ceb4',
    '枪术': '#ffeaa7',
    '棍术': '#dda0dd',
    '南棍': '#ff7675',
    '南刀': '#fdcb6e',
    '太极剑': '#6c5ce7',
    '对练': '#a29bfe',
    '集体项目': '#fd79a8'
  }
  return colorMap[event] || '#42b883'
}

// 显示成功消息
const showSuccess = (message, color = 'success', icon = 'mdi-check') => {
  successMessage.value = message
  successColor.value = color
  successIcon.value = icon
  showSuccessSnackbar.value = true
}

// 备份选中的比赛
const backupSelectedMatches = async () => {
  if (selectedMatches.value.length === 0) return

  isBackingUp.value = true
  try {
    const response = await axios.post('/api/backup/matches', {
      matchIds: selectedMatches.value
    })
    
    // 更新本地数据
    selectedMatches.value.forEach(id => {
      const match = allMatches.value.find(m => m.id === id)
      if (match) {
        match.hasBackup = true
        match.lastBackupTime = new Date().toLocaleString('zh-CN')
        match.backupSize = response.data.matchSizes?.[id] || 1024 * 1024 * 10
      }
    })

    showSuccess(`成功备份 ${selectedMatches.value.length} 场比赛`, 'success', 'mdi-backup')
    selectedMatches.value = []
  } catch (error) {
    console.error('备份失败:', error)
    showSuccess('备份失败，请稍后重试', 'error', 'mdi-alert')
  } finally {
    isBackingUp.value = false
  }
}

// 下载选中备份
const downloadSelectedBackup = async () => {
  if (selectedMatches.value.length === 0) return

  try {
    const response = await axios.post('/api/backup/download', {
      matchIds: selectedMatches.value
    }, {
      responseType: 'blob'
    })

    // 创建下载链接
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `武术比赛备份_${new Date().toISOString().split('T')[0]}.zip`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)

    showSuccess('备份文件下载成功', 'success', 'mdi-download')
  } catch (error) {
    console.error('下载失败:', error)
    showSuccess('下载失败，请稍后重试', 'error', 'mdi-alert')
  }
}

// 恢复选中的比赛
const restoreSelectedMatches = async () => {
  if (selectedMatches.value.length === 0) return

  isRestoring.value = true
  try {
    await axios.post('/api/backup/restore', {
      matchIds: selectedMatches.value
    })

    // 重新获取数据
    await fetchMatches()

    showSuccess(`成功恢复 ${selectedMatches.value.length} 场比赛`, 'success', 'mdi-restore')
    showRestoreDialog.value = false
    selectedMatches.value = []
  } catch (error) {
    console.error('恢复失败:', error)
    showSuccess('恢复失败，请稍后重试', 'error', 'mdi-alert')
  } finally {
    isRestoring.value = false
  }
}

// 组件挂载时加载数据
onMounted(() => {
  fetchMatches()
})
</script>

<style scoped>
.backup-container {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  padding: 20px;
}

.backup-card {
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.backup-actions,
.backup-status {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 表格样式优化 */
:deep(.v-data-table) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.v-data-table__th) {
  background-color: #f8f9fa;
  font-weight: 600 !important;
  color: #495057 !important;
  font-size: 0.875rem;
}

:deep(.v-data-table__td) {
  padding: 8px 12px !important;
  font-size: 0.875rem;
}

:deep(.v-data-table__td .v-chip) {
  font-size: 0.75rem;
  font-weight: 500;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .backup-container {
    padding: 12px;
  }
  
  .backup-card {
    margin: 8px;
  }
}

/* 按钮悬停效果 */
.v-btn:hover {
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

/* 选择状态样式 */
:deep(.v-selection-control--checked .v-icon) {
  color: #42b883 !important;
}

/* 滚动条美化 */
:deep(.v-data-table__wrapper::-webkit-scrollbar) {
  width: 6px;
  height: 6px;
}

:deep(.v-data-table__wrapper::-webkit-scrollbar-track) {
  background: #f1f1f1;
  border-radius: 3px;
}

:deep(.v-data-table__wrapper::-webkit-scrollbar-thumb) {
  background: #c1c1c1;
  border-radius: 3px;
}

:deep(.v-data-table__wrapper::-webkit-scrollbar-thumb:hover) {
  background: #a8a8a8;
}
</style>