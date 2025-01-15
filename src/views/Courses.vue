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
      <el-table-column prop="credit" label="学分" width="80" />
      <el-table-column prop="capacity" label="容量" width="80" />
      <el-table-column prop="selected" label="已选" width="80" />
      <el-table-column label="操作" width="120" v-if="userRole === 'student'">
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
import { courseApi, type Course } from '@/api'

const userRole = ref(localStorage.getItem('userRole'))
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const courses = ref<Course[]>([])

const loadCourses = async () => {
  try {
    const response = await courseApi.getAllCourse()
    
    if (Array.isArray(response)) {
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      courses.value = response.slice(start, end)
      total.value = response.length
    } else {
      console.error('Invalid response format:', response)
      ElMessage.error('获取课程列表失败')
    }
  } catch (error) {
    console.error('获取课程列表失败:', error)
    ElMessage.error('获取课程列表失败')
  }
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

const handleCourseAction = async (course: Course) => {
  try {
    if (course.isSelected) {
      await courseApi.cancelCourse(course.courseNO)
      ElMessage.success('退课成功')
    } else {
      await courseApi.selectCourse(course.courseNO)
      ElMessage.success('选课成功')
    }
    loadCourses()
  } catch (error) {
    console.error('操作失败:', error)
  }
}

onMounted(() => {
  loadCourses()
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