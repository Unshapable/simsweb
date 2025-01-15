<template>
  <div class="home-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="welcome-card">
          <template #header>
            <div class="card-header">
              <span>欢迎回来</span>
            </div>
          </template>
          <div class="welcome-content">
            <h3>{{ userStore.userInfo?.name }}</h3>
            <p>角色: {{ roleMap[userStore.userInfo?.role] }}</p>
            <p>学号/工号: {{ userStore.userInfo?.userNO }}</p>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>快捷操作</span>
            </div>
          </template>
          <div class="quick-actions">
            <el-button type="primary" @click="router.push('/profile')">
              修改个人信息
            </el-button>
            <el-button type="primary" @click="router.push('/course')">
              课程管理
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const roleMap = {
  'ADMIN': '管理员',
  'TEACHER': '教师',
  'STUDENT': '学生'
}
</script>

<style scoped>
.home-container {
  padding: 20px;
}

.welcome-content {
  text-align: center;
}

.welcome-content h3 {
  margin-bottom: 20px;
}

.quick-actions {
  display: flex;
  gap: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 