<template>
  <v-container fluid class="dashboard-container">
    <v-row>
      <v-col cols="12">
        <v-card class="judge-card">
          <v-card-title>
            <v-icon left>mdi-account-key</v-icon>
            权限配置
          </v-card-title>
          
          <v-tabs v-model="activeTab" bg-color="transparent" color="primary" class="mb-4 custom-tabs" grow>
            <v-tab value="referees" class="tab-item" selected-class="tab-active">
              <v-icon left>mdi-account</v-icon>
              裁判账号权限
            </v-tab>
            <v-tab value="roles" class="tab-item" selected-class="tab-active">
              <v-icon left>mdi-account-group</v-icon>
              角色权限管理
            </v-tab>
          </v-tabs>

          <v-card-text>
            <!-- 裁判账号权限 -->
            <v-window v-model="activeTab">
              <v-window-item value="referees">
                <v-table>
                  <thead>
                    <tr>
                      <th>账号</th>
                      <th>姓名</th>
                      <th>角色</th>
                      <th class="text-center">评分权限</th>
                      <th class="text-center">仲裁审核</th>
                      <th class="text-center">数据管理</th>
                      <th class="text-center">系统管理</th>
                      <th class="text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="referee in referees" :key="referee.id" class="judge-list-item">
                      <td>{{ referee.username }}</td>
                      <td>{{ referee.realName }}</td>
                      <td>
                        <v-select v-model="referee.role" :items="roles.map(r => r.name)" density="compact" 
                          hide-details class="role-select" @update:model-value="updateRole(referee)"></v-select>
                      </td>
                      <td class="text-center">
                        <v-checkbox v-model="referee.permissions.scoring"
                          @update:model-value="updatePermission(referee, 'scoring')" density="compact"
                          hide-details></v-checkbox>
                      </td>
                      <td class="text-center">
                        <v-checkbox v-model="referee.permissions.arbitration"
                          @update:model-value="updatePermission(referee, 'arbitration')" density="compact"
                          hide-details></v-checkbox>
                      </td>
                      <td class="text-center">
                        <v-checkbox v-model="referee.permissions.dataManagement"
                          @update:model-value="updatePermission(referee, 'dataManagement')" density="compact"
                          hide-details></v-checkbox>
                      </td>
                      <td class="text-center">
                        <v-checkbox v-model="referee.permissions.systemAdmin"
                          @update:model-value="updatePermission(referee, 'systemAdmin')" density="compact"
                          hide-details></v-checkbox>
                      </td>
                      <td class="text-center">
                        <v-btn color="primary" size="small" @click="savePermissions(referee)" :loading="referee.saving">
                          保存
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-window-item>

              <!-- 角色权限管理 -->
              <v-window-item value="roles">
                <v-row>
                  <v-col cols="12" md="4">
                    <v-card class="role-list-card">
                      <v-card-title class="text-h6">角色列表</v-card-title>
                      <v-card-text>
                        <v-list>
                          <v-list-item v-for="role in roles" :key="role.id" 
                            :active="selectedRole?.id === role.id" 
                            @click="selectRole(role)"
                            class="role-list-item">
                            <v-list-item-title class="role-name">
                            {{ role.name }}
                          </v-list-item-title>
                            <v-list-item-subtitle>
                              {{ role.description }}
                            </v-list-item-subtitle>
                          </v-list-item>
                        </v-list>
                        <v-btn color="primary" block class="mt-4" @click="showAddRoleDialog = true">
                          <v-icon left>mdi-plus</v-icon>
                          添加角色
                        </v-btn>
                      </v-card-text>
                    </v-card>
                  </v-col>

                  <v-col cols="12" md="8">
                    <v-card v-if="selectedRole">
                      <v-card-title class="text-h6">
                        编辑角色权限 - {{ selectedRole.name }}
                      </v-card-title>
                      <v-card-text>
                        <v-text-field v-model="selectedRole.name" label="角色名称" 
                          :disabled="selectedRole.id <= 5" class="mb-4"></v-text-field>
                        <v-textarea v-model="selectedRole.description" label="角色描述" rows="2" class="mb-4"></v-textarea>
                        
                        <v-divider class="my-4"></v-divider>
                        
                        <div class="text-subtitle-1 mb-3">权限设置</div>
                        <v-row>
                          <v-col cols="12" md="6">
                            <v-card variant="outlined" class="permission-card">
                              <v-card-text>
                                <v-checkbox v-model="selectedRole.permissions.scoring" 
                                  label="评分权限" hide-details></v-checkbox>
                                <div class="text-caption text-grey">允许对比赛进行评分</div>
                              </v-card-text>
                            </v-card>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-card variant="outlined" class="permission-card">
                              <v-card-text>
                                <v-checkbox v-model="selectedRole.permissions.arbitration" 
                                  label="仲裁审核" hide-details></v-checkbox>
                                <div class="text-caption text-grey">处理争议和申诉</div>
                              </v-card-text>
                            </v-card>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-card variant="outlined" class="permission-card">
                              <v-card-text>
                                <v-checkbox v-model="selectedRole.permissions.dataManagement" 
                                  label="数据管理" hide-details></v-checkbox>
                                <div class="text-caption text-grey">管理比赛数据和记录</div>
                              </v-card-text>
                            </v-card>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-card variant="outlined" class="permission-card">
                              <v-card-text>
                                <v-checkbox v-model="selectedRole.permissions.systemAdmin" 
                                  label="系统管理" hide-details></v-checkbox>
                                <div class="text-caption text-grey">系统配置和用户管理</div>
                              </v-card-text>
                            </v-card>
                          </v-col>
                        </v-row>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" @click="saveRolePermissions" :loading="savingRole">
                          保存角色权限
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                    <v-card v-else class="text-center pa-8">
                      <v-icon size="64" color="grey">mdi-account-group</v-icon>
                      <div class="text-h6 mt-4">选择角色进行编辑</div>
                      <div class="text-body-2 text-grey">从左侧列表选择一个角色来配置权限</div>
                    </v-card>
                  </v-col>
                </v-row>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 添加角色对话框 -->
    <v-dialog v-model="showAddRoleDialog" max-width="500">
      <v-card>
        <v-card-title>添加新角色</v-card-title>
        <v-card-text>
          <v-text-field v-model="newRole.name" label="角色名称" required></v-text-field>
          <v-textarea v-model="newRole.description" label="角色描述" rows="3"></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="showAddRoleDialog = false">取消</v-btn>
          <v-btn color="primary" @click="addRole" :loading="addingRole">添加</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const activeTab = ref('referees')
