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
            <!-- <v-alert type="info" class="mb-4">
              数据回溯功能正在开发中...
            </v-alert> -->
            
            <v-row class="mb-4">
              <v-col cols="12" md="2">
                <v-text-field
                  label="选手姓名"
                  variant="outlined"
                  density="compact"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="2">
                <v-select
                  label="比赛项目"
                  :items="['全部项目', '太极拳', '长拳', '南拳']"
                  variant="outlined"
                  density="compact"
                  hide-details
                ></v-select>
              </v-col>
              <v-col cols="12" md="2">
                <v-text-field
                  label="开始日期"
                  type="date"
                  variant="outlined"
                  density="compact"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="2">
                <v-text-field
                  label="结束日期"
                  type="date"
                  variant="outlined"
                  density="compact"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4" class="d-flex align-end">
                <v-btn
                  color="#42b883"
                  prepend-icon="mdi-magnify"
                  @click="handleQuery"
                  class="mr-2"
                  height="40"
                >
                  查询
                </v-btn>
                <v-btn
                  color="grey"
                  prepend-icon="mdi-restore"
                  @click="handleReset"
                  height="40"
                >
                  重置
                </v-btn>
              </v-col>
            </v-row>

            <v-data-table
              :headers="headers"
              :items="historyData"
              class="history-table"
              hover
            >
              <template v-slot:item.actions="{ item }">
                <v-btn
                  color="#42b883"
                  small
                  variant="outlined"
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
import { ref } from 'vue'

const handleQuery = () => {
  // 这里可以添加实际的查询逻辑
  console.log('执行查询...')
}

const handleReset = () => {
  // 重置查询条件
  console.log('重置查询条件...')
}

// 表格头
const headers = [
  { title: '日期时间', key: 'datetime', align: 'start' },
  { title: '选手姓名', key: 'playerName', align: 'start' },
  { title: '比赛项目', key: 'event', align: 'start' },
  { title: 'AI评分', key: 'aiScore', align: 'center' },
  { title: '人工评分', key: 'manualScore', align: 'center' },
  { title: '最终评分', key: 'finalScore', align: 'center' },
  { title: '操作', key: 'actions', align: 'center', sortable: false }
]

// 模拟历史数据
const historyData = ref([
  {
    datetime: '2024-01-15 10:30',
    playerName: '张三',
    event: '太极拳',
    aiScore: 8.5,
    manualScore: 8.3,
    finalScore: 8.4
  },
  {
    datetime: '2024-01-15 11:00',
    playerName: '李四',
    event: '长拳',
    aiScore: 7.8,
    manualScore: 8.1,
    finalScore: 8.0
  },
  {
    datetime: '2024-01-15 11:30',
    playerName: '王五',
    event: '南拳',
    aiScore: 9.0,
    manualScore: 8.8,
    finalScore: 8.9
  }
])
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