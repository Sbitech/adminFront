<template>
  <v-container fluid class="manual-score-container">

    <v-row>
      <v-col cols="12">
        <v-card class="manual-score-card">
          <v-card-title>
            <v-icon left>mdi-pencil-ruler</v-icon>
            评分调整
          </v-card-title>
          <v-card-text>
            <!-- <v-alert type="info" class="mb-4">
              人工评分干预功能正在开发中...
            </v-alert> -->
            
            <v-row>
              <v-col cols="12" md="8">
                <v-card class="adjust-form">
                  <v-card-title>调整评分</v-card-title>
                  <v-card-text>
                    <v-form>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-select
                            label="选择选手"
                            :items="['张三', '李四', '王五']"
                            variant="outlined"
                            density="compact"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-select
                            label="比赛项目"
                            :items="['太极拳', '长拳', '南拳']"
                            variant="outlined"
                            density="compact"
                          ></v-select>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-text-field
                            label="AI评分"
                            value="8.5"
                            readonly
                            variant="outlined"
                            density="compact"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            label="调整后评分"
                            type="number"
                            variant="outlined"
                            density="compact"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12">
                          <v-textarea
                            label="调整原因"
                            rows="3"
                            variant="outlined"
                            density="compact"
                          ></v-textarea>
                        </v-col>
                      </v-row>
                                            <v-btn color="#42b883" block>
                        <v-icon left>mdi-file-pdf</v-icon>
                        确定调整
                      </v-btn>
                    </v-form>
                  </v-card-text>
                </v-card>
              </v-col>
              
              <v-col cols="12" md="4">
                <v-card class="adjust-history">
                  <v-card-title>调整记录</v-card-title>
                  <v-card-text>
                    <v-list>
                      <v-list-item>
                        <v-list-item-title>张三 - 太极拳</v-list-item-title>
                        <v-list-item-subtitle>8.5 → 8.7 (技术动作)</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-title>李四 - 长拳</v-list-item-title>
                        <v-list-item-subtitle>7.8 → 8.0 (表现力度)</v-list-item-subtitle>
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
  </v-container>
</template>

<script setup>
// 人工评分干预页面逻辑
</script>

<style scoped>
.manual-score-container {
  background-color: #f0f2f5;
  background-image: linear-gradient(135deg, #f0f2f5 0%, #e4e7ed 100%);
  min-height: auto;
  padding: 20px;
}

.manual-score-header {
  text-align: center;
  margin-bottom: 30px;
}

.manual-score-title {
  color: #2c3e50;
  font-weight: 600;
  font-size: 2rem;
  margin-bottom: 8px;
}

.manual-score-subtitle {
  color: #666;
  font-size: 1.1rem;
}

.manual-score-card {
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: none;
  /* 移除hover效果 */
}

.adjust-form, .adjust-history {
  border-radius: 8px;
}
</style>