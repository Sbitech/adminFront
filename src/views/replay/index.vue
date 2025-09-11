<template>
  <v-container fluid class="replay-container">

    <v-row>
      <v-col cols="12">
        <v-card class="replay-card">
          <v-card-title>
            <v-icon left>mdi-video</v-icon>
            回放系统
          </v-card-title>
          <v-card-text>

            <v-row class="mb-4">
              <v-col cols="12" md="3">
                <v-select v-model="selectedEvent" label="比赛项目" :items="eventOptions" variant="outlined"
                  density="compact" hide-details clearable></v-select>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field v-model="selectedDate" label="选择日期" type="date" variant="outlined" density="compact"
                  hide-details clearable></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field v-model="searchKeyword" label="搜索选手" prepend-icon="mdi-magnify" variant="outlined"
                  density="compact" hide-details clearable></v-text-field>
              </v-col>
              <v-col cols="12" md="3" class="d-flex align-end">
                <v-btn color="grey" prepend-icon="mdi-restore" @click="resetFilters" class="mr-2" size="small">
                  重置
                </v-btn>
                <v-btn color="#42b883" prepend-icon="mdi-filter" @click="applyFilters" size="small">
                  筛选
                </v-btn>
              </v-col>
            </v-row>

            <!-- 第一行：动作控制 + 主视频 + 比赛场次 -->
            <v-row>
              <!-- 左侧动作控制器和视角预览 -->
              <v-col cols="12" lg="2" class="d-flex flex-column">
                <v-card class="flex-grow-1 d-flex flex-column" style="min-height: 200px;">
                  <v-card-title class="text-subtitle-1">
                    <v-icon left>mdi-controller</v-icon>
                    动作控制
                  </v-card-title>
                  <v-card-text class="flex-grow-1 d-flex flex-column justify-center">
                    <div class="text-center mb-4">
                      <div class="text-h6">{{ actionTimestamps[currentActionIndex]?.name || '准备动作' }}</div>
                      <div class="text-caption">{{ formatTime(actionTimestamps[currentActionIndex]?.start || 0) }} - {{
                        formatTime(actionTimestamps[currentActionIndex]?.end || 0) }}</div>
                      <div class="text-caption">第 {{ currentActionIndex + 1 }} / {{ actionTimestamps.length }} 个动作</div>
                    </div>
                    <div class="d-flex flex-column gap-2">
                      <v-btn color="primary" prepend-icon="mdi-skip-previous" @click="previousAction"
                        :disabled="currentActionIndex <= 0" block>
                        上一个动作
                      </v-btn>
                      <v-btn color="primary" prepend-icon="mdi-skip-next" @click="nextAction"
                        :disabled="currentActionIndex >= actionTimestamps.length - 1" block>
                        下一个动作
                      </v-btn>
                      <v-btn color="secondary" prepend-icon="mdi-play" @click="playCurrentAction" block>
                        播放当前
                      </v-btn>
                    </div>
                  </v-card-text>
                </v-card>

                <!-- 视角预览区域 -->
                <v-card class="flex-grow-1 mt-3">
                  <v-card-title class="text-subtitle-2">
                    <v-icon left>mdi-eye</v-icon>
                    视角预览
                  </v-card-title>
                  <v-card-text>
                    <v-row class="flex-column align-center" dense>
                      <v-col cols="8">
                        <v-card :class="['perspective-card', { 'active': currentPerspective === 'front' }]"
                          @click="switchPerspective('front')" class="text-center cursor-pointer"
                          style="aspect-ratio: 16/9; max-height: 80px;">
                          <video v-if="selectedMatch?.videoFront" ref="frontVideo" :src="selectedMatch.videoFront" muted
                            autoplay loop class="perspective-video" @loadedmetadata="onPerspectiveLoaded"></video>
                          <div v-else class="d-flex flex-column align-center justify-center" style="height: 100%;">
                            <v-icon color="grey" size="small">mdi-video-account</v-icon>
                            <span class="text-caption">正面</span>
                          </div>
                        </v-card>
                      </v-col>
                      <v-col cols="8">
                        <v-card :class="['perspective-card', { 'active': currentPerspective === 'side' }]"
                          @click="switchPerspective('side')" class="text-center cursor-pointer"
                          style="aspect-ratio: 16/9; max-height: 80px;">
                          <video v-if="selectedMatch?.videoSide" ref="sideVideo" :src="selectedMatch.videoSide" muted
                            autoplay loop class="perspective-video" @loadedmetadata="onPerspectiveLoaded"></video>
                          <div v-else class="d-flex flex-column align-center justify-center" style="height: 100%;">
                            <v-icon color="grey" size="small">mdi-video-account</v-icon>
                            <span class="text-caption">侧面</span>
                          </div>
                        </v-card>
                      </v-col>
                      <v-col cols="8">
                        <v-card :class="['perspective-card', { 'active': currentPerspective === 'back' }]"
                          @click="switchPerspective('back')" class="text-center cursor-pointer"
                          style="aspect-ratio: 16/9; max-height: 80px;">
                          <video v-if="selectedMatch?.videoBack" ref="backVideo" :src="selectedMatch.videoBack" muted
                            autoplay loop class="perspective-video" @loadedmetadata="onPerspectiveLoaded"></video>
                          <div v-else class="d-flex flex-column align-center justify-center" style="height: 100%;">
                            <v-icon color="grey" size="small">mdi-video-account</v-icon>
                            <span class="text-caption">背面</span>
                          </div>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- 中间主视频区域 -->
              <v-col cols="12" lg="8">
                <v-card class="video-player" style="aspect-ratio: 16/9; max-height: 600px;">
                  <!-- 主视频窗口 -->
                  <video v-if="selectedMatch && currentVideoUrl" ref="mainVideo" :src="currentVideoUrl" controls
                    autoplay class="video-element" @error="handleVideoError" @loadedmetadata="onVideoLoaded"
                    @timeupdate="syncVideoTime" style="width: 100%; height: 100%; object-fit: cover;">
                    您的浏览器不支持视频播放。
                  </video>
                  <v-card-text v-else class="text-center d-flex flex-column align-center justify-center"
                    style="height: 100%;">
                    <v-icon size="64" color="grey">mdi-video-off</v-icon>
                    <p class="text-h6 mt-4">暂无视频回放</p>
                    <p>请选择比赛场次开始观看</p>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- 右侧比赛场次 -->
              <v-col cols="12" lg="2">
                <v-card class="match-list" max-height="600" style="overflow-y: auto;">
                  <v-card-title class="sticky-title">
                    比赛场次
                    <v-chip v-if="filteredMatches.length !== matches.length" small color="#42b883" class="ml-2">
                      {{ filteredMatches.length }} 场
                    </v-chip>
                  </v-card-title>
                  <v-card-text class="pa-0">
                    <v-list density="compact" style="max-height: 520px; overflow-y: auto;">
                      <v-list-item v-for="(match, index) in filteredMatches" :key="match.id"
                        :class="{ 'selected-match': selectedMatch?.id === match.id }" @click="selectMatch(match)"
                        class="match-item" :style="{ borderTop: index === 0 ? 'none' : '1px solid #f0f0f0' }">
                        <v-list-item-title class="text-body-2 font-weight-medium">{{ match.title }}</v-list-item-title>
                        <v-list-item-subtitle class="text-caption">
                          {{ match.event }} • {{ match.date }} {{ match.time }}
                        </v-list-item-subtitle>
                        <template v-slot:append>
                          <v-icon v-if="selectedMatch?.id === match.id" color="#42b883" size="20">
                            mdi-play-circle
                          </v-icon>
                        </template>
                      </v-list-item>
                      <v-list-item v-if="filteredMatches.length === 0" class="text-center py-4">
                        <v-list-item-title class="text-grey text-body-2">
                          暂无匹配的比赛
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- 第二行：AI评分部分 -->
              <v-row>
                <v-col cols="12">
                  <v-card>

                      <v-row>
                        <!-- AI评分卡片 -->
                        <v-col cols="12" lg="2">
                          <v-card class="score-display">
                            <v-card-title class="text-subtitle-2 text-center" style="color: black;">
                              <v-icon left>mdi-star-circle</v-icon>
                              AI评分
                            </v-card-title>

                            <v-card-text class="pa-3">
                              <v-card class="score-card total-score mb-2" elevation="1">
                                <div class="score-label">综合</div>
                                <div class="score-value">{{ ((aiScores.difficulty + aiScores.fluidity +
                                  aiScores.appearance) /
                                  3).toFixed(1) }}</div>
                              </v-card>
                              <v-card class="score-card difficulty-score mb-2" elevation="1">
                                <div class="score-label">难度</div>
                                <div class="score-value">{{ aiScores.difficulty }}</div>
                              </v-card>
                              <v-card class="score-card flow-score mb-2" elevation="1">
                                <div class="score-label">流畅</div>
                                <div class="score-value">{{ aiScores.fluidity }}</div>
                              </v-card>
                              <v-card class="score-card appearance-score mb-2" elevation="1">
                                <div class="score-label">服饰</div>
                                <div class="score-value">{{ aiScores.appearance }}</div>
                              </v-card>
                            </v-card-text>
                          </v-card>
                        </v-col>

                        <!-- 动作细节评分分析 -->
                        <v-col cols="12" lg="10">
                          <v-card elevation="2" class="bg-white">
                            <v-card-title class="text-subtitle-2" style="color: black;">
                              <v-icon left>mdi-magnify</v-icon>
                              动作细节评分分析
                            </v-card-title>
                            <v-card-text class="pa-4">
                              <v-row>
                                <!-- 左侧招式列表 -->
                                <v-col cols="12" md="3" lg="2">
                                  <v-card elevation="1" class="h-100 bg-white">
                                    <v-card-title class="text-subtitle-2 text-center" style="color: black;">
                                      招式列表
                                    </v-card-title>
                                    <v-card-text class="pa-2">
                                      <v-list density="compact" class="bg-white">
                                        <v-list-item v-for="(action, index) in actionDetails" :key="index" :class="['cursor-pointer rounded', {
                                          'bg-blue-lighten-4 elevation-2': selectedActionIndex === index,
                                          'hover-bg-blue-lighten-5': selectedActionIndex !== index
                                        }]" @click="selectAction(index)" class="mb-2 transition-all"
                                          style="transition: all 0.2s ease">
                                          <v-list-item-title class="text-body-2 font-weight-medium">
                                            {{ action.name }}
                                            <v-icon v-if="action.isAdjusted" size="x-small" color="warning"
                                              class="ml-1">
                                              mdi-pencil
                                            </v-icon>
                                          </v-list-item-title>
                                          <v-list-item-subtitle class="mt-1">
                                            <v-chip :color="getScoreColor(action.score)" size="small" variant="flat">
                                              {{ action.score }}/10
                                            </v-chip>
                                            <span v-if="action.isAdjusted" class="text-caption text-warning ml-1">
                                              已调整
                                            </span>
                                          </v-list-item-subtitle>
                                        </v-list-item>
                                      </v-list>
                                    </v-card-text>
                                  </v-card>
                                </v-col>

                                <!-- 右侧评分详情 -->
                                <v-col cols="12" md="9" lg="10">
                                  <v-card elevation="1" class="h-100 bg-white">
                                    <v-card-text v-if="selectedAction" class="pa-4">
                                      <v-row>
                                        <v-col cols="12">
                                          <div class="text-h5 font-weight-bold mb-2" style="color: black;">{{
                                            selectedAction.name }}
                                          </div>
                                          <v-divider class="mb-4"></v-divider>
                                        </v-col>
                                      </v-row>

                                      <v-row>
                                        <!-- 技术评分 -->
                                        <v-col cols="12" md="6" lg="3">
                                          <v-card elevation="1" class="pa-3 h-100 score-card"
                                            style="border-radius: 12px;">
                                            <div class="text-subtitle-2 font-weight-bold mb-3 text-center"
                                              style="color: #2c3e50;">
                                              技术评分</div>
                                            <div class="d-flex justify-space-between align-center mb-2">
                                              <span class="text-body-2" style="color: #2c3e50;">动作难度</span>
                                              <span class="text-body-2 font-weight-bold" style="color: #42b883;">{{
                                                selectedAction.difficulty }}</span>
                                            </div>
                                            <v-progress-linear :model-value="selectedAction.difficulty * 10"
                                              color="#42b883" height="8" rounded class="mb-3"></v-progress-linear>

                                            <div class="d-flex justify-space-between align-center mb-2">
                                              <span class="text-body-2" style="color: #2c3e50;">执行质量</span>
                                              <span class="text-body-2 font-weight-bold" style="color: #42b883;">{{
                                                selectedAction.execution }}</span>
                                            </div>
                                            <v-progress-linear :model-value="selectedAction.execution * 10"
                                              color="#42b883" height="8" rounded></v-progress-linear>
                                          </v-card>
                                        </v-col>

                                        <!-- 表现评分 -->
                                        <v-col cols="12" md="6" lg="3">
                                          <v-card elevation="1" class="pa-3 h-100 score-card"
                                            style="border-radius: 12px;">
                                            <div class="text-subtitle-2 font-weight-bold mb-3 text-center"
                                              style="color: #2c3e50;">
                                              表现评分</div>
                                            <v-card-text class="pa-0">
                                              <div class="mb-3">
                                                <div class="d-flex justify-space-between mb-2">
                                                  <span class="text-body-2" style="color: #2c3e50;">动作幅度</span>
                                                  <span class="text-body-2 font-weight-bold" style="color: #42b883;">{{
                                                    selectedAction.amplitude }}/10</span>
                                                </div>
                                                <v-progress-linear :model-value="selectedAction.amplitude * 10"
                                                  color="#42b883" height="8" rounded></v-progress-linear>
                                              </div>
                                              <div class="mb-3">
                                                <div class="d-flex justify-space-between mb-2">
                                                  <span class="text-body-2" style="color: #2c3e50;">落地稳定</span>
                                                  <span class="text-body-2 font-weight-bold" style="color: #42b883;">{{
                                                    selectedAction.landing }}/10</span>
                                                </div>
                                                <v-progress-linear :model-value="selectedAction.landing * 10"
                                                  color="#42b883" height="8" rounded></v-progress-linear>
                                              </div>
                                              <div>
                                                <div class="d-flex justify-space-between mb-2">
                                                  <span class="text-body-2" style="color: #2c3e50;">节奏控制</span>
                                                  <span class="text-body-2 font-weight-bold" style="color: #42b883;">{{
                                                    selectedAction.timing }}/10</span>
                                                </div>
                                                <v-progress-linear :model-value="selectedAction.timing * 10"
                                                  color="#42b883" height="8" rounded></v-progress-linear>
                                              </div>
                                            </v-card-text>
                                          </v-card>
                                        </v-col>

                                        <!-- AI评语 -->
                                        <v-col cols="12" md="12" lg="6">
                                          <v-card elevation="1" class="pa-4 h-100 score-card"
                                            style="border-radius: 12px;">
                                            <div class="text-h6 font-weight-bold mb-4 text-center"
                                              style="color: #2c3e50;">AI评语</div>
                                            <v-list density="compact" class="bg-transparent">
                                              <v-list-item v-for="(comment, cIndex) in selectedAction.comments"
                                                :key="cIndex" class="mb-2"
                                                style="color: #2c3e50; line-height: 1.4; font-size: 16px; min-height: auto;">
                                                <template v-slot:prepend>
                                                  <v-icon size="small" color="#42b883"
                                                    class="mr-2 mt-1">mdi-circle-small</v-icon>
                                                </template>
                                                <v-list-item-title
                                                  style="font-size: 16px; font-weight: 400; white-space: normal;">
                                                  {{ comment }}
                                                </v-list-item-title>
                                              </v-list-item>
                                            </v-list>
                                            <div class="mt-4 text-center">
                                              <v-btn color="#42b883" size="large" variant="outlined"
                                                prepend-icon="mdi-pencil" @click="openManualAdjustment"
                                                style="text-transform: none; font-weight: 500; border-radius: 6px; font-size: 16px;">
                                                人工干预评分
                                              </v-btn>
                                            </div>
                                          </v-card>
                                        </v-col>
                                      </v-row>
                                    </v-card-text>

                                    <v-card-text v-else class="d-flex align-center justify-center"
                                      style="height: 300px;">
                                      <div class="text-center">
                                        <v-icon size="64" color="primary" class="mb-4">mdi-gesture-tap</v-icon>
                                        <div class="text-h6 font-weight-medium" style="color: black;">请选择招式</div>
                                        <div class="text-body-2" style="color: black;">点击左侧招式查看详细评分分析</div>
                                      </div>
                                    </v-card-text>
                                  </v-card>
                                </v-col>
                              </v-row>
                            </v-card-text>
                          </v-card>
                        </v-col>
                      </v-row>
                  </v-card>
                </v-col>
              </v-row>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 评分调整对话框 -->
    <v-dialog v-model="showScoreAdjustment" max-width="500px">
      <v-card>
        <v-card-title>
          <v-icon left>mdi-pencil-ruler</v-icon>
          人工干预评分
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-row>
              <v-col cols="12">
                <v-slider v-model="adjustmentScores.difficulty" label="动作难度分" min="0" max="10" step="0.1" thumb-label
                  color="primary"></v-slider>
              </v-col>
              <v-col cols="12">
                <v-slider v-model="adjustmentScores.fluidity" label="动作流畅分" min="0" max="10" step="0.1" thumb-label
                  color="success"></v-slider>
              </v-col>
              <v-col cols="12">
                <v-slider v-model="adjustmentScores.appearance" label="服饰评分" min="0" max="10" step="0.1" thumb-label
                  color="info"></v-slider>
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="adjustmentScores.reason" label="调整原因" rows="3" variant="outlined"></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="cancelScoreAdjustment">
            取消
          </v-btn>
          <v-btn color="primary" variant="text" @click="saveScoreAdjustment">
            保存调整
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 人工干预评分对话框 -->
    <v-dialog v-model="showManualAdjustment" max-width="500px">
      <v-card>
        <v-card-title>
          <v-icon left>mdi-pencil</v-icon>
          人工干预评分
        </v-card-title>
        <v-card-text>
          <v-form>
            <div class="text-subtitle-1 mb-4" style="color: black;">
              招式：{{ manualAdjustment.actionName }}
            </div>

            <v-text-field v-model.number="manualAdjustment.score" label="评分" type="number" min="0" max="10" step="0.1"
              variant="outlined" density="comfortable" hide-details="auto" class="mb-4"></v-text-field>

            <v-textarea v-model="manualAdjustment.reason" label="修改原因" rows="3" outlined dense
              placeholder="请详细说明修改评分的原因..." :rules="[v => !!v || '修改原因不能为空']"></v-textarea>

            <div class="text-caption text-grey mt-2">
              当前评分：{{ selectedAction?.score || 0 }}/10
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" text @click="showManualAdjustment = false">取消</v-btn>
          <v-btn color="primary" @click="saveManualAdjustment" :disabled="!manualAdjustment.reason.trim()">
            保存修改
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'

