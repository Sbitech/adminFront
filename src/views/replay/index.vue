<template>
  <v-container fluid class="replay-container">
    <v-row>
      <v-col cols="12">
        <div class="replay-header">
          <h1 class="replay-title">
            <v-icon left color="#42b883">mdi-play-box-multiple</v-icon>
            实时回放
          </h1>
          <p class="replay-subtitle">观看比赛实时回放</p>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card class="replay-card">
          <v-card-title>
            <v-icon left>mdi-video</v-icon>
            回放系统
          </v-card-title>
          <v-card-text>
            <v-alert type="info" class="mb-4">
              实时回放功能正在开发中...
            </v-alert>
            
            <v-row>
              <v-col cols="12" md="8">
                <v-card class="video-player" height="400">
                  <v-card-text class="text-center">
                    <v-icon size="64" color="grey">mdi-video-off</v-icon>
                    <p class="text-h6 mt-4">暂无视频回放</p>
                    <p>请选择比赛场次开始观看</p>
                  </v-card-text>
                </v-card>
              </v-col>
              
              <v-col cols="12" md="4">
                <v-card class="match-list">
                  <v-card-title>比赛场次</v-card-title>
                  <v-card-text>
                    <v-list>
                      <v-list-item>
                        <v-list-item-title>场次 001 - 张三 vs 李四</v-list-item-title>
                        <v-list-item-subtitle>太极拳 - 10:30</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-title>场次 002 - 王五 vs 赵六</v-list-item-title>
                        <v-list-item-subtitle>长拳 - 11:00</v-list-item-subtitle>
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
// 实时回放页面逻辑
</script>

<style scoped>
.replay-container {
  background-color: #f0f2f5;
  background-image: linear-gradient(135deg, #f0f2f5 0%, #e4e7ed 100%);
  min-height: 100vh;
  padding: 20px;
}

.replay-header {
  text-align: center;
  margin-bottom: 30px;
}

.replay-title {
  color: #2c3e50;
  font-weight: 600;
  font-size: 2rem;
  margin-bottom: 8px;
}

.replay-subtitle {
  color: #666;
  font-size: 1.1rem;
}

.replay-card {
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  border: none;
}

.replay-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.video-player {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.match-list {
  border-radius: 8px;
}
</style>