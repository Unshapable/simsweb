import { ElMessage } from 'element-plus'

// 基础请求地址改回空字符串，使用相对路径
const BASE_URL = 'http://172.29.4.105:31180'

// 请求配置接口
interface RequestConfig extends RequestInit {
    params?: Record<string, string | number>
    noToken?: boolean  // 添加一个标记，表示是否需要token
}

// 响应数据接口
interface ApiResponse<T = any> {
    code: string
    msg: string
    result: T
}

// 封装请求方法
export const request = async <T>(url: string, config?: RequestConfig): Promise<T> => {
    try {
        // 处理查询参数
        if (config?.params) {
            const queryString = new URLSearchParams(
                Object.entries(config.params).map(([key, value]) => [key, String(value)])
            ).toString()
            url = `${url}?${queryString}`
        }

        // 添加基础路径
        const fullUrl = `${BASE_URL}${url}`

        // 获取token（如果需要的话）
        const token = !config?.noToken ? localStorage.getItem('token') : null

        // 合并默认配置
        const finalConfig: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'token': token } : {}),
                ...(config?.headers || {})
            },
            ...config
        }

        const response = await fetch(fullUrl, finalConfig)
        console.log('Response Status:', response.status)

        // 处理 401 未授权的情况
        if (response.status === 401) {
            localStorage.removeItem('token')
            ElMessage.error('登录已过期，请重新登录')
            window.location.href = '/login'
            return Promise.reject('Unauthorized')
        }

        const data = await response.json()
        console.log('Response Data:', data)

        // 处理统计接口的特殊情况
        if (url.startsWith('/api/statistics/')) {
            return data as T
        }

        // 处理标准接口响应
        if (data.code === '200') {
            return data.result
        } else {
            const errorMsg = data.msg || '请求失败'
            ElMessage.error(errorMsg)
            return Promise.reject(new Error(errorMsg))
        }
    } catch (error) {
        console.error('Request Error:', error)
        ElMessage.error('网络错误，请稍后重试')
        return Promise.reject(error)
    }
} 