// 视频引用
const mainVideo = ref(null)
const frontVideo = ref(null)
const sideVideo = ref(null)
const backVideo = ref(null)

// 选中的比赛
const selectedMatch = ref(null)

// 当前视角
const currentPerspective = ref('front')

// AI评分数据
const aiScores = ref({
  difficulty: 8.5,
  fluidity: 7.8,
  appearance: 9.2
})

// 动作细节评分
const actionDetails = ref([
  {
    name: '腾空摆莲720°',
    score: 8.8,
    difficulty: 9.2,
    execution: 8.5,
    amplitude: 8.7,
    landing: 8.8,
    timing: 9.0,
    comments: ['旋转角度完整', '空中姿态优美', '落地稳定性好']
  },
  {
    name: '旋风脚360°',
    score: 7.9,
    difficulty: 7.5,
    execution: 8.2,
    amplitude: 8.0,
    landing: 7.8,
    timing: 8.0,
    comments: ['转体速度略慢', '空中分腿不够充分', '落地有轻微晃动']
  },
  {
    name: '侧空翻',
    score: 8.5,
    difficulty: 8.0,
    execution: 8.8,
    amplitude: 8.5,
    landing: 8.2,
    timing: 8.5,
    comments: ['空中姿态控制良好', '翻转速度适中', '落地重心略偏']
  },
  {
    name: '后手翻',
    score: 8.2,
    difficulty: 7.8,
    execution: 8.5,
    amplitude: 8.0,
    landing: 8.0,
    timing: 8.5,
    comments: ['手部支撑有力', '身体线条流畅', '动作连贯性好']
  },
  {
    name: '鲤鱼打挺',
    score: 9.0,
    difficulty: 8.5,
    execution: 9.2,
    amplitude: 8.8,
    landing: 9.0,
    timing: 9.5,
    comments: ['爆发力出色', '动作干净利落', '节奏感强']
  }
])

