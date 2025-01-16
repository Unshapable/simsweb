<template>
  <div class="home">
    <div class="welcome-card">
      <h1>欢迎使用教务系统</h1>
      <h2>{{ welcomeMessage }}</h2>
      
      <!-- 学生快捷入口 -->
      <div v-if="userRole === 'STUDENT'" class="quick-actions">
        <el-button type="primary" @click="router.push('/courses')">
          <el-icon><List /></el-icon>
          选课中心
        </el-button>
        <el-button type="success" @click="router.push('/student/my-courses')">
          <el-icon><Collection /></el-icon>
          我的课程
        </el-button>
      </div>

      <!-- 教师快捷入口 -->
      <div v-if="userRole === 'TEACHER'" class="quick-actions">
        <el-button type="primary" @click="router.push('/teacher/teaching-courses')">
          <el-icon><Reading /></el-icon>
          授课管理
        </el-button>
      </div>

      <!-- 管理员快捷入口 -->
      <div v-if="userRole === 'ADMIN'" class="quick-actions">
        <el-button type="primary" @click="router.push('/admin/user-management')">
          <el-icon><User /></el-icon>
          用户管理
        </el-button>
        <el-button type="success" @click="router.push('/admin/course-management')">
          <el-icon><Collection /></el-icon>
          课程管理
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { List, Collection, Reading, User } from '@element-plus/icons-vue'
import { userApi } from '@/api'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userRole = ref(localStorage.getItem('userRole'))
const userName = ref('')

const welcomeMessage = computed(() => {
  const roleNames = {
    'STUDENT': '同学',
    'TEACHER': '老师',
    'ADMIN': '管理员'
  }
  return `${userName.value}${roleNames[userRole.value as keyof typeof roleNames] || ''}，欢迎回来！`
})

// 获取用户信息
const loadUserInfo = async () => {
  try {
    const user = await userApi.getCurrentUser()
    if (user) {
      userName.value = user.name
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    ElMessage.error('获取用户信息失败')
  }
}

onMounted(() => {
  loadUserInfo()
})
</script>

<style scoped>
.home {
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
}

.welcome-card {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  text-align: center;
}

.welcome-card h1 {
  margin-bottom: 20px;
  color: #303133;
}

.welcome-card h2 {
  margin-bottom: 40px;
  color: #606266;
}

.quick-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.quick-actions .el-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
}

.el-icon {
  font-size: 20px;
}
</style> 