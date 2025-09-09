<template>
  <v-container fluid class="dashboard-container">
    <v-row>
      <v-col cols="12">
        <v-card class="judge-card">
          <v-card-title>
            <v-icon left>mdi-account-key</v-icon>
            权限配置
          </v-card-title>
          <v-card-text>
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
                    <v-select v-model="referee.role" :items="roles" density="compact" hide-details class="role-select"
                      @update:model-value="updateRole(referee)"></v-select>
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
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'

export default {
  name: 'PermissionConfig',
  setup() {
    const referees = ref([])
    const snackbar = reactive({
      show: false,
      message: '',
      color: 'success'
    })

    const roles = [
      '主裁判',
      '副裁判',
      '助理裁判',
      '技术裁判',
      '管理员'
    ]

    // 模拟数据
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
        customPermissions: false, // 标记是否自定义了权限
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
        customPermissions: true, // 这个裁判自定义了权限
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

    const getRoleColor = (role) => {
      const colorMap = {
        '主裁判': 'primary',
        '副裁判': 'success',
        '助理裁判': 'info',
        '技术裁判': 'warning',
        '管理员': 'error'
      }
      return colorMap[role] || 'grey'
    }

    const updatePermission = (referee, permissionType) => {
      console.log(`更新 ${referee.realName} 的 ${permissionType} 权限为: ${referee.permissions[permissionType]}`)
    }

    const updateRole = (referee) => {
      // 根据角色自动设置默认权限
      const rolePermissions = {
        '主裁判': {
          scoring: true,
          arbitration: true,
          dataManagement: false,
          systemAdmin: false
        },
        '副裁判': {
          scoring: true,
          arbitration: false,
          dataManagement: false,
          systemAdmin: false
        },
        '助理裁判': {
          scoring: true,
          arbitration: false,
          dataManagement: false,
          systemAdmin: false
        },
        '技术裁判': {
          scoring: false,
          arbitration: true,
          dataManagement: true,
          systemAdmin: false
        },
        '管理员': {
          scoring: true,
          arbitration: true,
          dataManagement: true,
          systemAdmin: true
        }
      }

      // 应用角色默认权限，但保留用户自定义的权限
      const defaultPermissions = rolePermissions[referee.role]
      if (defaultPermissions) {
        Object.keys(defaultPermissions).forEach(key => {
          if (referee.permissions[key] === undefined || !referee.customPermissions) {
            referee.permissions[key] = defaultPermissions[key]
          }
        })
      }

      showSnackbar(`已将 ${referee.realName} 的角色更改为 ${referee.role}`, 'info')
      console.log(`更新 ${referee.realName} 的角色为: ${referee.role}`)
    }

    const savePermissions = async (referee) => {
      referee.saving = true

      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))

      referee.saving = false
      showSnackbar('权限保存成功', 'success')

      console.log('保存权限:', {
        refereeId: referee.id,
        permissions: referee.permissions
      })
    }



    const showSnackbar = (message, color = 'success') => {
      snackbar.message = message
      snackbar.color = color
      snackbar.show = true
    }

    onMounted(() => {
      // 加载模拟数据
      referees.value = mockReferees.map(r => ({ ...r }))
    })

    return {
      referees,
      roles,
      snackbar,
      getRoleColor,
      updatePermission,
      updateRole,
      savePermissions
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  background-color: #f0f2f5;
  background-image: linear-gradient(135deg, #f0f2f5 0%, #e4e7ed 100%);
  min-height: auto;
  padding: 20px;
}



.judge-card {
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: none;
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

.role-select {
  max-width: 150px;
}

.role-select :deep(.v-field__input) {
  padding: 4px 8px;
  font-size: 0.875rem;
}

.role-select :deep(.v-field__append-inner) {
  padding: 0;
}

@media (max-width: 768px) {
  .v-card-text {
    overflow-x: auto;
  }

  .v-table {
    min-width: 600px;
  }
}
</style>