// 动作跳转相关数据
const currentActionIndex = ref(0)
const actionTimestamps = ref([
  { start: 0, end: 5, name: '准备动作' },
  { start: 5, end: 12, name: '腾空摆莲720°' },
  { start: 12, end: 18, name: '旋风脚360°' },
  { start: 18, end: 25, name: '侧空翻' },
  { start: 25, end: 32, name: '后手翻' },
  { start: 32, end: 40, name: '鲤鱼打挺' }
])

// 评分调整对话框
const showScoreAdjustment = ref(false)
const adjustmentScores = ref({
  difficulty: 0,
  fluidity: 0,
  appearance: 0,
  reason: ''
})

// 当前视频地址
const currentVideoUrl = computed(() => {
  if (!selectedMatch.value) return null

  switch (currentPerspective.value) {
    case 'front':
      return selectedMatch.value.videoFront || selectedMatch.value.videoUrl
    case 'side':
      return selectedMatch.value.videoSide || selectedMatch.value.videoUrl
    case 'back':
      return selectedMatch.value.videoBack || selectedMatch.value.videoUrl
    default:
      return selectedMatch.value.videoUrl
  }
})

// 筛选条件
const selectedEvent = ref('')
const selectedDate = ref('')
const searchKeyword = ref('')

// 比赛项目选项
const eventOptions = ['太极拳', '长拳', '南拳', '剑术', '刀术']

