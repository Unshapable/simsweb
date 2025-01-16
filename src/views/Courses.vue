<template>
  <div class="courses">
    <div class="search-bar">
      <el-input
        v-model="searchQuery"
        placeholder="搜索课程名称"
        class="search-input"
      >
        <template #append>
          <el-button :icon="Search" @click="handleSearch" />
        </template>
      </el-input>
    </div>

    <el-table :data="courses" border style="width: 100%">
      <el-table-column prop="courseNO" label="课程编号" width="120" />
      <el-table-column prop="courseName" label="课程名称" />
      <el-table-column prop="teacher" label="任课教师" width="120" />

      <el-table-column label="操作" width="120" v-if="userRole === 'STUDENT'">
        <template #default="{ row }">
          <el-button 
            :type="row.isSelected ? 'danger' : 'primary'"
            size="small"
            @click="handleCourseAction(row)"
          >
            {{ row.isSelected ? '退课' : '选课' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { courseApi, userApi, type Course } from '@/api'

interface Teacher {
  userNO: string
  name: string
}

const userRole = ref(localStorage.getItem('userRole'))
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const courses = ref<Course[]>([])
const selectedCourseNOs = ref<number[]>([]) // 存储已选课程的编号

// 加载学生已选课程
const loadSelectedCourses = async () => {
  if (userRole.value !== 'STUDENT') return
  
  try {
    // 获取当前用户信息
    const currentUser = await userApi.getCurrentUser()
    if (!currentUser) return
    
    const response = await courseApi.getSelectedCoursesByStudentNO(currentUser.userNO)
    console.log('Selected courses response:', response)
    
    if (Array.isArray(response)) {
      // 保存已选课程的编号
      selectedCourseNOs.value = response.map(course => course.courseNO)
      console.log('Selected course numbers:', selectedCourseNOs.value)
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
      const processedCourses = await Promise.all(response.map(async course => {
        // 获取教师信息
        try {
          const teacherInfo = await userApi.getUserByUserNO(course.teacherNO)
          return {
            ...course,
            teacher: teacherInfo.name || '未知教师',
            isSelected: selectedCourseNOs.value.includes(course.courseNO)
          }
        } catch (error) {
          console.error(`获取教师 ${course.teacherNO} 信息失败:`, error)
          return {
            ...course,
            teacher: '未知教师',
            isSelected: selectedCourseNOs.value.includes(course.courseNO)
          }
        }
      }))

      // 前端分页
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      courses.value = processedCourses.slice(start, end)
      total.value = response.length
    }
  } catch (error) {
    console.error('获取课程列表失败:', error)
    ElMessage.error('获取课程列表失败')
  }
}

// 重新加载所有数据
const reloadData = async () => {
  await loadSelectedCourses() // 先加载已选课程
  await loadCourses() // 再加载课程列表
}

const handleSearch = () => {
  currentPage.value = 1
  loadCourses()
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  loadCourses()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  loadCourses()
}

// 处理课程操作
const handleCourseAction = async (course: Course & { isSelected?: boolean }) => {
  try {
    if (course.isSelected) {
      await courseApi.cancelCourse(course.courseNO)
      ElMessage.success('退课成功')
    } else {
      await courseApi.selectCourse(course.courseNO)
      ElMessage.success('选课成功')
    }
    await reloadData() // 重新加载数据
  } catch (error: any) {
    console.error('操作失败:', error)
    ElMessage.error(error.message || `${course.isSelected ? '退课' : '选课'}失败`)
  }
}

onMounted(async () => {
  await reloadData()
})
</script>

<style scoped>
.courses {
  padding: 20px;
}

.search-bar {
  margin-bottom: 20px;
}

.search-input {
  width: 300px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 