import { request } from './request'

// 用户角色枚举
export enum UserRole {
    ADMIN = 'ADMIN',
    TEACHER = 'TEACHER',
    STUDENT = 'STUDENT'
}

// 性别枚举
export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE'
}

// 用户信息接口
export interface User {
    userNO: string
    name: string
    password: string
    role: UserRole
    gender: Gender
    major: string
    grade?: number  // 老师为 null
    email?: string
    phone?: string
    address?: string
}

// 登录参数接口
export interface LoginParams {
    userNO: string
    password: string
}

// 修改密码参数接口
export interface ChangePasswordParams {
    oldPassword: string
    newPassword: string
}

// 更新用户参数接口
export interface UpdateUserParams {
    userNO: string
    name: string
    password: string
    role: UserRole
    gender: Gender
    major: string
    grade?: number
    email?: string
    phone?: string
    address?: string
}

export const userApi = {
    // 登录
    login: (data: LoginParams) => {
        const formData = new URLSearchParams()
        formData.append('userNO', data.userNO)
        formData.append('password', data.password)

        return request<string>('/api/user/login', {
            method: 'POST',
            body: formData,
            noToken: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
    },

    // 登出
    logout: () => {
        return request('/api/user/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
    },

    // 获取当前用户信息
    getCurrentUser: () => {
        const token = localStorage.getItem('token')
        if (!token) {
            return Promise.reject(new Error('No token found'))
        }

        return request<User>('/api/user/getCurrentUser', {
            method: 'GET',
            headers: {
                'token': token
            }
        })
    },

    // 修改密码
    changePassword: (data: ChangePasswordParams) => {
        const formData = new URLSearchParams()
        formData.append('oldPassword', data.oldPassword)
        formData.append('newPassword', data.newPassword)

        return request('/api/user/changePassword', {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
    },

    // 更新用户信息
    updateUserInfo: (data: Partial<User>) => {
        const formData = new URLSearchParams()
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined) {
                formData.append(key, value.toString())
            }
        })

        return request('/api/user/updateInfo', {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
    },

    // 更新用户信息（管理员用）
    updateUser: (data: UpdateUserParams) => {
        const formData = new URLSearchParams()

        // 添加必需字段
        formData.append('userNO', data.userNO)
        formData.append('name', data.name)
        formData.append('password', data.password)
        formData.append('role', data.role)
        formData.append('gender', data.gender)
        formData.append('major', data.major)

        // 添加可选字段
        if (data.grade !== undefined) {
            formData.append('grade', data.grade.toString())
        }
        if (data.email) {
            formData.append('email', data.email)
        }
        if (data.phone) {
            formData.append('phone', data.phone)
        }
        if (data.address) {
            formData.append('address', data.address)
        }

        return request<boolean>('/api/user/updateUser', {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
    }
} 