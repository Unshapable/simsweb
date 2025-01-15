<template>
  <div id="app">
    <!-- 全局导航栏 -->
    <el-container v-if="showHeader">
      <el-header>
        <div class="header-content">
          <div class="system-title">
            <h2>学生信息管理系统</h2>
            <span class="version-tag">{{ versionLabel }}</span>
          </div>
          <div class="user-info">
            <span>{{ currentUser?.name || '' }}</span>
            <span class="role-tag" v-if="currentUser">{{ roleLabels[currentUser.role] }}</span>
            <el-button type="danger" @click="handleLogout">退出登录</el-button>
          </div>
        </div>
      </el-header>
      <router-view />
    </el-container>
    <router-view v-else />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, provide } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { userApi, UserRole, type User } from '@/api/user'

const router = useRouter()
const route = useRoute()
const currentUser = ref<User | null>(null)

// 角色标签映射
const roleLabels = {
  [UserRole.ADMIN]: '管理员',
  [UserRole.TEACHER]: '教师',
  [UserRole.STUDENT]: '学生'
}

// 版本标签映射
const versionLabels = {
  [UserRole.ADMIN]: '管理员版',
  [UserRole.TEACHER]: '教师版',
  [UserRole.STUDENT]: '学生版'
}

// 计算当前版本标签
const versionLabel = computed(() => {
  const userRole = localStorage.getItem('userRole') as UserRole
  return versionLabels[userRole] || ''
})

// 判断是否显示头部
const showHeader = computed(() => {
  return route.path !== '/login'
})

// 获取当前用户信息
const getCurrentUser = async () => {
  try {
    const user = await userApi.getCurrentUser()
    currentUser.value = user
    // 存储用户角色，用于路由权限控制
    localStorage.setItem('userRole', user.role)
  } catch (error) {
    console.error('获取用户信息失败:', error)
    // 如果获取用户信息失败，可能是token过期，跳转到登录页
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    router.push('/login')
  }
}

// 退出登录
const handleLogout = async () => {
  try {
    await userApi.logout()
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    currentUser.value = null
    ElMessage.success('退出登录成功')
    router.push('/login')
  } catch (error) {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    router.push('/login')
    console.error('退出登录失败:', error)
  }
}

// 提供 getCurrentUser 方法
provide('getCurrentUser', getCurrentUser)
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  width: 100%;
}

#app {
  height: 100%;
}

.el-container {
  height: 100%;
}

.el-header {
  background-color: #409EFF;
  color: white;
  padding: 0 20px;
}

.header-content {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.role-tag {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.system-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.version-tag {
  font-size: 14px;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 4px;
}
</style> 