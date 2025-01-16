<template>
  <div class="teaching-courses">
    <div class="page-header">
      <h2>授课管理</h2>
      <div class="header-right">
        <el-input
          v-model="searchText"
          placeholder="搜索课程..."
          prefix-icon="Search"
          clearable
          @clear="handleSearch"
          @input="handleSearch"
        />
      </div>
    </div>

    <el-card class="table-card">
      <el-table 
        :data="filteredCourses" 
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
        <el-table-column 
          prop="courseNO" 
          label="课程编号" 
          min-width="180" 
          align="center"
        >
          <template #default="{ row }">
            <span class="course-no">{{ row.courseNO }}</span>
          </template>
        </el-table-column>

        <el-table-column 
          prop="courseName" 
          label="课程名称" 
          min-width="240" 
          align="center"
        >
          <template #default="{ row }">
            <span class="course-name">{{ row.courseName }}</span>
          </template>
        </el-table-column>

        <el-table-column 
          label="选课人数" 
          min-width="180" 
          align="center"
        >
          <template #default="{ row }">
            <div class="student-count">
              <span class="count-text">{{ row.studentCount || 0 }}</span>
              <span>人</span>
            </div>
          </template>
        </el-table-column>


        <el-table-column 
          label="操作" 
          min-width="180" 
          align="center"
        >
          <template #default="{ row }">
            <el-button 
              type="primary" 
              size="small"
              @click="handleViewStudents(row)"
              class="action-button"
            >
              <el-icon><List /></el-icon>
              查看学生
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-footer" v-if="filteredCourses.length === 0">
        <el-empty description="暂无课程数据" />
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { courseApi, type Course } from '@/api'
import { List, Search } from '@element-plus/icons-vue'

interface CourseWithCount extends Course {
  studentCount?: number
}

const router = useRouter()
const courses = ref<CourseWithCount[]>([])
const searchText = ref('')

// 过滤后的课程列表
const filteredCourses = computed(() => {
  if (!searchText.value) return courses.value
  const search = searchText.value.toLowerCase()
  return courses.value.filter(course => 
    course.courseNO.toString().includes(search) ||
    course.courseName.toLowerCase().includes(search)
  )
})

// 处理搜索
const handleSearch = () => {
  // 搜索逻辑已通过计算属性实现
}

// 获取课程的选课人数
const getStudentCount = async (courseNO: number) => {
  try {
    const students = await courseApi.getCourseStudents(courseNO)
    return Array.isArray(students) ? students.length : 0
  } catch (error) {
    console.error(`获取课程 ${courseNO} 的学生数量失败:`, error)
    return 0
  }
}

// 加载课程列表
const loadCourses = async () => {
  try {
    const userNO = localStorage.getItem('userNO')
    const userRole = localStorage.getItem('userRole')
    
    if (!userNO || userRole !== 'TEACHER') {
      ElMessage.error('获取教师信息失败')
      return
    }

    const response = await courseApi.getCoursesByTeacherNO(userNO)
    console.log('Teaching courses:', response)
    
    if (Array.isArray(response)) {
      // 获取每个课程的选课人数
      const coursesWithCount = await Promise.all(
        response.map(async (course) => ({
          ...course,
          studentCount: await getStudentCount(course.courseNO)
        }))
      )
      courses.value = coursesWithCount
    } else {
      ElMessage.error('获取课程列表失败')
    }
  } catch (error) {
    console.error('获取课程列表失败:', error)
    ElMessage.error('获取课程列表失败')
  }
}

// 查看学生
const handleViewStudents = (course: Course) => {
  router.push(`/teacher/course/${course.courseNO}/students`)
}

onMounted(() => {
  loadCourses()
})
</script>

<style scoped>
.teaching-courses {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
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

.header-right {
  width: 240px;
}

.table-card {
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background: #fff;
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

.student-count {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #4b5563;
}

.count-text {
  color: #1f2937;
  font-weight: 500;
  font-size: 16px;
}

.count-divider,
.capacity-text,
.credit-tag {
  display: none;
}

.action-button {
  min-width: 100px;
}

:deep(.el-button .el-icon) {
  margin-right: 4px;
}

:deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

:deep(.el-table th) {
  border-bottom: 1px solid #e5e7eb;
}

:deep(.el-table td) {
  border-bottom: 1px solid #f1f5f9;
}

:deep(.el-tag--info) {
  background-color: #f3f4f6;
  border-color: #e5e7eb;
  color: #6b7280;
}

.table-footer {
  padding: 40px 0;
  background: #fff;
  border-radius: 0 0 8px 8px;
}

:deep(.el-empty) {
  padding: 48px 0;
}
</style> 