<template>
  <div class="my-grades">
    <h2>成绩查询</h2>
    <el-table :data="grades" border style="width: 100%">
      <el-table-column prop="courseNO" label="课程编号" width="120" />
      <el-table-column prop="courseName" label="课程名称" />
      <el-table-column prop="teacherName" label="任课教师" width="120" />
      <el-table-column prop="credit" label="学分" width="80" />
      <el-table-column prop="grade" label="成绩" width="80">
        <template #default="{ row }">
          <span :class="{ 'text-danger': row.grade < 60 }">{{ row.grade }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { courseApi } from '@/api'

interface Grade {
  courseNO: number
  courseName: string
  teacherName: string
  credit: number
  grade: number
}

const grades = ref<Grade[]>([])

// 加载成绩列表
const loadGrades = async () => {
  try {
    const currentUser = localStorage.getItem('userNO')
    if (!currentUser) {
      ElMessage.error('获取用户信息失败')
      return
    }
    const result = await courseApi.getSelectedCourses(currentUser)
    grades.value = result.filter(course => course.grade !== null)
  } catch (error) {
    console.error('获取成绩列表失败:', error)
    ElMessage.error('获取成绩列表失败')
  }
}

onMounted(() => {
  loadGrades()
})
</script>

<style scoped>
.my-grades {
  padding: 20px;
}

.text-danger {
  color: #f56c6c;
}
</style> 