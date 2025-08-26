<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="title">武术系统裁判端</h1>
      <div class="form-group">
        <label for="username">用户名</label>
        <input
          type="text"
          id="username"
          v-model="form.username"
          placeholder="请输入用户名"
          :disabled="loading"
        />
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <div class="password-input-container">
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model="form.password"
            placeholder="请输入密码"
            :disabled="loading"
          />
          <button
            class="toggle-password"
            @click="showPassword = !showPassword"
            :disabled="loading"
            aria-label="{{ showPassword ? '隐藏密码' : '显示密码' }}"
          >
            <VIcon size="20">
              {{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}
            </VIcon>
          </button>
        </div>
      </div>
      <p class="error-message">{{ error }}</p>
      <button
        class="login-button"
        @click="handleLogin"
        :disabled="loading"
      >
        {{ loading ? '登录中...' : '登录' }}
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/api'
import { VIcon } from 'vuetify/components'

// 定义表单数据
const form = ref({
  username: '',
  password: ''
})

// 控制密码是否可见
const showPassword = ref(false)

// 定义错误信息
const error = ref('')

// 为错误信息添加自动清除功能
watch(error, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      error.value = ''
    }, 3000)
  }
})

// 定义加载状态
const loading = ref(false)

// 获取路由实例
const router = useRouter()

// 登录方法
const handleLogin = async () => {
  // 简单验证 - 只要账号密码不空就能登录
  if (!form.value.username || !form.value.password) {
    error.value = '请输入用户名和密码'
    return
  }

  // 清除错误信息
  error.value = ''

  // 设置加载状态
  loading.value = true

  try {
    // 暂时跳过API调用，直接登录成功
    // 存储一个模拟的token
    localStorage.setItem('token', 'temp-token-' + Date.now())
    
    // 直接跳转到首页
    router.push('/dashboard')
  } catch (err) {
    error.value = err.response?.data?.message || '登录失败，请重试'
  } finally {
    // 重置加载状态
    loading.value = false
  }
}
</script>
<style scoped>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Microsoft YaHei', sans-serif;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  background-color: #f0f2f5;
  background-image: linear-gradient(135deg, #f0f2f5 0%, #e4e7ed 100%);
  margin: 0;
  padding: 0;
}

.login-card {
  width: 420px;
  padding: 2.5rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.login-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.title {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.75rem;
  color: #34495e;
  font-weight: 500;
  font-size: 1rem;
}

input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
  height: 42px;
}

input:focus {
  outline: none;
  border-color: #42b883;
  box-shadow: 0 0 0 2px rgba(66, 184, 131, 0.2);
}

.error-message {
  color: #ff4d4f;
  margin-bottom: 1rem;
  text-align: center;
  font-size: 0.9rem;
  height: 1.2rem;
}

.password-input-container {
  display: flex;
  position: relative;
}

.password-input-container input {
  flex: 1;
  padding-right: 80px;
}

.toggle-password {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #42b883;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0 10px;
  height: 42px;
  width: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-password:hover {
  color: #3aa876;
}

.login-button {
  width: 100%;
  padding: 1rem;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.login-button:hover {
  background-color: #3aa876;
  transform: translateY(-2px);
}

.login-button:active {
  transform: translateY(0);
}

.login-button:disabled {
  background-color: #a9a9a9;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-card {
    width: 90%;
    padding: 2rem;
  }
}

@media (max-height: 600px) {
  .login-container {
    height: auto;
    min-height: 100vh;
    padding: 2rem 0;
  }
}
</style>