const selectedRole = ref(null)
const savingRole = ref(false)
const showAddRoleDialog = ref(false)
const addingRole = ref(false)

const roles = ref([
  {
    id: 1,
    name: '主裁判',
    description: '负责比赛的整体评分和仲裁',
    permissions: {
      scoring: true,
      arbitration: true,
      dataManagement: false,
      systemAdmin: false
    }
  },
  {
    id: 2,
    name: '副裁判',
    description: '协助主裁判进行评分',
    permissions: {
      scoring: true,
      arbitration: false,
      dataManagement: false,
      systemAdmin: false
    }
  },
  {
    id: 3,
    name: '助理裁判',
    description: '协助裁判工作，负责部分评分',
    permissions: {
      scoring: true,
      arbitration: false,
      dataManagement: false,
      systemAdmin: false
    }
  },
  {
    id: 4,
    name: '技术裁判',
    description: '负责技术数据的记录和管理',
    permissions: {
      scoring: false,
      arbitration: true,
      dataManagement: true,
      systemAdmin: false
    }
  },
  {
    id: 5,
    name: '管理员',
    description: '系统管理权限',
    permissions: {
      scoring: true,
      arbitration: true,
      dataManagement: true,
      systemAdmin: true
    }
  }
])

const referees = ref([])

const newRole = reactive({
  name: '',
  description: '',
  permissions: {
    scoring: false,
    arbitration: false,
    dataManagement: false,
    systemAdmin: false
  }
})

const snackbar = reactive({
  show: false,
  message: '',
  color: 'success'
})

const mockReferees = [
  {
    id: 1,
    username: 'referee001',
    realName: '张三',
    role: '主裁判',
    permissions: {
      scoring: true,
      arbitration: true,
      dataManagement: false,
      systemAdmin: false
    },
    customPermissions: false,
    saving: false
  },
  {
    id: 2,
    username: 'referee002',
    realName: '李四',
    role: '副裁判',
    permissions: {
      scoring: true,
      arbitration: false,
      dataManagement: false,
      systemAdmin: false
    },
    customPermissions: false,
    saving: false
  },
  {
    id: 3,
    username: 'referee003',
    realName: '王五',
    role: '技术裁判',
    permissions: {
      scoring: false,
      arbitration: true,
      dataManagement: true,
      systemAdmin: false
    },
    customPermissions: true,
    saving: false
  },
  {
    id: 4,
    username: 'admin001',
    realName: '赵六',
    role: '管理员',
    permissions: {
      scoring: true,
      arbitration: true,
      dataManagement: true,
      systemAdmin: true
    },
    customPermissions: false,
    saving: false
  }
]


