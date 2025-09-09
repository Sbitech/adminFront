import axios from 'axios'

// 创建axios实例
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 可以在这里添加token等认证信息
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // 统一错误处理
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，重定向到登录页
          localStorage.removeItem('token')
          window.location.href = '/login'
          break
        case 403:
          alert('没有权限访问')
          break
        case 404:
          alert('请求的资源不存在')
          break
        case 500:
          alert('服务器内部错误')
          break
        default:
          alert(error.response.data?.message || '请求失败')
      }
    } else if (error.request) {
      alert('网络连接失败，请检查网络')
    } else {
      alert('请求配置错误')
    }
    return Promise.reject(error)
  }
)

export default axiosInstance