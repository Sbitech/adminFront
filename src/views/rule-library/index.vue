<template>
  <v-container fluid class="rule-library-container">
    <v-row>
      <v-col cols="12">
        <v-card class="header-card">
          <v-card-title class="d-flex align-center">
            <v-icon size="28" color="#42b883" class="mr-2">mdi-book-open-variant</v-icon>
            规则库管理
            <v-spacer></v-spacer>
            <v-btn
              color="#42b883"
              prepend-icon="mdi-upload"
              @click="openImportDialog"
              variant="elevated"
            >
              导入规则库
            </v-btn>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card class="content-card">
          <v-card-text>
            <!-- 搜索和筛选区域 -->
            <v-row class="mb-4">
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="searchText"
                  label="搜索规则"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="comfortable"
                  clearable
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="selectedCategory"
                  :items="categories"
                  label="规则类别"
                  variant="outlined"
                  density="comfortable"
                  clearable
                ></v-select>
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="selectedStatus"
                  :items="statusOptions"
                  label="状态"
                  variant="outlined"
                  density="comfortable"
                  clearable
                ></v-select>
              </v-col>
              <v-col cols="12" md="2">
                <v-btn
                  color="primary"
                  @click="loadRules"
                  :loading="loading"
                  block
                >
                  查询
                </v-btn>
              </v-col>
            </v-row>

            <!-- 规则列表 -->
            <v-data-table
              :headers="headers"
              :items="filteredRules"
              :loading="loading"
              :search="searchText"
              class="elevation-0"
              item-key="id"
            >
              <template v-slot:item.status="{ item }">
                <v-chip
                  :color="getStatusColor(item.status)"
                  size="small"
                  variant="elevated"
                >
                  {{ getStatusText(item.status) }}
                </v-chip>
              </template>

              <template v-slot:item.actions="{ item }">
                <v-btn
                  icon="mdi-eye"
                  variant="text"
                  color="primary"
                  size="small"
                  @click="viewRule(item)"
                  class="mr-1"
                ></v-btn>
                <v-btn
                  icon="mdi-download"
                  variant="text"
                  color="success"
                  size="small"
                  @click="downloadRule(item)"
                  class="mr-1"
                ></v-btn>
                <v-btn
                  icon="mdi-delete"
                  variant="text"
                  color="error"
                  size="small"
                  @click="confirmDelete(item)"
                ></v-btn>
              </template>

              <template v-slot:no-data>
                <div class="text-center py-8">
                  <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-book-open-outline</v-icon>
                  <div class="text-h6 text-grey">暂无规则数据</div>
                  <div class="text-body-2 text-grey mt-2">点击右上角"导入规则库"按钮添加规则</div>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 导入规则库对话框 -->
    <v-dialog v-model="importDialog" max-width="600" persistent>
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon color="#42b883" class="mr-2">mdi-upload</v-icon>
          导入规则库
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" variant="text" @click="closeImportDialog"></v-btn>
        </v-card-title>

        <v-card-text>
          <v-form ref="importForm" v-model="importFormValid">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="importData.name"
                  label="规则名称"
                  :rules="[v => !!v || '请输入规则名称']"
                  variant="outlined"
                  density="comfortable"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="importData.category"
                  :items="categories"
                  label="规则类别"
                  :rules="[v => !!v || '请选择规则类别']"
                  variant="outlined"
                  density="comfortable"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="importData.description"
                  label="规则描述"
                  rows="3"
                  variant="outlined"
                  density="comfortable"
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-file-input
                  v-model="importFile"
                  label="选择规则文件"
                  accept=".json,.xml,.txt"
                  :rules="[v => !!v || '请选择规则文件']"
                  variant="outlined"
                  density="comfortable"
                  show-size
                  required
                ></v-file-input>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="closeImportDialog">取消</v-btn>
          <v-btn
            color="#42b883"
            :loading="importing"
            :disabled="!importFormValid"
            @click="importRule"
            variant="elevated"
          >
            导入
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 规则详情对话框 -->
    <v-dialog v-model="detailDialog" max-width="800">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon color="#42b883" class="mr-2">mdi-eye</v-icon>
          规则详情
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" variant="text" @click="detailDialog = false"></v-btn>
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <div class="text-subtitle-2 font-weight-bold mb-2">规则名称</div>
              <div class="text-body-1">{{ selectedRule.name }}</div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="text-subtitle-2 font-weight-bold mb-2">规则类别</div>
              <div class="text-body-1">{{ selectedRule.category }}</div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="text-subtitle-2 font-weight-bold mb-2">状态</div>
              <v-chip :color="getStatusColor(selectedRule.status)" size="small">
                {{ getStatusText(selectedRule.status) }}
              </v-chip>
            </v-col>
            <v-col cols="12" md="6">
              <div class="text-subtitle-2 font-weight-bold mb-2">创建时间</div>
              <div class="text-body-1">{{ formatDateTime(selectedRule.createTime) }}</div>
            </v-col>
            <v-col cols="12">
              <div class="text-subtitle-2 font-weight-bold mb-2">规则描述</div>
              <div class="text-body-1">{{ selectedRule.description || '暂无描述' }}</div>
            </v-col>
            <v-col cols="12" v-if="selectedRule.content">
              <div class="text-subtitle-2 font-weight-bold mb-2">规则内容</div>
              <v-card variant="outlined" class="pa-3">
                <pre class="text-body-2" style="white-space: pre-wrap; word-wrap: break-word;">{{ selectedRule.content }}</pre>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="detailDialog = false">关闭</v-btn>
          <v-btn color="#42b883" variant="elevated" @click="downloadRule(selectedRule)">
            <v-icon left>mdi-download</v-icon>
            下载
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 删除确认对话框 -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">确认删除</v-card-title>
        <v-card-text>
          确定要删除规则 "{{ ruleToDelete?.name }}" 吗？此操作不可恢复。
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="deleteDialog = false">取消</v-btn>
          <v-btn color="error" :loading="deleting" @click="deleteRule" variant="elevated">
            删除
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 提示消息 -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="top right"
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
  </v-container>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'

