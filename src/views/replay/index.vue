<template>
  <v-container fluid class="replay-container">

    <!-- 比赛信息展示区域 -->
    <v-row>
      <v-col cols="12">
        <v-card class="competition-info-card mb-4">
          <v-card-text>
            <div class="d-flex justify-space-between align-center">
              <!-- 左侧：比赛名称和类型 -->
              <div>
                <h4 class="mb-1">{{ selectedMatch?.title || '暂无比赛' }}</h4>
                <p class="text-muted mb-0">{{ selectedMatch?.event || '未指定' }}</p>
              </div>
              <!-- 右侧：当前选手和上场顺序 -->
              <div class="text-end">
                <div class="fw-bold">当前选手: {{ selectedMatch?.player1 || '暂无选手' }}</div>
                <div class="text-muted">上场顺序: {{ selectedMatch?.order || 1 }}</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
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



          <!-- 第一行：动作控制 + 主视频 + 比赛场次 -->
          <v-row>
            <!-- 左侧动作控制器和视角预览 -->
            <v-col cols="12" lg="2" class="d-flex flex-column">
              <v-card class="flex-grow-1 d-flex flex-column replay-card" style="min-height: 200px;">
                <v-card-title class="text-subtitle-1 font-weight-medium">
                  动作控制
                </v-card-title>
                <v-card-text class="flex-grow-1 d-flex flex-column justify-center">
                  <div class="text-center mb-4">
                    <div class="text-h6">{{ actionTimestamps[currentActionIndex]?.name || '准备动作' }}</div>
                    <div class="text-caption">{{ formatTime(actionTimestamps[currentActionIndex]?.start || 0) }} - {{
                      formatTime(actionTimestamps[currentActionIndex]?.end || 0) }}</div>
                    <div class="text-caption">第 {{ currentActionIndex + 1 }} / {{ actionTimestamps.length }} 个动作</div>
                  </div>
                  <div class="d-flex flex-column align-center">
                    <v-btn color="primary" prepend-icon="mdi-skip-previous" @click="previousAction"
                      :disabled="currentActionIndex <= 0" class="mb-2" style="min-width: 140px;">
                      上一个动作
                    </v-btn>
                    <v-btn color="primary" prepend-icon="mdi-skip-next" @click="nextAction"
                      :disabled="currentActionIndex >= actionTimestamps.length - 1" class="mb-2" style="min-width: 140px;">
                      下一个动作
                    </v-btn>
                    <v-btn color="secondary" prepend-icon="mdi-play" @click="playCurrentAction" style="min-width: 140px;">
                      播放当前
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>

              <!-- 视角预览区域 -->
              <v-card class="flex-grow-1 mt-3 replay-card">
                <v-card-title class="text-subtitle-1 font-weight-medium">
                  视角预览
                </v-card-title>
                <v-card-text>
                  <v-row class="flex-column align-center" dense>
                    <v-col cols="8">
                      <v-card :class="['perspective-card', { 'active': currentPerspective === 'front' }]"
                        @click="switchPerspective('front')" class="text-center cursor-pointer"
                        style="aspect-ratio: 16/9; max-height: 80px;">
                        <video v-if="selectedMatch.videoFront" ref="frontVideo" :src="selectedMatch.videoFront" muted
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
                        <video v-if="selectedMatch.videoSide" ref="sideVideo" :src="selectedMatch.videoSide" muted
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
                        <video v-if="selectedMatch.videoBack" ref="backVideo" :src="selectedMatch.videoBack" muted
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
            <v-col cols="12" lg="10">
              <v-card class="video-player" style="aspect-ratio: 16/9; max-height: 600px;">
                <!-- 主视频窗口 -->
                <video v-if="currentVideoUrl" ref="mainVideo" :src="currentVideoUrl" controls autoplay
                  class="video-element" @error="handleVideoError" @loadedmetadata="onVideoLoaded"
                  @timeupdate="syncVideoTime" style="width: 100%; height: 100%; object-fit: cover;">
                  您的浏览器不支持视频播放。
                </video>
                <v-card-text v-else class="text-center d-flex flex-column align-center justify-center"
                  style="height: 100%;">
                  <v-icon size="64" color="grey">mdi-video-off</v-icon>
                  <p class="text-h6 mt-4">暂无视频回放</p>
                  <p>暂无可用比赛数据</p>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- 第二行：实时评分和AI分析 -->
            <v-row>
              <v-col cols="12">
                <v-card class="score-analysis-card" elevation="0">
                  <v-card-text >
                    <v-row>
                      <!-- 实时评分框 -->
                      <v-col cols="12" lg="3" md="4" sm="6">
                        <v-card elevation="1" class="real-time-score-panel">
                          <v-card-title class="text-subtitle-1 font-weight-medium">
                            实时评分
                          </v-card-title>
                          <v-card-text>
                            <div class="score-display-grid">
                              <div class="score-item difficulty-score">
                                <div class="score-header">
                                  <v-icon size="20" color="info">mdi-trending-up</v-icon>
                                  <span class="score-title">难度分</span>
                                </div>
                                <div class="score-value-container">
                                  <span class="score-number">{{ realTimeScores.difficulty.toFixed(1) }}</span>
                                  <span class="score-total">/10</span>
                                </div>
                              </div>

                              <div class="score-item completion-score">
                                <div class="score-header">
                                  <v-icon size="20" color="success">mdi-check-circle-outline</v-icon>
                                  <span class="score-title">完成分</span>
                                </div>
                                <div class="score-value-container">
                                  <span class="score-number">{{ realTimeScores.completion.toFixed(1) }}</span>
                                  <span class="score-total">/10</span>
                                </div>
                              </div>

                              <div class="score-item final-score-item">
                                <div class="score-header">
                                  <v-icon size="20" color="primary">mdi-star-circle-outline</v-icon>
                                  <span class="score-title">最终得分</span>
                                </div>
                                <div class="score-value-container final">
                                  <span class="score-number final">{{ finalScore }}</span>
                                  <span class="score-total">/10</span>
                                </div>
                              </div>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>

                      <!-- AI评分和分析功能 -->
                      <v-col cols="12" lg="9" md="8" sm="6">
                        <v-card elevation="1" class="ai-score-panel">
                          <v-card-title class="text-subtitle-1 font-weight-medium">
                            AI评分与分析
                          </v-card-title>
                          <v-card-text>
                            <v-row>
                              <!-- AI评分显示 -->
                              <v-col cols="12" md="4">
                                <v-card class="ai-score-display" elevation="0">
                                  <div class="ai-score-header">
                                    <v-icon size="18" color="purple">mdi-robot</v-icon>
                                    <span class="ai-score-title">AI评分</span>
                                  </div>
                                  <div class="ai-score-value">
                                    <span class="ai-score-number">{{ aiScore.toFixed(1) }}</span>
                                    <span class="ai-score-total">/10</span>
                                  </div>

                                </v-card>
                              </v-col>

                              <!-- 功能按钮 -->
                              <v-col cols="12" md="8">
                                <v-row class="function-buttons">
                                  <v-col cols="12" sm="4">
                                    <v-btn block color="primary" variant="tonal" size="default"
                                      prepend-icon="mdi-human-edit" @click="toggleManualScoring" class="function-btn">
                                      {{ showManualScoringPanel ? '收起评分' : '人工评分' }}
                                    </v-btn>
                                  </v-col>

                                  <v-col cols="12" sm="4">
                                    <v-btn block color="success" variant="tonal" size="default"
                                      prepend-icon="mdi-chart-line" @click="openAIAnalysis" class="function-btn">
                                      {{ showAIAnalysisResult ? '收起分析' : 'AI分析' }}
                                    </v-btn>
                                  </v-col>
                                </v-row>
                              </v-col>
                            </v-row>

                            <!-- AI分析结果展示 -->
                            <v-expand-transition>
                              <div v-if="showAIAnalysisResult" class="ai-analysis-result">
                                <v-divider class="my-4"></v-divider>
                                <v-card elevation="0" class="analysis-content-card">
                                  <v-card-text class="pa-4">
                                    <div class="analysis-header">
                                      <span class="analysis-title text-subtitle-2 font-weight-medium">招式评分详情</span>
                                    </div>
                                    
                                    <!-- 招式评分表格 -->
                                    <v-table class="move-scoring-table mt-3" density="compact">
                                      <thead>
                                        <tr>
                                          <th class="text-left">评分项目</th>
                                          <th class="text-center">实时评分</th>
                                          <th class="text-center">AI评分</th>
                                          <th class="text-center">差异</th>
                                          <th class="text-left">评分说明</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td><strong>难度分</strong></td>
                                          <td class="text-center">{{ realTimeScores.difficulty.toFixed(1) }}</td>
                                          <td class="text-center">{{ aiDifficultyScore.toFixed(1) }}</td>
                                          <td class="text-center">
                                            <v-chip 
                                              size="small" 
                                              :color="Math.abs(realTimeScores.difficulty - aiDifficultyScore) < 0.5 ? 'success' : Math.abs(realTimeScores.difficulty - aiDifficultyScore) < 1.0 ? 'warning' : 'error'"
                                              variant="tonal"
                                            >
                                              {{ (realTimeScores.difficulty - aiDifficultyScore).toFixed(1) }}
                                            </v-chip>
                                          </td>
                                          <td>动作难度系数及完成复杂度评估</td>
                                        </tr>
                                        <tr>
                                          <td><strong>完成分</strong></td>
                                          <td class="text-center">{{ realTimeScores.completion.toFixed(1) }}</td>
                                          <td class="text-center">{{ aiCompletionScore.toFixed(1) }}</td>
                                          <td class="text-center">
                                            <v-chip 
                                              size="small" 
                                              :color="Math.abs(realTimeScores.completion - aiCompletionScore) < 0.5 ? 'success' : Math.abs(realTimeScores.completion - aiCompletionScore) < 1.0 ? 'warning' : 'error'"
                                              variant="tonal"
                                            >
                                              {{ (realTimeScores.completion - aiCompletionScore).toFixed(1) }}
                                            </v-chip>
                                          </td>
                                          <td>动作完成度及技术规范程度评估</td>
                                        </tr>
                                        <tr>
                                          <td><strong>技术规范</strong></td>
                                          <td class="text-center">-</td>
                                          <td class="text-center">{{ technicalScore }}</td>
                                          <td class="text-center">-</td>
                                          <td>动作技术标准及规范性评估</td>
                                        </tr>
                                        <tr>
                                          <td><strong>动作流畅</strong></td>
                                          <td class="text-center">-</td>
                                          <td class="text-center">{{ fluencyScore }}</td>
                                          <td class="text-center">-</td>
                                          <td>动作连贯性及节奏感评估</td>
                                        </tr>
                                      </tbody>
                                    </v-table>
                                    
                                    <!-- AI分析总结 -->
                                    <div class="analysis-summary mt-4">
                                      <div class="analysis-content">{{ aiAnalysisResult }}</div>
                                    </div>
                                  </v-card-text>
                                </v-card>
                              </div>
                            </v-expand-transition>

                            <!-- 人工评分面板 -->
                            <v-expand-transition>
                              <div v-if="showManualScoringPanel" class="manual-scoring-panel">
                                <v-divider class="my-4"></v-divider>
                                <v-card elevation="0" class="manual-scoring-content">
                                  <v-card-text class="pa-4">
                                    <div class="manual-scoring-header">
                                      <span class="manual-scoring-title text-subtitle-2 font-weight-medium">人工评分</span>
                                      <v-chip size="small" color="primary" variant="flat">
                                        专业评分
                                      </v-chip>
                                    </div>
                                    <v-row class="mt-3">
                                      <v-col cols="12" md="4">
                                        <div class="scoring-control">
                                          <div class="section-header mb-3">
                                            <span class="section-title text-subtitle-2 font-weight-medium">难度分</span>
                                            <v-chip size="small" color="primary" variant="tonal">
                                              精确到0.1分
                                            </v-chip>
                                          </div>
                                          <div class="score-display mb-3">
                                            <div class="current-score-circle">
                                              <div class="score-inner-circle">
                                                <div class="score-number-display">{{ manualDifficultyScore.toFixed(1) }}</div>
                                                <div class="score-label-display">难度分</div>
                                              </div>
                                            </div>
                                          </div>
                                          <v-slider v-model="manualDifficultyScore" :min="0" :max="10" :step="0.1" color="primary"
                                            track-color="grey-lighten-2" thumb-size="20" track-size="6"
                                            class="compact-score-slider" hide-details></v-slider>
                                          <div class="score-controls mt-2">
                                            <v-btn icon="mdi-minus" size="x-small" variant="tonal"
                                              @click="manualDifficultyScore = Math.max(0, manualDifficultyScore - 0.5)"></v-btn>
                                            <span class="score-range mx-2">{{ manualDifficultyScore.toFixed(1) }} / 10</span>
                                            <v-btn icon="mdi-plus" size="x-small" variant="tonal"
                                              @click="manualDifficultyScore = Math.min(10, manualDifficultyScore + 0.5)"></v-btn>
                                          </div>
                                        </div>
                                      </v-col>
                                      <v-col cols="12" md="4">
                                        <div class="scoring-control">
                                          <div class="section-header mb-3">
                                            <span class="section-title text-subtitle-2 font-weight-medium">完成分</span>
                                            <v-chip size="small" color="success" variant="tonal">
                                              精确到0.1分
                                            </v-chip>
                                          </div>
                                          <div class="score-display mb-3">
                                            <div class="current-score-circle">
                                              <div class="score-inner-circle">
                                                <div class="score-number-display">{{ manualCompletionScore.toFixed(1) }}</div>
                                                <div class="score-label-display">完成分</div>
                                              </div>
                                            </div>
                                          </div>
                                          <v-slider v-model="manualCompletionScore" :min="0" :max="10" :step="0.1" color="success"
                                            track-color="grey-lighten-2" thumb-size="20" track-size="6"
                                            class="compact-score-slider" hide-details></v-slider>
                                          <div class="score-controls mt-2">
                                            <v-btn icon="mdi-minus" size="x-small" variant="tonal"
                                              @click="manualCompletionScore = Math.max(0, manualCompletionScore - 0.5)"></v-btn>
                                            <span class="score-range mx-2">{{ manualCompletionScore.toFixed(1) }} / 10</span>
                                            <v-btn icon="mdi-plus" size="x-small" variant="tonal"
                                              @click="manualCompletionScore = Math.min(10, manualCompletionScore + 0.5)"></v-btn>
                                          </div>
                                        </div>
                                      </v-col>
                                      <v-col cols="12" md="4">
                                        <div class="scoring-reason">
                                          <div class="section-header mb-3">
                                            <span class="section-title text-subtitle-2 font-weight-medium">评分说明</span>
                                          </div>
                                          <v-textarea v-model="scoringReason" placeholder="请输入评分理由或建议..." rows="3"
                                            variant="outlined" density="compact" hide-details></v-textarea>
                                          <div class="scoring-actions mt-3">
                                            <v-btn color="primary" variant="elevated" size="small"
                                              @click="saveManualScore" :loading="savingScore" block>
                                              <v-icon start>mdi-check</v-icon>
                                              确认评分
                                            </v-btn>
                                          </div>
                                        </div>
                                      </v-col>
                                    </v-row>
                                  </v-card-text>
                                </v-card>
                              </div>
                            </v-expand-transition>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

          </v-row>
        </v-card-text>
        </v-card>
      </v-col>
    </v-row>


  </v-container>

  <!-- 人工评分对话框 -->
  <v-dialog v-model="showManualScoringDialog" max-width="500" persistent>
    <v-card class="manual-scoring-dialog">
      <!-- 头部标题 -->
      <v-card-title class="dialog-header text-center py-4">
        <div class="header-content">
          <div class="text-subtitle-1 font-weight-medium">人工评分</div>
          <div class="text-caption text-grey">调整当前动作评分</div>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <!-- 评分内容区域 -->
      <v-card-text class="pa-6">
        <!-- 当前评分显示 -->
        <div class="current-score-display mb-6">
          <v-row>
            <v-col cols="6">
              <div class="score-circle">
                <div class="score-inner">
                  <div class="score-number">{{ manualDifficultyScore.toFixed(1) }}</div>
                  <div class="score-label">难度分</div>
                </div>
              </div>
            </v-col>
            <v-col cols="6">
              <div class="score-circle">
                <div class="score-inner">
                  <div class="score-number">{{ manualCompletionScore.toFixed(1) }}</div>
                  <div class="score-label">完成分</div>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>

        <!-- 评分滑块区域 -->
        <div class="scoring-section mb-4">
          <v-row>
            <v-col cols="12">
              <div class="section-header mb-3">
                <span class="section-title text-subtitle-2 font-weight-medium">调整评分</span>
                <v-chip size="small" color="primary" variant="tonal">
                  精确到0.1分
                </v-chip>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="text-subtitle-2 mb-2">难度分</div>
              <v-slider v-model="manualDifficultyScore" :min="0" :max="10" :step="0.1" color="primary" track-color="grey-lighten-2"
                thumb-size="24" track-size="8" class="score-slider">
                <template v-slot:prepend>
                  <v-btn icon="mdi-minus" size="small" variant="tonal"
                    @click="manualDifficultyScore = Math.max(0, manualDifficultyScore - 0.5)"></v-btn>
                </template>
                <template v-slot:append>
                  <v-btn icon="mdi-plus" size="small" variant="tonal"
                    @click="manualDifficultyScore = Math.min(10, manualDifficultyScore + 0.5)"></v-btn>
                </template>
              </v-slider>
              <div class="text-center text-caption">{{ manualDifficultyScore.toFixed(1) }} / 10</div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="text-subtitle-2 mb-2">完成分</div>
              <v-slider v-model="manualCompletionScore" :min="0" :max="10" :step="0.1" color="success" track-color="grey-lighten-2"
                thumb-size="24" track-size="8" class="score-slider">
                <template v-slot:prepend>
                  <v-btn icon="mdi-minus" size="small" variant="tonal"
                    @click="manualCompletionScore = Math.max(0, manualCompletionScore - 0.5)"></v-btn>
                </template>
                <template v-slot:append>
                  <v-btn icon="mdi-plus" size="small" variant="tonal"
                    @click="manualCompletionScore = Math.min(10, manualCompletionScore + 0.5)"></v-btn>
                </template>
              </v-slider>
              <div class="text-center text-caption">{{ manualCompletionScore.toFixed(1) }} / 10</div>
            </v-col>
          </v-row>

          <!-- 评分等级显示 -->
          <div class="score-levels mt-4">
            <v-row>
              <v-col cols="3" class="text-center">
                <div class="level-item" :class="{ active: manualDifficultyScore < 4 }">
                  <div class="level-text">待改进</div>
                  <div class="level-range">0-3.9</div>
                </div>
              </v-col>
              <v-col cols="3" class="text-center">
                <div class="level-item" :class="{ active: manualDifficultyScore >= 4 && manualDifficultyScore < 6 }">
                  <div class="level-text">一般</div>
                  <div class="level-range">4-5.9</div>
                </div>
              </v-col>
              <v-col cols="3" class="text-center">
                <div class="level-item" :class="{ active: manualDifficultyScore >= 6 && manualDifficultyScore < 8 }">
                  <div class="level-text">良好</div>
                  <div class="level-range">6-7.9</div>
                </div>
              </v-col>
              <v-col cols="3" class="text-center">
                <div class="level-item" :class="{ active: manualDifficultyScore >= 8 }">
                  <div class="level-text">优秀</div>
                  <div class="level-range">8-10</div>
                </div>
              </v-col>
            </v-row>
          </div>
        </div>

        <!-- 评分原因输入 -->
        <div class="reason-section">
          <div class="section-header mb-3">
            <span class="section-title text-subtitle-2 font-weight-medium">评分说明</span>
            <span class="text-caption text-grey">可选</span>
          </div>
          <v-textarea v-model="scoringReason" placeholder="请输入评分理由或建议..." rows="2" variant="outlined"
            density="comfortable" hide-details></v-textarea>
        </div>
      </v-card-text>

      <v-divider></v-divider>

      <!-- 底部按钮 -->
      <v-card-actions class="pa-4">
        <v-btn color="grey" variant="tonal" @click="closeManualScoring" class="action-btn">
          取消
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="elevated" @click="saveManualScore" class="action-btn" :loading="savingScore">
          确认评分
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'

