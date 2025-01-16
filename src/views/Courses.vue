<template>
  <div class="courses">
    <div class="page-header">
      <h2>课程列表</h2>
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
          prop="teacherName" 
          label="授课教师" 
          min-width="180" 
          align="center"
        >
          <template #default="{ row }">
            <span class="teacher-name">{{ row.teacherName }}</span>
          </template>
        </el-table-column>

        <el-table-column 
          v-if="userRole === 'STUDENT'"
          label="操作" 
          min-width="180" 
          align="center"
        >
          <template #default="{ row }">
            <el-button 
              :type="isSelected(row) ? 'danger' : 'primary'"
              size="small"
              @click="handleSelect(row)"
              class="action-button"
            >
              <el-icon>
                <component :is="isSelected(row) ? 'Delete' : 'Plus'" />
              </el-icon>
              {{ isSelected(row) ? '退课' : '选课' }}
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
import { ElMessage } from 'element-plus'
import { Plus, Delete, Search } from '@element-plus/icons-vue'
import { courseApi, userApi, type Course } from '@/api'
import { UserRole } from '@/api/user'

interface CourseWithSelection extends Course {
  isSelected?: boolean
}

const courses = ref<CourseWithSelection[]>([])
const searchText = ref('')
const userRole = ref(localStorage.getItem('userRole'))

// 过滤后的课程列表
const filteredCourses = computed(() => {
  if (!searchText.value) return courses.value
  const search = searchText.value.toLowerCase()
  return courses.value.filter(course => 
    course.courseNO.toString().includes(search) ||
    course.courseName.toLowerCase().includes(search) ||
    course.teacherName?.toLowerCase().includes(search)
  )
})

// 处理搜索
const handleSearch = () => {
  // 搜索逻辑已通过计算属性实现
}

// 检查课程是否已选
const isSelected = (course: CourseWithSelection) => {
  return course.isSelected || false
}

// 加载已选课程并标记状态
const markSelectedCourses = async () => {
  try {
    const userNO = localStorage.getItem('userNO')
    if (!userNO) return
    
    const response = await courseApi.getSelectedCoursesByStudentNO(userNO)
    
    if (Array.isArray(response)) {
      const selectedCourseNOs = response.map(course => course.courseNO)
      
      // 更新每个课程的选课状态
      courses.value = courses.value.map(course => {
        const isSelected = selectedCourseNOs.includes(course.courseNO)
        return {
          ...course,
          isSelected
        }
      })
    }
  } catch (error) {
    console.error('获取已选课程失败:', error)
  }
}

// 加载课程列表
const loadCourses = async () => {
  try {
    const response = await courseApi.getAllCourse()
    if (Array.isArray(response)) {
      // 获取每个课程的教师信息
      const coursesWithTeacher = await Promise.all(
        response.map(async (course) => {
          try {
            const teacherInfo = await userApi.getUserByUserNO(course.teacherNO)
            return {
              ...course,
              teacherName: teacherInfo.name || '未知教师',
              isSelected: false // 初始化选课状态为 false
            }
          } catch (error) {
            console.error(`获取教师 ${course.teacherNO} 信息失败:`, error)
            return {
              ...course,
              teacherName: '未知教师',
              isSelected: false
            }
          }
        })
      )
      courses.value = coursesWithTeacher

      // 如果是学生，立即加载选课状态
      if (userRole.value === UserRole.STUDENT) {
        await markSelectedCourses()
      }
    } else {
      ElMessage.error('获取课程列表失败')
    }
  } catch (error) {
    console.error('获取课程列表失败:', error)
    ElMessage.error('获取课程列表失败')
  }
}

// 处理选课/退课
const handleSelect = async (course: CourseWithSelection) => {
  try {
    if (isSelected(course)) {
      await courseApi.cancelCourse(course.courseNO)
      ElMessage.success('退课成功')
      course.isSelected = false
    } else {
      await courseApi.selectCourse(course.courseNO)
      ElMessage.success('选课成功')
      course.isSelected = true
    }
  } catch (error: any) {
    console.error('操作失败:', error)
    ElMessage.error(error.message || `${isSelected(course) ? '退课' : '选课'}失败`)
  }
}

// 初始化
onMounted(async () => {
  await loadCourses()
})
</script>

<style scoped>
.courses {
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

.teacher-name {
  color: #4b5563;
}

.action-button {
  min-width: 88px;
}

:deep(.el-button .el-icon) {
  margin-right: 4px;
}

:deep(.el-button.is-disabled) {
  background-color: #e5e7eb;
  border-color: #e5e7eb;
  color: #9ca3af;
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

.table-footer {
  padding: 40px 0;
  background: #fff;
  border-radius: 0 0 8px 8px;
}

:deep(.el-empty) {
  padding: 48px 0;
}
</style> 