const updatePermission = (referee, permissionType) => {
  console.log(`更新 ${referee.realName} 的 ${permissionType} 权限为: ${referee.permissions[permissionType]}`)
}

const updateRole = (referee) => {
  const role = roles.value.find(r => r.name === referee.role)
  if (role) {
    referee.permissions = { ...role.permissions }
  }
  showSnackbar(`已将 ${referee.realName} 的角色更改为 ${referee.role}`, 'info')
  console.log(`更新 ${referee.realName} 的角色为: ${referee.role}`)
}

const savePermissions = async (referee) => {
  referee.saving = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  referee.saving = false
  showSnackbar('权限保存成功', 'success')
  console.log('保存权限:', {
    refereeId: referee.id,
    permissions: referee.permissions
  })
}

const selectRole = (role) => {
  selectedRole.value = { ...role }
}

const saveRolePermissions = async () => {
  if (!selectedRole.value) return
  savingRole.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    const index = roles.value.findIndex(r => r.id === selectedRole.value.id)
    if (index !== -1) {
      roles.value[index] = { ...selectedRole.value }
    }
    referees.value.forEach(referee => {
      if (referee.role === selectedRole.value.name) {
        referee.permissions = { ...selectedRole.value.permissions }
      }
    })
    showSnackbar('角色权限保存成功', 'success')
  } catch (error) {
    showSnackbar('保存失败，请重试', 'error')
  } finally {
    savingRole.value = false
  }
}

const addRole = async () => {
  if (!newRole.name.trim()) {
    showSnackbar('请输入角色名称', 'error')
    return
  }
  addingRole.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    const newRoleData = {
      id: Math.max(...roles.value.map(r => r.id)) + 1,
      name: newRole.name,
      description: newRole.description,
      permissions: { ...newRole.permissions }
    }
    roles.value.push(newRoleData)
    showAddRoleDialog.value = false
    newRole.name = ''
    newRole.description = ''
    newRole.permissions = {
      scoring: false,
      arbitration: false,
      dataManagement: false,
      systemAdmin: false
    }
    showSnackbar('角色添加成功', 'success')
  } catch (error) {
    showSnackbar('添加失败，请重试', 'error')
  } finally {
    addingRole.value = false
  }
}

const showSnackbar = (message, color = 'success') => {
  snackbar.message = message
  snackbar.color = color
  snackbar.show = true
}

onMounted(() => {
  referees.value = mockReferees.map(r => ({ ...r }))
})
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
  background-color: #f0f2f5;
  background-image: linear-gradient(135deg, #f0f2f5 0%, #e4e7ed 100%);
  min-height: 100vh;
}

.judge-card {
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: none;
  background-color: #ffffff;
}

.judge-list-item:hover {
  background-color: rgba(66, 184, 131, 0.1);
}

.role-select {
  max-width: 120px;
}

.v-card-title {
  font-weight: 600;
  font-size: 1.25rem;
  color: #2c3e50;
}

.v-table th {
  font-weight: 600;
  color: #2c3e50;
}

.v-checkbox {
  justify-content: center;
}

.role-list-card {
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: none;
  background-color: #ffffff;
}

.role-list-item {
  cursor: pointer;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: background-color 0.3s;
}

.role-list-item:hover {
  background-color: rgba(66, 184, 131, 0.1);
}

.role-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
}

.permission-card {
  border-radius: 8px;
  transition: all 0.2s ease;
  background-color: #ffffff;
}

.permission-card:hover {
  border-color: #42b883;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.2);
}

.custom-tabs {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: none;
}

.tab-item {
  border-radius: 8px !important;
  margin: 0 2px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.tab-active {
  background-color: #42b883 !important;
  color: white !important;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3);
}

.tab-active .v-icon {
  color: white !important;
}

.v-tab {
  text-transform: none;
  font-weight: 500;
}

.v-chip {
  font-weight: 500;
}

.v-btn {
  text-transform: none;
  font-weight: 500;
}

@media (max-width: 768px) {
  .v-card-text {
    overflow-x: auto;
  }

  .v-table {
    min-width: 600px;
  }
}</style>