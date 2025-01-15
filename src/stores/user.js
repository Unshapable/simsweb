import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login, logout, getCurrentUser } from '../api/user'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref(null)
  const token = ref(localStorage.getItem('token') || '')

  const loginAction = async (userNO, password) => {
    try {
      const res = await login(userNO, password)
      if (res.data.code === '200') {
        token.value = res.data.result
        localStorage.setItem('token', token.value)
        await getUserInfo()
        return true
      }
      return false
    } catch (error) {
      console.error('登录失败:', error)
      return false
    }
  }

  const getUserInfo = async () => {
    try {
      const res = await getCurrentUser()
      if (res.data.code === '200') {
        userInfo.value = res.data.result
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }
  }

  const logoutAction = async () => {
    try {
      await logout()
      token.value = ''
      userInfo.value = null
      localStorage.removeItem('token')
    } catch (error) {
      console.error('登出失败:', error)
    }
  }

  return {
    userInfo,
    token,
    loginAction,
    logoutAction,
    getUserInfo
  }
}) 