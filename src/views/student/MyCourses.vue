<template>
  <div class="my-courses">
    <h2>我的课程</h2>
    <el-table :data="courses" border style="width: 100%">
      <el-table-column prop="courseNO" label="课程编号" width="120" />
      <el-table-column prop="courseName" label="课程名称" />
      <el-table-column prop="teacherName" label="任课教师" width="120" />
      <el-table-column prop="credit" label="学分" width="80" />
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button type="danger" size="small" @click="handleDrop(row)">
            退课
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { courseApi, type Course } from '@/api'

const courses = ref<Course[]>([])

// 加载我的课程列表
const loadMyCourses = async () => {
  try {
    const currentUser = localStorage.getItem('userNO')
    if (!currentUser) {
      ElMessage.error('获取用户信息失败')
      return
    }
    const result = await courseApi.getSelectedCoursesByStudentNO(currentUser)
    courses.value = result
  } catch (error) {
    console.error('获取课程列表失败:', error)
    ElMessage.error('获取课程列表失败')
  }
}

// 处理退课
const handleDrop = async (course: Course) => {
  try {
    await ElMessageBox.confirm('确定要退选该课程吗？', '提示', {
      type: 'warning'
    })
    await courseApi.cancelCourse(course.courseNO)
    ElMessage.success('退课成功')
    loadMyCourses()
  } catch (error) {
    console.error('退课失败:', error)
    ElMessage.error('退课失败')
  }
}

onMounted(() => {
  loadMyCourses()
})
</script>

<style scoped>
.my-courses {
  padding: 20px;
}
</style> 