<template>
  <div class="course-container">
    <!-- 管理员视图 -->
    <admin-course-view v-if="userStore.userInfo?.role === 'ADMIN'" />
    
    <!-- 教师视图 -->
    <teacher-course-view v-else-if="userStore.userInfo?.role === 'TEACHER'" />
    
    <!-- 学生视图 -->
    <student-course-view v-else-if="userStore.userInfo?.role === 'STUDENT'" />
  </div>
</template>

<script setup>
import { useUserStore } from '../stores/user'
import AdminCourseView from '../components/course/AdminCourseView.vue'
import TeacherCourseView from '../components/course/TeacherCourseView.vue'
import StudentCourseView from '../components/course/StudentCourseView.vue'

const userStore = useUserStore()
</script>

<style scoped>
.course-container {
  padding: 20px;
}
</style> 