export default {
  name: 'RuleLibrary',
  setup() {
    const loading = ref(false)
    const importDialog = ref(false)
    const detailDialog = ref(false)
    const deleteDialog = ref(false)
    const importFormValid = ref(false)
    const importing = ref(false)
    const deleting = ref(false)
    
    const searchText = ref('')
    const selectedCategory = ref('')
    const selectedStatus = ref('')
    
    const importData = reactive({
      name: '',
      category: '',
      description: ''
    })
    const importFile = ref(null)
    
    const selectedRule = reactive({})
    const ruleToDelete = ref(null)
    
    const rules = ref([])
    
    const categories = [
      '评分规则',
      '动作标准',
      '扣分规则',
      '难度系数',
      '技术规范',
      '其他'
    ]
    
    const statusOptions = [
      { title: '启用', value: 'active' },
      { title: '禁用', value: 'inactive' },
      { title: '草稿', value: 'draft' }
    ]
    
    const headers = [
      { title: '规则名称', key: 'name', sortable: true },
      { title: '规则类别', key: 'category', sortable: true },
      { title: '状态', key: 'status', sortable: true },
      { title: '创建时间', key: 'createTime', sortable: true },
      { title: '操作', key: 'actions', sortable: false, align: 'center' }
    ]
    
    const snackbar = reactive({
      show: false,
      message: '',
      color: 'success'
    })
    
    const filteredRules = computed(() => {
      let result = rules.value
      
      if (selectedCategory.value) {
        result = result.filter(rule => rule.category === selectedCategory.value)
      }
      
      if (selectedStatus.value) {
        result = result.filter(rule => rule.status === selectedStatus.value)
      }
      
      return result
    })
    
    const loadRules = async () => {
      loading.value = true
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 模拟数据
        rules.value = [
          {
            id: 1,
            name: '武术套路评分标准',
            category: '评分规则',
            status: 'active',
            description: '武术套路比赛评分标准规则，包含动作规范、难度系数等评分要素',
            content: '{\n  "动作规范": 40,\n  "难度系数": 30,\n  "艺术表现": 20,\n  "完成质量": 10\n}',
            createTime: '2024-01-15 10:30:00'
          },
          {
            id: 2,
            name: '太极拳动作标准',
            category: '动作标准',
            status: 'active',
            description: '太极拳比赛动作标准规范',
            content: '{\n  "身法要求": "中正安舒",\n  "手法要求": "圆活连贯",\n  "步法要求": "虚实分明",\n  "眼法要求": "眼随手走"\n}',
            createTime: '2024-01-20 14:20:00'
          },
          {
            id: 3,
            name: '南拳扣分规则',
            category: '扣分规则',
            status: 'draft',
            description: '南拳比赛扣分细则',
            content: '{\n  "动作失误": -2,\n  "平衡失误": -3,\n  "节奏错误": -1,\n  "力度不足": -2\n}',
            createTime: '2024-01-25 09:15:00'
          }
        ]
      } catch (error) {
        showSnackbar('加载规则失败', 'error')
      } finally {
        loading.value = false
      }
    }
    
    const openImportDialog = () => {
      importDialog.value = true
      Object.assign(importData, { name: '', category: '', description: '' })
      importFile.value = null
    }
    
    const closeImportDialog = () => {
      importDialog.value = false
    }
    
    const importRule = async () => {
      if (!importFormValid.value) return
      
      importing.value = true
      try {
        // 模拟文件读取
        const fileContent = await readFileContent(importFile.value)
        
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        const newRule = {
          id: Date.now(),
          name: importData.name,
          category: importData.category,
          status: 'active',
          description: importData.description,
          content: fileContent,
          createTime: new Date().toLocaleString('zh-CN')
        }
        
        rules.value.unshift(newRule)
        showSnackbar('规则导入成功', 'success')
        closeImportDialog()
      } catch (error) {
        showSnackbar('规则导入失败', 'error')
      } finally {
        importing.value = false
      }
    }
    
    const readFileContent = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target.result)
        reader.onerror = reject
        reader.readAsText(file)
      })
    }
    
    const viewRule = (rule) => {
      Object.assign(selectedRule, rule)
      detailDialog.value = true
    }
    
    const downloadRule = (rule) => {
      const blob = new Blob([JSON.stringify(rule, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${rule.name}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      showSnackbar('规则下载成功', 'success')
    }
    
    const confirmDelete = (rule) => {
      ruleToDelete.value = rule
      deleteDialog.value = true
    }
    
    const deleteRule = async () => {
      deleting.value = true
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const index = rules.value.findIndex(r => r.id === ruleToDelete.value.id)
        if (index > -1) {
          rules.value.splice(index, 1)
        }
        
        showSnackbar('规则删除成功', 'success')
        deleteDialog.value = false
      } catch (error) {
        showSnackbar('规则删除失败', 'error')
      } finally {
        deleting.value = false
      }
    }
    
    const getStatusColor = (status) => {
      const colorMap = {
        active: 'success',
        inactive: 'error',
        draft: 'warning'
      }
      return colorMap[status] || 'grey'
    }
    
    const getStatusText = (status) => {
      const textMap = {
        active: '启用',
        inactive: '禁用',
        draft: '草稿'
      }
      return textMap[status] || status
    }
    
    const formatDateTime = (datetime) => {
      if (!datetime) return ''
      return datetime
    }
    
    const showSnackbar = (message, color = 'success') => {
      Object.assign(snackbar, { show: true, message, color })
    }
    
    onMounted(() => {
      loadRules()
    })
    
    return {
      loading,
      importDialog,
      detailDialog,
      deleteDialog,
      importFormValid,
      importing,
      deleting,
      searchText,
      selectedCategory,
      selectedStatus,
      importData,
      importFile,
      selectedRule,
      ruleToDelete,
      rules,
      categories,
      statusOptions,
      headers,
      snackbar,
      filteredRules,
      loadRules,
      openImportDialog,
      closeImportDialog,
      importRule,
      viewRule,
      downloadRule,
      confirmDelete,
      deleteRule,
      getStatusColor,
      getStatusText,
      formatDateTime
    }
  }
}
</script>

<style scoped>
.rule-library-container {
  padding: 24px;
}

.header-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.content-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 600px) {
  .rule-library-container {
    padding: 12px;
  }
}
</style>