// 视频引用
const mainVideo = ref(null)
const frontVideo = ref(null)
const sideVideo = ref(null)
const backVideo = ref(null)

// 当前视角
const currentPerspective = ref('front')

// 实时评分数据
const realTimeScores = ref({
  difficulty: 8.5,
  completion: 7.8
})

// AI评分数据
const aiScore = ref(8.2)
const aiConfidence = ref(87)
const aiDifficultyScore = ref(8.5)  // AI难度分
const aiCompletionScore = ref(7.8) // AI完成分

// 最终得分计算（综合实时评分和AI评分）
const finalScore = computed(() => {
  const realtimeFinal = (realTimeScores.value.difficulty + realTimeScores.value.completion) / 2
  const combined = (realtimeFinal + parseFloat(aiScore.value)) / 2
  return combined.toFixed(1)
})

// AI分析详细数据
const technicalScore = ref(8.5)
const fluencyScore = ref(7.8)
const difficultyCoeff = ref(1.2)
const completionScore = ref(85)

// AI分析相关
const showAIAnalysisResult = ref(false)
const aiAnalysisResult = ref('')
const analysisConfidence = ref(85)

// 对话框状态
const showManualScoringDialog = ref(false)
const showManualScoringPanel = ref(false)
const manualScore = ref(8.5)
const manualDifficultyScore = ref(8.5)  // 人工难度分
const manualCompletionScore = ref(7.8) // 人工完成分
const scoringReason = ref('')
const savingScore = ref(false)

