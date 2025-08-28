<template>
  <v-container fluid class="dashboard-container">

    <v-row>
      <v-col cols="12" md="3">
        <v-card class="judge-card" color="#42b883" theme="dark">
          <v-card-text>
            <div>今日评分场次</div>
            <p class="text-h4 text--primary">
              12
            </p>
            <p>进行中: 3场</p>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="judge-card" color="#3aa876" theme="dark">
          <v-card-text>
            <div>AI评分完成</div>
            <p class="text-h4 text--primary">
              89%
            </p>
            <p>准确率: 95%</p>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="judge-card" color="#2c3e50" theme="dark">
          <v-card-text>
            <div>待复核争议</div>
            <p class="text-h4 text--primary">
              5
            </p>
            <p>紧急: 2项</p>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="judge-card" color="#34495e" theme="dark">
          <v-card-text>
            <div>数据备份状态</div>
            <p class="text-h4 text--primary">
              正常
            </p>
            <p>上次备份: 2分钟前</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12" lg="8">
        <v-card class="judge-card">
          <v-card-title>
            <v-icon left>mdi-play-circle</v-icon>
            当前评分场次
          </v-card-title>
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th>场次</th>
                  <th>选手</th>
                  <th>项目</th>
                  <th>状态</th>
                  <th>AI评分</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>001</td>
                  <td>张三</td>
                  <td>太极拳</td>
                  <td><v-chip color="green" small>进行中</v-chip></td>
                  <td>8.5</td>
                  <td>
                    <v-btn color="primary" small>实时评分</v-btn>
                  </td>
                </tr>
                <tr>
                  <td>002</td>
                  <td>李四</td>
                  <td>长拳</td>
                  <td><v-chip color="orange" small>待评分</v-chip></td>
                  <td>-</td>
                  <td>
                    <v-btn color="success" small>开始评分</v-btn>
                  </td>
                </tr>
                <tr>
                  <td>003</td>
                  <td>王五</td>
                  <td>南拳</td>
                  <td><v-chip color="red" small>争议中</v-chip></td>
                  <td>7.2</td>
                  <td>
                    <v-btn color="warning" small>复核</v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" lg="4">
        <v-card class="judge-card">
          <v-card-title>
            <v-icon left>mdi-lightning-bolt</v-icon>
            快捷评分工具
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item @click="$router.push('/replay')" class="judge-list-item">
                <template v-slot:prepend>
                  <v-icon color="#42b883">mdi-play-box-multiple</v-icon>
                </template>
                <v-list-item-title>实时回放</v-list-item-title>
                <v-list-item-subtitle>观看比赛回放</v-list-item-subtitle>
              </v-list-item>

              <v-list-item @click="$router.push('/ai-score')" class="judge-list-item">
                <template v-slot:prepend>
                  <v-icon color="#3aa876">mdi-robot</v-icon>
                </template>
                <v-list-item-title>AI评分明细</v-list-item-title>
                <v-list-item-subtitle>查看AI评分详情</v-list-item-subtitle>
              </v-list-item>

              <v-list-item @click="$router.push('/manual-score')" class="judge-list-item">
                <template v-slot:prepend>
                  <v-icon color="#2c3e50">mdi-account-edit</v-icon>
                </template>
                <v-list-item-title>人工评分</v-list-item-title>
                <v-list-item-subtitle>手动调整分数</v-list-item-subtitle>
              </v-list-item>

              <v-list-item @click="$router.push('/report')" class="judge-list-item">
                <template v-slot:prepend>
                  <v-icon color="#34495e">mdi-file-pdf-box</v-icon>
                </template>
                <v-list-item-title>生成报告</v-list-item-title>
                <v-list-item-subtitle>导出评分报告</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
// 首页现在只显示内容，导航功能由布局组件提供
</script>

<style scoped>
.dashboard-container {
  background-color: #f0f2f5;
  background-image: linear-gradient(135deg, #f0f2f5 0%, #e4e7ed 100%);
  min-height: auto;
  padding: 20px;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 30px;
}

.dashboard-title {
  color: #2c3e50;
  font-weight: 600;
  font-size: 2rem;
  margin-bottom: 8px;
}

.dashboard-subtitle {
  color: #666;
  font-size: 1.1rem;
}

.judge-card {
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  border: none;
}

.judge-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.judge-list-item {
  margin-bottom: 8px;
  border-radius: 8px;
  transition: background-color 0.3s;
  cursor: pointer;
}

.judge-list-item:hover {
  background-color: rgba(66, 184, 131, 0.1);
}

.v-table th {
  font-weight: 600;
  color: #2c3e50;
}

.v-chip {
  font-weight: 500;
}

.v-btn {
  text-transform: none;
  font-weight: 500;
}
</style>