<template>
  <div class="teaching-courses">
    <h2>授课管理</h2>
    <el-table :data="courses" border style="width: 100%">
      <el-table-column prop="courseNO" label="课程编号" width="120" />
      <el-table-column prop="courseName" label="课程名称" />
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleViewStudents(row)">
            查看学生
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { courseApi, userApi } from '@/api'
import { ElMessage } from 'element-plus'

interface Course {
  courseNO: number
  courseName: string
  teacherNO: string
}

const router = useRouter()
const courses = ref<Course[]>([])

// 加载教授课程列表
const loadTeachingCourses = async () => {
  try {
    // 获取当前用户信息
    const currentUser = await userApi.getCurrentUser()
    if (!currentUser) {
      ElMessage.error('获取用户信息失败')
      return
    }

    const response = await courseApi.getCoursesByTeacherNO(currentUser.userNO)
    console.log('Teaching courses:', response)

    if (Array.isArray(response)) {
      courses.value = response
      console.log('Courses value:', courses.value)
    } else {
      ElMessage.error('获取课程列表失败')
    }
  } catch (error) {
    console.error('获取课程列表失败:', error)
    ElMessage.error('获取课程列表失败')
  }
}

// 查看学生列表
const handleViewStudents = (course: Course) => {
  router.push({
    name: 'CourseStudents',
    params: { courseNO: course.courseNO.toString() }
  })
}

onMounted(() => {
  loadTeachingCourses()
})
</script>

<style scoped>
.teaching-courses {
  padding: 20px;
}
</style> 