// 模拟比赛数据（添加更多字段用于筛选）
const matches = ref([
  {
    id: 1,
    title: '场次 001 - 张三 vs 李四',
    event: '太极拳',
    time: '10:30',
    date: '2024-01-15',
    player1: '张三',
    player2: '李四',
    videoUrl: 'https://wushu-demo.oss-cn-beijing.aliyuncs.com/%E8%A7%86%E9%A2%91demo.mp4',
    videoFront: 'https://wushu-demo.oss-cn-beijing.aliyuncs.com/%E8%A7%86%E9%A2%91demo.mp4',
    videoSide: 'https://v.xinmin.cn/uploads/videos/2024/12/30/BFOL852349.mp4',
    videoBack: 'https://wushu-demo.oss-cn-beijing.aliyuncs.com/%E8%A7%86%E9%A2%91demo_back.mp4'
  },
  {
    id: 2,
    title: '场次 002 - 王五 vs 赵六',
    event: '长拳',
    time: '11:00',
    date: '2024-01-15',
    player1: '王五',
    player2: '赵六',
    videoUrl: 'https://v.xinmin.cn/uploads/videos/2024/12/30/BFOL852349.mp4',
    videoFront: 'https://v.xinmin.cn/uploads/videos/2024/12/30/BFOL852349_front.mp4',
    videoSide: 'https://v.xinmin.cn/uploads/videos/2024/12/30/BFOL852349_side.mp4',
    videoBack: 'https://v.xinmin.cn/uploads/videos/2024/12/30/BFOL852349_back.mp4'
  },
  {
    id: 3,
    title: '场次 003 - 陈七 vs 刘八',
    event: '南拳',
    time: '11:30',
    date: '2024-01-15',
    player1: '陈七',
    player2: '刘八',
    videoUrl: '/videos/match003.mp4',
    videoFront: '/videos/match003_front.mp4',
    videoSide: '/videos/match003_side.mp4',
    videoBack: '/videos/match003_back.mp4'
  },
  {
    id: 4,
    title: '场次 004 - 孙九 vs 周十',
    event: '太极拳',
    time: '14:00',
    date: '2024-01-16',
    player1: '孙九',
    player2: '周十',
    videoUrl: '/videos/match004.mp4',
    videoFront: '/videos/match004_front.mp4',
    videoSide: '/videos/match004_side.mp4',
    videoBack: '/videos/match004_back.mp4'
  },
  {
    id: 5,
    title: '场次 005 - 吴一 vs 郑二',
    event: '剑术',
    time: '14:30',
    date: '2024-01-16',
    player1: '吴一',
    player2: '郑二',
    videoUrl: '/videos/match005.mp4',
    videoFront: '/videos/match005_front.mp4',
    videoSide: '/videos/match005_side.mp4',
    videoBack: '/videos/match005_back.mp4'
  },
  {
    id: 6,
    title: '场次 006 - 王二 vs 张三',
    event: '刀术',
    time: '15:00',
    date: '2024-01-16',
    player1: '王二',
    player2: '张三',
    videoUrl: '/videos/match006.mp4',
    videoFront: '/videos/match006_front.mp4',
    videoSide: '/videos/match006_side.mp4',
    videoBack: '/videos/match006_back.mp4'
  },
  {
    id: 7,
    title: '场次 007 - 李四 vs 王五',
    event: '太极拳',
    time: '15:30',
    date: '2024-01-16',
    player1: '李四',
    player2: '王五',
    videoUrl: '/videos/match007.mp4',
    videoFront: '/videos/match007_front.mp4',
    videoSide: '/videos/match007_side.mp4',
    videoBack: '/videos/match007_back.mp4'
  },
  {
    id: 8,
    title: '场次 008 - 赵六 vs 孙七',
    event: '长拳',
    time: '16:00',
    date: '2024-01-16',
    player1: '赵六',
    player2: '孙七',
    videoUrl: '/videos/match008.mp4',
    videoFront: '/videos/match008_front.mp4',
    videoSide: '/videos/match008_side.mp4',
    videoBack: '/videos/match008_back.mp4'
  },
  {
    id: 9,
    title: '场次 009 - 周八 vs 吴九',
    event: '南拳',
    time: '16:30',
    date: '2024-01-16',
    player1: '周八',
    player2: '吴九',
    videoUrl: '/videos/match009.mp4',
    videoFront: '/videos/match009_front.mp4',
    videoSide: '/videos/match009_side.mp4',
    videoBack: '/videos/match009_back.mp4'
  },
  {
    id: 10,
    title: '场次 010 - 郑十 vs 王十一',
    event: '剑术',
    time: '17:00',
    date: '2024-01-16',
    player1: '郑十',
    player2: '王十一',
    videoUrl: '/videos/match010.mp4',
    videoFront: '/videos/match010_front.mp4',
    videoSide: '/videos/match010_side.mp4',
    videoBack: '/videos/match010_back.mp4'
  },
  {
    id: 11,
    title: '场次 011 - 王十二 vs 郑十三',
    event: '刀术',
    time: '17:30',
    date: '2024-01-16',
    player1: '王十二',
    player2: '郑十三',
    videoUrl: '/videos/match011.mp4',
    videoFront: '/videos/match011_front.mp4',
    videoSide: '/videos/match011_side.mp4',
    videoBack: '/videos/match011_back.mp4'
  },
  {
    id: 12,
    title: '场次 012 - 王十三 vs 郑十四',
    event: '刀术',
    time: '18:00',
    date: '2024-01-16',
    player1: '王十三',
    player2: '郑十四',
    videoUrl: '/videos/match012.mp4',
    videoFront: '/videos/match012_front.mp4',
    videoSide: '/videos/match012_side.mp4',
    videoBack: '/videos/match012_back.mp4'
  },
  {
    id: 13,
    title: '场次 013 - 王十四 vs 郑十五',
    event: '刀术',
    time: '18:30',
    date: '2024-01-16',
    player1: '王十四',
    player2: '郑十五',
    videoUrl: '/videos/match013.mp4',
    videoFront: '/videos/match013_front.mp4',
    videoSide: '/videos/match013_side.mp4',
    videoBack: '/videos/match013_back.mp4'
  },

])

