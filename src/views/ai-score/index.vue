<template>
  <v-container fluid class="ai-score-container">

    <v-row>
      <v-col cols="12">
        <v-card class="ai-score-card">
          <v-card-title>
            <v-icon left>mdi-chart-line</v-icon>
            AI评分分析
          </v-card-title>
          <v-card-text>
            <!-- <v-alert type="info" class="mb-4">
              AI评分明细功能正在开发中...
            </v-alert> -->
            
            <v-row>
              <v-col cols="12" md="6">
                <v-card class="score-summary">
                  <v-card-title>评分概览</v-card-title>
                  <v-card-text>
                    <v-list>
                      <v-list-item>
                        <v-list-item-title>AI评分准确率</v-list-item-title>
                        <v-list-item-subtitle>95.2%</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-title>平均评分偏差</v-list-item-title>
                        <v-list-item-subtitle>±0.3分</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-title>处理评分数量</v-list-item-title>
                        <v-list-item-subtitle>1,247场</v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-card class="recent-scores">
                  <v-card-title>最近评分</v-card-title>
                  <v-card-text>
                    <v-table>
                      <thead>
                        <tr>
                          <th>选手</th>
                          <th>项目</th>
                          <th>AI评分</th>
                          <th>人工评分</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>张三</td>
                          <td>太极拳</td>
                          <td>8.5</td>
                          <td>8.3</td>
                        </tr>
                        <tr>
                          <td>李四</td>
                          <td>长拳</td>
                          <td>7.8</td>
                          <td>8.1</td>
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

<script setup>
// AI评分明细页面逻辑
</script>

<style scoped>
.ai-score-container {
  background-color: #f0f2f5;
  background-image: linear-gradient(135deg, #f0f2f5 0%, #e4e7ed 100%);
  min-height: auto;
  padding: 20px;
}

.ai-score-header {
  text-align: center;
  margin-bottom: 30px;
}

.ai-score-title {
  color: #2c3e50;
  font-weight: 600;
  font-size: 2rem;
  margin-bottom: 8px;
}

.ai-score-subtitle {
  color: #666;
  font-size: 1.1rem;
}

.ai-score-card {
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: none;
  /* 移除hover效果 */
}

.score-summary, .recent-scores {
  border-radius: 8px;
}
</style>