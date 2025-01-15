<template>
  <div class="grade-management">
    <h2>成绩管理</h2>
    <el-select v-model="selectedCourse" placeholder="选择课程" class="course-select">
      <el-option
        v-for="course in courses"
        :key="course.courseNO"
        :label="course.courseName"
        :value="course.courseNO"
      />
    </el-select>

    <el-table v-if="selectedCourse" :data="students" border style="width: 100%">
      <el-table-column prop="userNO" label="学号" width="120" />
      <el-table-column prop="username" label="姓名" width="120" />
      <el-table-column label="成绩" width="200">
        <template #default="{ row }">
          <el-input-number
            v-model="row.grade"
            :min="0"
            :max="100"
            :precision="0"
            :controls="false"
            placeholder="请输入成绩"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            :disabled="row.grade === null"
            @click="submitGrade(row)"
          >
            提交
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-else-if="courses.length === 0" class="empty-text">
      暂无课程数据
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { courseApi, type Course } from '@/api'

interface Student {
  userNO: string
  username: string
  grade: number | null
}

const selectedCourse = ref('')
const courses = ref<Course[]>([])
const students = ref<Student[]>([])

// 加载教师的课程列表
const loadCourses = async () => {
  try {
    const teacherNO = localStorage.getItem('userNO')
    if (!teacherNO) {
      ElMessage.error('获取用户信息失败')
      return
    }
    const result = await courseApi.getCoursesByTeacherNO(teacherNO)
    courses.value = result
  } catch (error) {
    console.error('获取课程列表失败:', error)
    ElMessage.error('获取课程列表失败')
  }
}

// 加载选课学生列表
const loadStudents = async () => {
  if (!selectedCourse.value) return
  
  try {
    const result = await courseApi.getCourseStudents(Number(selectedCourse.value))
    students.value = result.map(student => ({
      ...student,
      grade: null
    }))
  } catch (error) {
    console.error('获取学生列表失败:', error)
    ElMessage.error('获取学生列表失败')
  }
}

// 提交成绩
const submitGrade = async (student: Student) => {
  if (student.grade === null) {
    ElMessage.warning('请输入成绩')
    return
  }
  
  if (student.grade < 0 || student.grade > 100) {
    ElMessage.warning('成绩必须在0-100之间')
    return
  }

  try {
    await courseApi.setScore(
      Number(selectedCourse.value),
      student.userNO,
      student.grade
    )
    ElMessage.success('成绩提交成功')
  } catch (error) {
    console.error('成绩提交失败:', error)
    ElMessage.error('成绩提交失败')
  }
}

// 监听选中课程变化
watch(selectedCourse, () => {
  students.value = []
  if (selectedCourse.value) {
    loadStudents()
  }
})

// 页面加载时获取课程列表
loadCourses()
</script>

<style scoped>
.grade-management {
  padding: 20px;
}

.course-select {
  margin-bottom: 20px;
  width: 300px;
}

.empty-text {
  text-align: center;
  color: #909399;
  margin-top: 20px;
}
</style> 