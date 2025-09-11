<template>
  <div class="dashboard-container">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" lg="8">
          <v-card class="judge-card">
            <v-card-title>
              <v-icon left>mdi-tune-variant</v-icon>
              评分规则配置
            </v-card-title>
            <v-card-text>
              <v-form ref="form" v-model="valid">
                <v-row>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="scoringRules.difficulty"
                      label="动作难度占比 (%)"
                      type="number"
                      :rules="percentageRules"
                      suffix="%"
                      variant="outlined"
                      density="comfortable"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="scoringRules.fluidity"
                      label="动作流畅度占比 (%)"
                      type="number"
                      :rules="percentageRules"
                      suffix="%"
                      variant="outlined"
                      density="comfortable"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="scoringRules.costume"
                      label="服饰评分占比 (%)"
                      type="number"
                      :rules="percentageRules"
                      suffix="%"
                      variant="outlined"
                      density="comfortable"
                    ></v-text-field>
                  </v-col>
                </v-row>
                
                <v-row>
                  <v-col cols="12">
                    <v-alert
                      v-if="totalPercentage !== 100"
                      type="warning"
                      variant="tonal"
                      class="mb-4"
                    >
                      当前总占比为 {{ totalPercentage }}%，请调整为100%
                    </v-alert>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" class="text-right">
                    <v-btn
                      color="primary"
                      @click="saveRules"
                      :disabled="!valid || totalPercentage !== 100"
                      :loading="loading"
                    >
                      <v-icon left>mdi-content-save</v-icon>
                      保存规则
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Vuetify Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="top"
      position="absolute"
    >
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="snackbar.show = false"
        >
          关闭
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'

export default {
  name: 'ScoringRules',
  setup() {
    const form = ref(null)
    const valid = ref(false)
    const loading = ref(false)

    const scoringRules = reactive({
      difficulty: 40,
      fluidity: 35,
      costume: 25
    })

    const snackbar = reactive({
      show: false,
      message: '',
      color: 'success'
    })

    const percentageRules = [
      v => !!v || '请输入占比',
      v => v >= 0 || '占比不能为负数',
      v => v <= 100 || '占比不能超过100%',
      v => /^\d+$/.test(v) || '请输入整数'
    ]

    const totalPercentage = computed(() => {
      return parseInt(scoringRules.difficulty || 0) + 
             parseInt(scoringRules.fluidity || 0) + 
             parseInt(scoringRules.costume || 0)
    })

    const showSnackbar = (message, color = 'success') => {
      snackbar.message = message
      snackbar.color = color
      snackbar.show = true
    }

    const loadRules = async () => {
      try {
        // 这里可以从API获取已保存的规则
        // const response = await api.get('/scoring-rules')
        // Object.assign(scoringRules, response.data)
        
        // 暂时使用默认值
        scoringRules.difficulty = 40
        scoringRules.fluidity = 35
        scoringRules.costume = 25
      } catch (error) {
        showSnackbar('加载评分规则失败', 'error')
      }
    }

    const saveRules = async () => {
      try {
        loading.value = true
        
        // 这里可以调用API保存规则
        // await api.post('/scoring-rules', scoringRules)
        
        showSnackbar('评分规则保存成功！', 'success')
        
        // 模拟延迟
        setTimeout(() => {
          loading.value = false
        }, 1000)
      } catch (error) {
        showSnackbar('保存评分规则失败', 'error')
        loading.value = false
      }
    }

    onMounted(() => {
      loadRules()
    })

    return {
      form,
      valid,
      loading,
      scoringRules,
      snackbar,
      percentageRules,
      totalPercentage,
      saveRules
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f2f5 0%, #e4e7ed 100%);
  padding: 20px 0;
}

.judge-card {
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: none;
  background: white;
}

.v-card-title {
  font-weight: 600;
  font-size: 1.25rem;
  color: #2c3e50;
  padding: 24px;
  border-bottom: 1px solid #eee;
}

.v-card-text {
  padding: 24px;
}

:deep(.v-field__outline) {
  --v-field-border-width: 1px;
}

:deep(.v-field--variant-outlined:hover .v-field__outline) {
  --v-field-border-width: 2px;
}

:deep(.v-btn) {
  text-transform: none;
  font-weight: 500;
}

@media (max-width: 600px) {
  .dashboard-container {
    padding: 10px;
  }
  
  .v-card-title {
    padding: 16px;
    font-size: 1.1rem;
  }
  
  .v-card-text {
    padding: 16px;
  }
}
</style>