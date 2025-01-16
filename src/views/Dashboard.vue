<template>
  <el-container class="dashboard-container">
    <el-aside width="240px">
      <div class="menu-wrapper">
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical"
          :router="true"
        >
          <!-- 所有用户可见的菜单项 -->
          <div class="menu-section">
            <div class="menu-section-title">常用功能</div>
            <el-menu-item index="/profile">
              <el-icon><User /></el-icon>
              <span>个人信息</span>
            </el-menu-item>
            <el-menu-item index="/courses">
              <el-icon><List /></el-icon>
              <span>课程列表</span>
            </el-menu-item>
          </div>

          <!-- 学生特有的菜单项 -->
          <template v-if="userRole === UserRole.STUDENT">
            <div class="menu-section">
              <div class="menu-section-title">学生功能</div>
              <el-menu-item index="/student/my-courses">
                <el-icon><Files /></el-icon>
                <span>我的课程</span>
              </el-menu-item>
            </div>
          </template>

          <!-- 教师特有的菜单项 -->
          <template v-if="userRole === UserRole.TEACHER">
            <div class="menu-section">
              <div class="menu-section-title">教师功能</div>
              <el-menu-item index="/teacher/teaching-courses">
                <el-icon><Reading /></el-icon>
                <span>授课管理</span>
              </el-menu-item>
            </div>
          </template>

          <!-- 管理员特有的菜单项 -->
          <template v-if="userRole === UserRole.ADMIN">
            <div class="menu-section">
              <div class="menu-section-title">系统管理</div>
              <el-menu-item index="/admin/user-management">
                <el-icon><UserFilled /></el-icon>
                <span>用户管理</span>
              </el-menu-item>
              <el-menu-item index="/admin/course-management">
                <el-icon><Notebook /></el-icon>
                <span>课程管理</span>
              </el-menu-item>
              <el-menu-item index="/admin/system-log">
                <el-icon><Monitor /></el-icon>
                <span>系统日志</span>
              </el-menu-item>
            </div>
          </template>
        </el-menu>
      </div>
    </el-aside>
    
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { 
  User, List, Files, Reading, 
  UserFilled, Notebook, Monitor 
} from '@element-plus/icons-vue'
import { UserRole } from '@/api/user'

const route = useRoute()
const userRole = ref(localStorage.getItem('userRole') as UserRole)
const activeMenu = ref(route.path)

// 监听路由变化
watch(
  () => route.path,
  (newPath) => {
    activeMenu.value = newPath
  },
  { immediate: true }
)
</script>

<style scoped>
.dashboard-container {
  height: calc(100vh - 60px);
}

.el-aside {
  background-color: #fff;
  border-right: 1px solid #e5e7eb;
  transition: all 0.3s;
}

.menu-wrapper {
  padding: 16px 0;
  height: 100%;
}

.menu-section {
  margin-bottom: 24px;
}

.menu-section-title {
  padding: 0 20px;
  margin-bottom: 8px;
  color: #6b7280;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.el-menu-vertical {
  border-right: none;
}

:deep(.el-menu-item) {
  height: 50px;
  line-height: 50px;
  margin: 4px 16px;
  padding: 0 16px !important;
  border-radius: 8px;
}

:deep(.el-menu-item.is-active) {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

:deep(.el-menu-item:hover) {
  background-color: #f3f4f6;
  color: var(--el-color-primary);
}

:deep(.el-menu-item .el-icon) {
  font-size: 18px;
  margin-right: 12px;
}

.el-main {
  padding: 24px;
  background-color: #f9fafb;
}

/* 添加滚动条样式 */
.menu-wrapper {
  overflow-y: auto;
}

.menu-wrapper::-webkit-scrollbar {
  width: 6px;
}

.menu-wrapper::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 3px;
}

.menu-wrapper::-webkit-scrollbar-track {
  background-color: transparent;
}
</style> 