// 筛选后的比赛列表
const filteredMatches = computed(() => {
  return matches.value.filter(match => {
    // 比赛项目筛选
    if (selectedEvent.value && match.event !== selectedEvent.value) {
      return false
    }

    // 日期筛选
    if (selectedDate.value && match.date !== selectedDate.value) {
      return false
    }

    // 选手姓名搜索
    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase()
      const title = match.title.toLowerCase()
      const player1 = match.player1.toLowerCase()
      const player2 = match.player2.toLowerCase()

      return title.includes(keyword) ||
        player1.includes(keyword) ||
        player2.includes(keyword)
    }

    return true
  })
})

// 选择比赛场次
const selectMatch = (match) => {
  selectedMatch.value = match
  currentPerspective.value = 'front'
  console.log('选择的比赛:', match)
  // 重置所有视频
  nextTick(() => {
    syncAllVideos()
  })
}

// 切换视角
const switchPerspective = (perspective) => {
  currentPerspective.value = perspective
}

// 获取视角显示名称
const getPerspectiveName = (perspective) => {
  const names = {
    'front': '正面视角',
    'side': '侧面视角',
    'back': '背面视角'
  }
  return names[perspective] || '未知视角'
}

// 视频加载完成
const onVideoLoaded = () => {
  syncAllVideos()
}

