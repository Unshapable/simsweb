<template>
  <el-container class="dashboard-container">
    <el-aside width="200px">
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical"
        :router="true"
      >
        <!-- 所有用户可见的菜单项 -->
        <el-menu-item index="/dashboard/profile">
          <el-icon><User /></el-icon>
          <span>个人信息</span>
        </el-menu-item>
        <el-menu-item index="/dashboard/change-password">
          <el-icon><Lock /></el-icon>
          <span>修改密码</span>
        </el-menu-item>
        <el-menu-item index="/dashboard/courses">
          <el-icon><List /></el-icon>
          <span>课程列表</span>
        </el-menu-item>

        <!-- 学生特有的菜单项 -->
        <template v-if="userRole === UserRole.STUDENT">
          <el-menu-item index="/dashboard/my-courses">
            <el-icon><Files /></el-icon>
            <span>我的课程</span>
          </el-menu-item>
          <el-menu-item index="/dashboard/my-grades">
            <el-icon><Document /></el-icon>
            <span>成绩查询</span>
          </el-menu-item>
        </template>

        <!-- 教师特有的菜单项 -->
        <template v-if="userRole === UserRole.TEACHER">
          <el-menu-item index="/dashboard/teaching-courses">
            <el-icon><Reading /></el-icon>
            <span>授课管理</span>
          </el-menu-item>
          <el-menu-item index="/dashboard/grade-management">
            <el-icon><Edit /></el-icon>
            <span>成绩管理</span>
          </el-menu-item>
        </template>

        <!-- 管理员特有的菜单项 -->
        <template v-if="userRole === UserRole.ADMIN">
          <el-menu-item index="/dashboard/user-management">
            <el-icon><UserFilled /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/dashboard/course-management">
            <el-icon><Notebook /></el-icon>
            <span>课程管理</span>
          </el-menu-item>
          <el-menu-item index="/dashboard/system-log">
            <el-icon><Monitor /></el-icon>
            <span>系统日志</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>
    
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { 
  User, Lock, List, Files, Document, 
  Reading, Edit, UserFilled, Notebook, Monitor 
} from '@element-plus/icons-vue'
import { UserRole } from '@/api/user'

const route = useRoute()
const activeMenu = ref(route.path)
const userRole = ref(localStorage.getItem('userRole') as UserRole)
</script>

<style scoped>
.dashboard-container {
  height: calc(100vh - 60px);  /* 减去顶部导航栏的高度 */
}

.el-aside {
  background-color: #f5f7fa;
}

.el-menu-vertical {
  height: 100%;
  border-right: none;
}

.el-main {
  padding: 20px;
  background-color: #fff;
}
</style> 