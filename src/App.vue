<template>
  <div id="app">
    <!-- 全局导航栏 -->
    <el-container v-if="showHeader">
      <el-header>
        <div class="header-content">
          <div class="system-title" @click="router.push('/')" role="button">
            <h2>学生信息管理系统</h2>
            <span class="version-tag">{{ versionLabel }}</span>
          </div>
          <div class="user-info">
            <el-dropdown @command="handleCommand" trigger="click">
              <div class="user-dropdown-link">
                <el-icon size="20">
                  <UserFilled />
                </el-icon>
                <span class="username">{{ currentUser?.name || '' }}</span>
                <el-icon class="arrow-icon">
                  <ArrowDown />
                </el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">
                    <el-icon><UserFilled /></el-icon>
                    个人信息
                  </el-dropdown-item>
                  <el-dropdown-item command="changePassword">
                    <el-icon><EditPen /></el-icon>
                    修改密码
                  </el-dropdown-item>
                  <el-dropdown-item divided command="logout">
                    <el-icon><SwitchButton /></el-icon>
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      <router-view />
    </el-container>
    <router-view v-else />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, provide, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { userApi, UserRole, type User } from '@/api/user'
import {
  Avatar,
  Key,
  Close,
  ArrowDown,
  UserFilled,
  EditPen,
  SwitchButton
} from '@element-plus/icons-vue'

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
    localStorage.setItem('userNO', user.userNO)
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
    localStorage.removeItem('userNO')
    currentUser.value = null
    ElMessage.success('退出登录成功')
    router.push('/login')
  } catch (error) {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userNO')
    router.push('/login')
    console.error('退出登录失败:', error)
  }
}

// 处理下拉菜单命令
const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'changePassword':
      router.push('/change-password')
      break
    case 'logout':
      handleLogout()
      break
  }
}

// 在组件挂载时获取用户信息
onMounted(async () => {
  if (route.path !== '/login' && localStorage.getItem('token')) {
    await getCurrentUser()
  }
})

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
}

.user-dropdown-link {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 12px;
  border-radius: 4px;
  transition: all 0.3s;
  color: #fff;
}

.user-dropdown-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.user-dropdown-link .el-icon {
  font-size: 20px;
}

.user-dropdown-link .username {
  font-size: 14px;
  margin: 0 4px;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-dropdown-link .arrow-icon {
  font-size: 12px;
}

.user-name {
  font-size: 14px;
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
}

:deep(.el-dropdown-menu__item .el-icon) {
  font-size: 16px;
}

:deep(.el-popper.is-light) {
  border: none;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

:deep(.el-dropdown-menu__item--divided:before) {
  margin: 0;
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
  cursor: pointer;
  transition: opacity 0.3s;
  user-select: none;
}

.system-title:hover {
  opacity: 0.9;
}

.system-title h2 {
  margin: 0;
}

.version-tag {
  font-size: 14px;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 4px;
}

.user-dropdown-link .el-icon {
  font-size: 14px;
  margin-left: 4px;
  color: #fff;
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
}

:deep(.el-dropdown-menu__item .el-icon) {
  font-size: 16px;
  margin: 0;
}
</style> 