<template>
  <div class="home">
    <div class="welcome-section">
      <div class="welcome-content">
        <h1>欢迎使用学生信息管理系统</h1>
        <h2>{{ welcomeMessage }}</h2>
      </div>
    </div>

    <div class="quick-access-section">
      <h3>快捷功能</h3>
      
      <!-- 学生快捷入口 -->
      <div v-if="userRole === 'STUDENT'" class="quick-actions">
        <el-card class="action-card" @click="router.push('/courses')">
          <el-icon><List /></el-icon>
          <span>选课中心</span>
          <p class="card-desc">浏览并选择您感兴趣的课程</p>
        </el-card>
        
        <el-card class="action-card" @click="router.push('/student/my-courses')">
          <el-icon><Collection /></el-icon>
          <span>我的课程</span>
          <p class="card-desc">查看已选课程和成绩</p>
        </el-card>
      </div>

      <!-- 教师快捷入口 -->
      <div v-if="userRole === 'TEACHER'" class="quick-actions">
        <el-card class="action-card" @click="router.push('/teacher/teaching-courses')">
          <el-icon><Reading /></el-icon>
          <span>授课管理</span>
          <p class="card-desc">管理您的授课课程和学生</p>
        </el-card>
      </div>

      <!-- 管理员快捷入口 -->
      <div v-if="userRole === 'ADMIN'" class="quick-actions">
        <el-card class="action-card" @click="router.push('/admin/user-management')">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
          <p class="card-desc">管理系统用户信息</p>
        </el-card>
        
        <el-card class="action-card" @click="router.push('/admin/course-management')">
          <el-icon><Edit /></el-icon>
          <span>课程管理</span>
          <p class="card-desc">管理系统课程信息</p>
        </el-card>
        
        <el-card class="action-card" @click="router.push('/admin/system-log')">
          <el-icon><Monitor /></el-icon>
          <span>系统日志</span>
          <p class="card-desc">查看系统运行状态</p>
        </el-card>
      </div>
    </div>

    <div class="system-info-section">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="info-card">
            <template #header>
              <div class="card-header">
                <span>系统公告</span>
              </div>
            </template>
            <p>欢迎使用新版学生信息管理系统</p>
          </el-card>
        </el-col>
        
        <el-col :span="8">
          <el-card class="info-card">
            <template #header>
              <div class="card-header">
                <span>使用帮助</span>
              </div>
            </template>
            <p>如需帮助，请联系系统管理员</p>
          </el-card>
        </el-col>
        
        <el-col :span="8">
          <el-card class="info-card">
            <template #header>
              <div class="card-header">
                <span>系统信息</span>
              </div>
            </template>
            <p>当前版本：1.0.0</p>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { List, Collection, Reading, User, Edit, Monitor } from '@element-plus/icons-vue'

const router = useRouter()
const userRole = localStorage.getItem('userRole')

const welcomeMessage = computed(() => {
  const hour = new Date().getHours()
  const timeMsg = hour < 12 ? '早上好' : hour < 18 ? '下午好' : '晚上好'
  return `${timeMsg}，${userRole === 'ADMIN' ? '管理员' : userRole === 'TEACHER' ? '老师' : '同学'}`
})
</script>

<style scoped>
.home {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.welcome-section {
  background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%);
  margin: -20px -20px 20px;
  padding: 40px;
  color: white;
  text-align: center;
}

.welcome-content h1 {
  font-size: 28px;
  margin-bottom: 10px;
  font-weight: 500;
}

.welcome-content h2 {
  font-size: 18px;
  font-weight: 400;
  opacity: 0.9;
}

.quick-access-section {
  margin-bottom: 30px;
}

.quick-access-section h3 {
  font-size: 18px;
  color: #1f2937;
  margin-bottom: 20px;
  font-weight: 500;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.action-card {
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
  padding: 20px;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-card .el-icon {
  font-size: 32px;
  color: #1890ff;
  margin-bottom: 12px;
}

.action-card span {
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 8px;
}

.card-desc {
  color: #6b7280;
  font-size: 14px;
  margin: 0;
}

.system-info-section {
  margin-top: 30px;
}

.info-card {
  height: 100%;
}

.card-header {
  display: flex;
  align-items: center;
  font-weight: 500;
}

:deep(.el-card__header) {
  padding: 12px 20px;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.el-card__body) {
  padding: 20px;
}
</style> 