// 视角视频加载完成
const onPerspectiveLoaded = () => {
  syncAllVideos()
}

// 同步所有视频进度
const syncAllVideos = () => {
  if (!mainVideo.value) return

  const currentTime = mainVideo.value.currentTime || 0
  const isPlaying = !mainVideo.value.paused

  // 同步小窗口视频
  const perspectiveVideos = [frontVideo.value, sideVideo.value, backVideo.value]
  perspectiveVideos.forEach(video => {
    if (video) {
      // 确保静音
      video.muted = true
      // 同步时间
      if (Math.abs(video.currentTime - currentTime) > 0.3) {
        video.currentTime = currentTime
      }
      // 同步播放状态
      if (isPlaying && video.paused) {
        video.play().catch(() => { }) // 静默处理自动播放错误
      } else if (!isPlaying && !video.paused) {
        video.pause()
      }
    }
  })
}

// 主视频时间更新时同步
const syncVideoTime = () => {
  syncAllVideos()
}

// 应用筛选
const applyFilters = () => {
  console.log('应用筛选:', {
    event: selectedEvent.value,
    date: selectedDate.value,
    keyword: searchKeyword.value
  })
}

// 重置筛选
const resetFilters = () => {
  selectedEvent.value = ''
  selectedDate.value = ''
  searchKeyword.value = ''
  selectedMatch.value = null
  console.log('重置筛选')
}

