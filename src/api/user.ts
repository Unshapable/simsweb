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
    grade?: number
    email?: string
    phone?: string
    address?: string
}

export const userApi = {
    // 登录
    login: (params: { userNO: string; password: string }) =>
        request<string>('/api/user/login', {
            method: 'POST',
            params
        }),

    // 登出
    logout: () =>
        request<boolean>('/api/user/logout', {
            method: 'POST'
        }),

    // 获取当前用户信息
    getCurrentUser: () =>
        request<User>('/api/user/getCurrentUser', {
            headers: {
                'token': localStorage.getItem('token') || ''
            }
        }),

    // 修改密码
    changePassword: (params: { oldPassword: string; newPassword: string }) =>
        request<boolean>('/api/user/changePassword', {
            method: 'POST',
            params,
            headers: {
                'token': localStorage.getItem('token') || ''
            }
        }),

    // 更新用户信息
    updateUser: (data: User) =>
        request<boolean>('/api/user/updateUser', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.getItem('token') || ''
            }
        }),

    // 注册用户
    register: (data: User) =>
        request<boolean>('/api/user/register', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.getItem('token') || ''
            }
        }),

    // 获取指定用户信息
    getUserByUserNO: (userNO: string) =>
        request<User>('/api/user/getUserByUserNO', {
            params: { userNO },
            headers: {
                'token': localStorage.getItem('token') || ''
            }
        }),

    // 获取所有用户
    getAllUsers: () =>
        request<User[]>('/api/user/getAllUsers', {
            headers: {
                'token': localStorage.getItem('token') || ''
            }
        }),

    // 获取所有教师
    getAllTeachers: () =>
        request<User[]>('/api/user/getAllTeachers', {
            headers: {
                'token': localStorage.getItem('token') || ''
            }
        })
} 