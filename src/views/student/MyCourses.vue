<template>
  <div class="my-courses">
    <div class="page-header">
      <h2>我的课程</h2>
    </div>

    <el-table 
      :data="courses" 
      border 
      style="width: 100%"
      :header-cell-style="{
        background: '#f8fafc',
        color: '#1f2937',
        fontWeight: '600',
        fontSize: '14px',
        height: '50px'
      }"
      :cell-style="{
        fontSize: '14px',
        padding: '12px 0'
      }"
      row-class-name="table-row"
    >
      <el-table-column prop="courseNO" label="课程编号" width="120" align="center">
        <template #default="{ row }">
          <span class="course-no">{{ row.courseNO }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="courseName" label="课程名称" min-width="180" align="center">
        <template #default="{ row }">
          <span class="course-name">{{ row.courseName }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="teacherName" label="任课教师" width="120" align="center">
        <template #default="{ row }">
          <span class="teacher-name">{{ row.teacherName }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="score" label="成绩" width="100" align="center">
        <template #default="{ row }">
          <span :class="['score', { 'no-score': row.score === null }]">
            {{ row.score === null ? '未评分' : row.score }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="120" align="center">
        <template #default="{ row }">
          <el-button type="danger" size="small" @click="handleDrop(row)">
            <el-icon><Delete /></el-icon>
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
import { Delete } from '@element-plus/icons-vue'
import { courseApi, userApi } from '@/api'

interface SelectedCourse {
  courseNO: number
  courseName: string
  teacherName: string
  score: number | null
}

const courses = ref<SelectedCourse[]>([])

// 加载我的课程列表
const loadMyCourses = async () => {
  try {
    // 获取当前用户信息
    const currentUser = await userApi.getCurrentUser()
    if (!currentUser) {
      ElMessage.error('获取用户信息失败')
      return
    }

    const response = await courseApi.getSelectedCoursesByStudentNO(currentUser.userNO)
    console.log('Selected courses:', response)
    
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

// 处理退课
const handleDrop = async (course: SelectedCourse) => {
  try {
    await ElMessageBox.confirm('确定要退选该课程吗？', '提示', {
      type: 'warning'
    })
    await courseApi.cancelCourse(course.courseNO)
    ElMessage.success('退课成功')
    loadMyCourses()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('退课失败:', error)
      ElMessage.error('退课失败')
    }
  }
}

onMounted(() => {
  loadMyCourses()
})
</script>

<style scoped>
.my-courses {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
  color: #1f2937;
  font-weight: 500;
}

:deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

:deep(.el-table th) {
  border-bottom: 1px solid #e5e7eb;
}

:deep(.el-table td) {
  border-bottom: 1px solid #f1f5f9;
}

:deep(.table-row) {
  transition: background-color 0.3s;
}

:deep(.table-row:hover) {
  background-color: #f8fafc !important;
}

.course-no {
  font-family: Monaco, monospace;
  color: #4b5563;
  font-size: 14px;
}

.course-name {
  font-weight: 500;
  color: #1f2937;
}

.teacher-name {
  color: #4b5563;
}

.score {
  font-weight: 500;
  color: #059669;
}

.score.no-score {
  color: #9ca3af;
  font-weight: normal;
}

:deep(.el-button) {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  border-radius: 6px;
}

:deep(.el-button--danger) {
  background-color: #ef4444;
  border-color: #ef4444;
}

:deep(.el-button--danger:hover) {
  background-color: #dc2626;
  border-color: #dc2626;
}

/* 空数据状态样式 */
:deep(.el-table__empty-block) {
  padding: 32px 0;
}

:deep(.el-table__empty-text) {
  color: #6b7280;
  font-size: 14px;
}

/* 表格内容垂直居中 */
:deep(.el-table .cell) {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style> 