// 模拟比赛数据（默认使用第一个比赛数据）
const matches = ref([
  {
    id: 1,
    title: '场次 001 - 张三 vs 李四',
    event: '太极拳',
    time: '10:30',
    date: '2024-01-15',
    player1: '张三',
    player2: '李四',
    order: 1,
    videoFront: '/videos/初级长拳.mp4',
    videoSide: 'https://v.xinmin.cn/uploads/videos/2024/12/30/BFOL852349.mp4',
    videoBack: 'https://wushu-demo.oss-cn-beijing.aliyuncs.com/%E8%A7%86%E9%A2%91demo_back.mp4'
  }
])

const selectedMatch = ref(matches.value[0] || null)



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

// 当前视频地址
const currentVideoUrl = computed(() => {
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



// 处理视频加载错误
const handleVideoError = () => {
  console.error('视频加载失败，请检查视频路径')
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

// AI分析功能函数
const openManualScoring = () => {
  // 初始化人工评分值为当前实时评分
  manualDifficultyScore.value = realTimeScores.value.difficulty
  manualCompletionScore.value = realTimeScores.value.completion
  showManualScoringDialog.value = true
}

const openAppealDialog = () => {
  showAppealDialog.value = true
}

const openAIAnalysis = () => {
  // 切换AI分析结果显示状态
  showAIAnalysisResult.value = !showAIAnalysisResult.value
  
  // 如果展开分析，生成AI评分数据（不修改原有评分）
  if (showAIAnalysisResult.value) {
    // 基于实时评分生成AI评分参考值
    const baseDifficulty = realTimeScores.value.difficulty
    const baseCompletion = realTimeScores.value.completion
    
    // 添加小幅随机波动使AI评分更真实
    const difficultyRandomFactor = (Math.random() - 0.5) * 0.6 // -0.3 到 +0.3 的随机波动
    const completionRandomFactor = (Math.random() - 0.5) * 0.8 // -0.4 到 +0.4 的随机波动
    
    // 计算AI难度分和完成分（仅用于显示，不修改实际评分）
    aiDifficultyScore.value = Math.max(0, Math.min(10, baseDifficulty + difficultyRandomFactor))
    aiCompletionScore.value = Math.max(0, Math.min(10, baseCompletion + completionRandomFactor))
    
    // 生成其他详细评分数据
    technicalScore.value = parseFloat((Math.random() * 2 + 7).toFixed(1)) // 7-9分
    fluencyScore.value = parseFloat((Math.random() * 2 + 6.5).toFixed(1)) // 6.5-8.5分
    difficultyCoeff.value = parseFloat((Math.random() * 0.4 + 1.0).toFixed(1)) // 1.0-1.4
    completionScore.value = parseInt(Math.random() * 20 + 75) // 75-95%
    
    // 生成分析文本
    const analysisTexts = [
      '动作完成度较高，技术规范良好，建议在节奏控制上加强练习。',
      '整体表现优秀，动作流畅自然，难度系数适中，完成质量较高。',
      '技术动作标准，完成度良好，建议在动作连贯性方面有所提升。',
      '动作难度适中，完成质量较好，整体表现达到预期水平。'
    ]
    
    aiAnalysisResult.value = analysisTexts[Math.floor(Math.random() * analysisTexts.length)]
    analysisConfidence.value = parseInt(Math.random() * 15 + 82) // 82-97%
  }
}

const closeManualScoring = () => {
  showManualScoringDialog.value = false
  scoringReason.value = '' // 重置评分说明
  // 重置人工评分值
  manualDifficultyScore.value = realTimeScores.value.difficulty
  manualCompletionScore.value = realTimeScores.value.completion
}

const saveManualScore = () => {
  savingScore.value = true
  
  // 更新实时评分数据
  realTimeScores.value.difficulty = manualDifficultyScore.value
  realTimeScores.value.completion = manualCompletionScore.value
  
  setTimeout(() => {
    savingScore.value = false
    showManualScoringDialog.value = false
    console.log(`人工评分已保存: 难度分 ${manualDifficultyScore.value}, 完成分 ${manualCompletionScore.value}`)
  }, 1000)
}

// 切换人工评分面板
const toggleManualScoring = () => {
  showManualScoringPanel.value = !showManualScoringPanel.value
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

/* 比赛信息卡片样式 */
.competition-info-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
}

.competition-info-card .v-card-text {
  padding: 16px 24px !important;
}

.text-muted {
  color: #6c757d !important;
  font-size: 0.9rem;
}

.fw-bold {
  font-weight: 600 !important;
  color: #2c3e50;
  font-size: 1rem;
  margin-bottom: 4px;
}

h4 {
  color: #2c3e50;
  font-weight: 600;
  font-size: 1.25rem;
  margin-bottom: 4px !important;
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



:deep(.v-btn) {
  text-transform: none;
  font-weight: 500;
  border-radius: 6px;
}

:deep(.v-card-title) {
  font-weight: 600;
}

/* 实时评分和AI分析样式 */
.score-analysis-card {
  background: transparent;
  box-shadow: none;
}

.real-time-score-panel {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.real-time-score-panel:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.score-display-grid {
  display: grid;
  gap: 16px;
}

.score-item {
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.score-item:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.score-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.score-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #475569;
}

.score-value-container {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 8px;
}

.score-number {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e293b;
}

.score-number.final {
  font-size: 2.2rem;
  color: #dc2626;
}

.score-total {
  font-size: 1rem;
  color: #64748b;
  font-weight: 500;
}

.score-progress {
  margin-top: 8px;
}

.score-rating {
  margin-top: 8px;
}

/* AI评分面板样式 */
.ai-score-panel {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.ai-score-panel:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.ai-score-display {
  background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  border: 1px solid #e2e8f0;
}

.ai-score-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 12px;
}

.ai-score-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #7c3aed;
}

.ai-score-value {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
  margin-bottom: 12px;
}

.ai-score-number {
  font-size: 2rem;
  font-weight: 700;
  color: #7c3aed;
}

.ai-score-total {
  font-size: 1rem;
  color: #a855f7;
  font-weight: 500;
}

.ai-score-confidence {
  display: flex;
  justify-content: center;
}

.function-buttons {
  margin-top: 8px;
}

.function-btn {
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* AI分析结果样式 */
.ai-analysis-result {
  margin-top: 16px;
}

.analysis-content-card {
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.analysis-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.analysis-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  flex-grow: 1;
}

.analysis-content {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #475569;
  margin-bottom: 16px;
}

.analysis-details {
  background: white;
  border-radius: 6px;
  padding: 12px;
  border: 1px solid #e2e8f0;
}

.detail-item {
  text-align: center;
}

.detail-label {
  font-size: 0.8rem;
  color: #64748b;
  margin-bottom: 4px;
}

.detail-value {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
}

.confidence-chip {
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

.action-btn {
  min-width: 100px;
}

/* 人工评分对话框样式 */
.manual-scoring-dialog {
  border-radius: 16px;
  overflow: hidden;
}

.dialog-header {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-bottom: 1px solid #e0e0e0;
}

.header-content {
  width: 100%;
}

/* 圆形评分显示 */
.current-score-display {
  display: flex;
  justify-content: center;
  align-items: center;
}

.score-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  position: relative;
}

.score-circle::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2, #667eea);
  background-size: 400% 400%;
  animation: gradient-rotate 3s ease infinite;
  z-index: -1;
}

@keyframes gradient-rotate {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

.score-inner {
  background: white;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.score-number {
  font-size: 2.5rem;
  font-weight: 800;
  color: #333;
  line-height: 1;
}

.score-label {
  font-size: 0.8rem;
  color: #666;
  margin-top: 4px;
}

/* 评分区域 */
.scoring-section {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.section-title {
  font-weight: 600;
  color: #333;
  flex: 1;
}

/* 评分滑块 */
.score-slider {
  margin: 20px 0;
}

/* 评分等级 */
.score-levels {
  background: white;
  border-radius: 8px;
  padding: 12px;
  margin-top: 16px;
}

.level-item {
  padding: 8px 4px;
  border-radius: 6px;
  transition: all 0.3s ease;
  opacity: 0.6;
}

.level-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  opacity: 1;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.level-text {
  font-size: 0.8rem;
  font-weight: 500;
  margin: 4px 0;
}

.level-range {
  font-size: 0.7rem;
  opacity: 0.8;
}

/* 评分说明区域 */
.reason-section {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-top: 16px;
}

/* 响应式设计 */
@media (max-width: 600px) {
  .score-circle {
    width: 100px;
    height: 100px;
  }

  .score-inner {
    width: 80px;
    height: 80px;
  }

  .score-number {
    font-size: 2rem;
  }

  .level-text {
    font-size: 0.7rem;
  }

  .level-range {
    font-size: 0.6rem;
  }
}
</style>