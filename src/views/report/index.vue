<template>
  <v-container fluid class="report-container">
    <v-row>
      <v-col cols="12">
        <div class="report-header">
          <h1 class="report-title">
            <v-icon left color="#42b883">mdi-file-pdf-box</v-icon>
            报告PDF
          </h1>
          <p class="report-subtitle">生成和管理评分报告</p>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="8">
        <v-card class="report-card">
          <v-card-title>
            <v-icon left>mdi-file-document</v-icon>
            报告生成
          </v-card-title>
          <v-card-text>
            <v-alert type="info" class="mb-4">
              报告生成功能正在开发中...
            </v-alert>
            
            <v-row>
              <v-col cols="12" md="6">
                <v-card class="report-form">
                  <v-card-title>生成选项</v-card-title>
                  <v-card-text>
                    <v-form>
                      <v-select
                        label="报告类型"
                        :items="['日报告', '周报告', '月报告', '比赛报告']"
                        variant="outlined"
                        density="compact"
                        class="mb-3"
                      ></v-select>
                      <v-select
                        label="比赛项目"
                        :items="['全部项目', '太极拳', '长拳', '南拳']"
                        variant="outlined"
                        density="compact"
                        class="mb-3"
                      ></v-select>
                      <v-text-field
                        label="开始日期"
                        type="date"
                        variant="outlined"
                        density="compact"
                        class="mb-3"
                      ></v-text-field>
                      <v-text-field
                        label="结束日期"
                        type="date"
                        variant="outlined"
                        density="compact"
                        class="mb-3"
                      ></v-text-field>
                      <v-btn color="#42b883" block>
                        <v-icon left>mdi-file-pdf</v-icon>
                        生成PDF报告
                      </v-btn>
                    </v-form>
                  </v-card-text>
                </v-card>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-card class="report-preview">
                  <v-card-title>报告预览</v-card-title>
                  <v-card-text>
                    <v-icon size="64" color="grey" class="d-block mx-auto mb-4">
                      mdi-file-pdf-outline
                    </v-icon>
                    <p class="text-center">PDF预览将在此显示</p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="4">
        <v-card class="report-history">
          <v-card-title>
            <v-icon left>mdi-history</v-icon>
            历史报告
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-title>日报告 - 2024-01-15</v-list-item-title>
                <v-list-item-subtitle>2.1 MB - 下载</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>周报告 - 2024-01-08~14</v-list-item-title>
                <v-list-item-subtitle>5.3 MB - 下载</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>太极拳专项报告</v-list-item-title>
                <v-list-item-subtitle>1.8 MB - 下载</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
// 报告PDF页面逻辑
</script>

<style scoped>
.report-container {
  background-color: #f0f2f5;
  background-image: linear-gradient(135deg, #f0f2f5 0%, #e4e7ed 100%);
  min-height: 100vh;
  padding: 20px;
}

.report-header {
  text-align: center;
  margin-bottom: 30px;
}

.report-title {
  color: #2c3e50;
  font-weight: 600;
  font-size: 2rem;
  margin-bottom: 8px;
}

.report-subtitle {
  color: #666;
  font-size: 1.1rem;
}

.report-card, .report-history {
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  border: none;
}

.report-card:hover, .report-history:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.report-form, .report-preview {
  border-radius: 8px;
}
</style>