// 处理视频加载错误
const handleVideoError = () => {
  console.error('视频加载失败，请检查视频路径')
}

// 获取分数颜色
const getScoreColor = (score) => {
  if (score >= 9) return 'success'
  if (score >= 7) return 'warning'
  return 'error'
}

// 打开评分调整对话框
const openScoreAdjustment = () => {
  adjustmentScores.value = {
    difficulty: aiScores.value.difficulty,
    fluidity: aiScores.value.fluidity,
    appearance: aiScores.value.appearance,
    reason: ''
  }
  showScoreAdjustment.value = true
}

// 保存评分调整
const saveScoreAdjustment = () => {
  aiScores.value.difficulty = adjustmentScores.value.difficulty
  aiScores.value.fluidity = adjustmentScores.value.fluidity
  aiScores.value.appearance = adjustmentScores.value.appearance

  console.log('评分已调整:', adjustmentScores.value)
  showScoreAdjustment.value = false

  // 这里可以添加API调用保存调整记录
}

// 取消评分调整
const cancelScoreAdjustment = () => {
  showScoreAdjustment.value = false
  adjustmentScores.value = {
    difficulty: aiScores.value.difficulty,
    fluidity: aiScores.value.fluidity,
    appearance: aiScores.value.appearance,
    reason: ''
  }
}

