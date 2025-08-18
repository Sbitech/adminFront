import axios from 'axios'

// 创建axios实例
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 5000
})

// 请求拦截器
instance.interceptors.request.use(
  config => {
    // 获取token
    const token = localStorage.getItem('token')

    // 如果token存在，则添加到请求头
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  response => {
    return response
  },
  error => {
    // 处理401错误
    if (error.response && error.response.status === 401) {
      // 清除token
      localStorage.removeItem('token')

      // 跳转到登录页
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

// 定义API方法
const api = {
  // 登录
  login(data) {
    return instance.post('/auth/login', data)
  },

  // 其他API方法可以在这里添加
}

export { api }