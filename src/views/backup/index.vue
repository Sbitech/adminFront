<template>
  <v-container fluid class="backup-container">
    <v-row>
      <v-col cols="12">
        <div class="backup-header">
          <h1 class="backup-title">
            <v-icon left color="#42b883">mdi-database</v-icon>
            数据备份
          </h1>
          <p class="backup-subtitle">管理和备份评分数据</p>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="8">
        <v-card class="backup-card">
          <v-card-title>
            <v-icon left>mdi-backup-restore</v-icon>
            备份管理
          </v-card-title>
          <v-card-text>
            <v-alert type="info" class="mb-4">
              数据备份功能正在开发中...
            </v-alert>
            
            <v-row>
              <v-col cols="12" md="6">
                <v-card class="backup-status">
                  <v-card-title>备份状态</v-card-title>
                  <v-card-text>
                    <v-list>
                      <v-list-item>
                        <v-list-item-title>上次备份</v-list-item-title>
                        <v-list-item-subtitle>2024-01-15 14:30</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-title>备份大小</v-list-item-title>
                        <v-list-item-subtitle>2.3 GB</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-title>备份状态</v-list-item-title>
                        <v-list-item-subtitle>
                          <v-chip color="green" small>正常</v-chip>
                        </v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-card class="backup-actions">
                  <v-card-title>备份操作</v-card-title>
                  <v-card-text>
                    <v-btn color="#42b883" block class="mb-2">
                      <v-icon left>mdi-backup</v-icon>
                      立即备份
                    </v-btn>
                    <v-btn color="primary" block class="mb-2">
                      <v-icon left>mdi-download</v-icon>
                      下载备份
                    </v-btn>
                    <v-btn color="warning" block>
                      <v-icon left>mdi-restore</v-icon>
                      恢复数据
                    </v-btn>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="4">
        <v-card class="backup-history">
          <v-card-title>
            <v-icon left>mdi-history</v-icon>
            备份历史
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-title>2024-01-15 14:30</v-list-item-title>
                <v-list-item-subtitle>自动备份 - 2.3 GB</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>2024-01-14 14:30</v-list-item-title>
                <v-list-item-subtitle>自动备份 - 2.2 GB</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>2024-01-13 14:30</v-list-item-title>
                <v-list-item-subtitle>手动备份 - 2.1 GB</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
// 数据备份页面逻辑
</script>

<style scoped>
.backup-container {
  background-color: #f0f2f5;
  background-image: linear-gradient(135deg, #f0f2f5 0%, #e4e7ed 100%);
  min-height: 100vh;
  padding: 20px;
}

.backup-header {
  text-align: center;
  margin-bottom: 30px;
}

.backup-title {
  color: #2c3e50;
  font-weight: 600;
  font-size: 2rem;
  margin-bottom: 8px;
}

.backup-subtitle {
  color: #666;
  font-size: 1.1rem;
}

.backup-card, .backup-history {
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  border: none;
}

.backup-card:hover, .backup-history:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.backup-status, .backup-actions {
  border-radius: 8px;
}
</style>