// 展开/收起动作详情
const expandedActions = ref([])
const toggleActionDetail = (index) => {
  const idx = expandedActions.value.indexOf(index)
  if (idx > -1) {
    expandedActions.value.splice(idx, 1)
  } else {
    expandedActions.value.push(index)
  }
}
const isActionExpanded = (index) => expandedActions.value.includes(index)

// 选择动作详情
const selectedActionIndex = ref(0)
const selectedAction = computed(() => actionDetails.value[selectedActionIndex.value])

const selectAction = (index) => {
  selectedActionIndex.value = index
}

// 人工干预评分相关
const showManualAdjustment = ref(false)
const manualAdjustment = ref({
  score: 0,
  reason: '',
  actionName: ''
})

const openManualAdjustment = () => {
  if (selectedAction.value) {
    manualAdjustment.value = {
      score: selectedAction.value.score,
      reason: '',
      actionName: selectedAction.value.name
    }
    showManualAdjustment.value = true
  }
}

const saveManualAdjustment = () => {
  if (selectedAction.value && manualAdjustment.value.reason.trim()) {
    // 更新动作评分
    const index = selectedActionIndex.value
    actionDetails.value[index].score = manualAdjustment.value.score
    actionDetails.value[index].manualScore = manualAdjustment.value.score
    actionDetails.value[index].adjustmentReason = manualAdjustment.value.reason
    actionDetails.value[index].isAdjusted = true

    // 关闭对话框
    showManualAdjustment.value = false

    // 显示成功提示
    // 可以在这里添加提示信息
  }
}

// 格式化时间（秒 → mm:ss）
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 动作跳转方法
const previousAction = () => {
  if (currentActionIndex.value > 0) {
    currentActionIndex.value--
    jumpToAction()
  }
}

const nextAction = () => {
  if (currentActionIndex.value < actionTimestamps.value.length - 1) {
    currentActionIndex.value++
    jumpToAction()
  }
}

const playCurrentAction = () => {
  jumpToAction()
  mainVideo.value?.play()
}

const jumpToAction = () => {
  const action = actionTimestamps.value[currentActionIndex.value]
  if (action && mainVideo.value) {
    mainVideo.value.currentTime = action.start
    mainVideo.value.play()
  }
}
</script>

<style scoped>
.replay-container {
  background-color: #f0f2f5;
  background-image: linear-gradient(135deg, #f0f2f5 0%, #e4e7ed 100%);
  min-height: auto;
  padding: 20px;
  font-family: 'Microsoft YaHei', sans-serif;
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
  border: none;
  transition: transform 0.3s, box-shadow 0.3s;
}

.replay-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.video-player {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.match-list {
  border-radius: 8px;
  position: relative;
}

.sticky-title {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  border-bottom: 1px solid #f0f0f0;
}

.video-element {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: #000;
}

.perspective-card {
  border: 2px solid transparent;
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
  border-radius: 12px;
}

.perspective-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.perspective-card.active {
  border-color: #42b883;
  background-color: rgba(66, 184, 131, 0.1);
}

.perspective-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

.match-item {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.match-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.selected-match {
  border-left: 4px solid #42b883;
  background-color: rgba(66, 184, 131, 0.1);
}

.cursor-pointer {
  cursor: pointer;
}

/* AI评分卡片样式 */
.score-card {
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.score-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.score-display {
  text-align: center;
  margin-bottom: 12px;
}

.score-value {
  font-size: 2rem;
  font-weight: bold;
  color: #42b883;
}

.score-max {
  font-size: 1rem;
  color: #666;
  margin-left: 4px;
}

.action-item {
  border-radius: 8px;
  margin-bottom: 8px;
}

.difficulty-score .score-value {
  color: #42b883;
}

.fluidity-score .score-value {
  color: #42b883;
}

.appearance-score .score-value {
  color: #42b883;
}

:deep(.v-btn) {
  text-transform: none;
  font-weight: 500;
  border-radius: 6px;
}

:deep(.v-card-title) {
  font-weight: 600;
}

@media (max-width: 768px) {
  .replay-container {
    padding: 10px;
  }

  .replay-title {
    font-size: 1.5rem;
  }
}
</style>