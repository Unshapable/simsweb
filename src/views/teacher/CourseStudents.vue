<template>
  <div class="course-students">
    <div class="page-header">
      <div class="header-left">
        <el-button @click="router.back()">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <h2>选课学生列表</h2>
      </div>
      <div class="header-right">
        <el-input
          v-model="searchText"
          placeholder="搜索学生..."
          prefix-icon="Search"
          clearable
          @clear="handleSearch"
          @input="handleSearch"
        />
      </div>
    </div>
    
    <el-card class="table-card">
      <el-table 
        :data="filteredStudents" 
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
          prop="userNO" 
          label="学号" 
          min-width="180" 
          align="center"
        >
          <template #default="{ row }">
            <span class="student-no">{{ row.userNO }}</span>
          </template>
        </el-table-column>

        <el-table-column 
          prop="name" 
          label="姓名" 
          min-width="180" 
          align="center"
        >
          <template #default="{ row }">
            <span class="student-name">{{ row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column 
          label="成绩" 
          min-width="320"
          align="center"
        >
          <template #default="{ row }">
            <div class="score-input">
              <el-input-number 
                v-model="row.score" 
                :min="0" 
                :max="100"
                :precision="1"
                :controls="false"
                placeholder="请输入成绩"
                class="score-input-number"
              />
              <el-button 
                type="primary" 
                size="small" 
                @click="handleSetScore(row)"
                :disabled="row.score === null"
                class="submit-button"
              >
                <el-icon><Check /></el-icon>
                提交成绩
              </el-button>
            </div>
          </template>
        </el-table-column>

        <el-table-column 
          label="状态" 
          min-width="180" 
          align="center"
        >
          <template #default="{ row }">
            <el-tag 
              :type="row.score === null ? 'info' : 'success'"
              class="status-tag"
              effect="light"
            >
              {{ row.score === null ? '未评分' : '已评分' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-footer" v-if="filteredStudents.length === 0">
        <el-empty description="暂无学生数据" />
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { courseApi } from '@/api'
import { ArrowLeft, Search, Check } from '@element-plus/icons-vue'

interface Student {
  userNO: string
  name: string
  score: number | null
}

const router = useRouter()
const route = useRoute()
const students = ref<Student[]>([])
const searchText = ref('')
const currentCourseNO = computed(() => Number(route.params.courseNO))

// 过滤后的学生列表
const filteredStudents = computed(() => {
  if (!searchText.value) return students.value
  const search = searchText.value.toLowerCase()
  return students.value.filter(student => 
    student.userNO.toLowerCase().includes(search) ||
    student.name.toLowerCase().includes(search)
  )
})

// 处理搜索
const handleSearch = () => {
  // 搜索逻辑已通过计算属性实现
}

// 加载学生列表和成绩
const loadStudents = async () => {
  try {
    if (isNaN(currentCourseNO.value)) {
      ElMessage.error('无效的课程编号')
      return
    }

    const response = await courseApi.getCourseStudents(currentCourseNO.value)
    console.log('Course students:', response)
    
    if (Array.isArray(response)) {
      // 创建一个 Promise 数组来并行获取所有学生的成绩
      const studentsWithScores = await Promise.all(
        response.map(async (student) => {
          try {
            // 直接获取当前课程的成绩
            const score = await courseApi.getScore(currentCourseNO.value, student.userNO)
            return {
              ...student,
              score: score ?? null
            }
          } catch (error) {
            console.error(`获取学生 ${student.userNO} 的成绩失败:`, error)
            return {
              ...student,
              score: null
            }
          }
        })
      )

      students.value = studentsWithScores
    } else {
      ElMessage.error('获取学生列表失败')
    }
  } catch (error) {
    console.error('获取学生列表失败:', error)
    ElMessage.error('获取学生列表失败')
  }
}

// 提交成绩
const handleSetScore = async (student: Student) => {
  if (student.score === null) return
  
  try {
    await courseApi.setScore(currentCourseNO.value, student.userNO, student.score)
    ElMessage.success('成绩提交成功')
    await new Promise(resolve => setTimeout(resolve, 500))
    // 重新加载学生列表和成绩
    await loadStudents()
  } catch (error) {
    console.error('成绩提交失败:', error)
    ElMessage.error('成绩提交失败')
  }
}

onMounted(() => {
  loadStudents()
})
</script>

<style scoped>
.course-students {
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

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-left h2 {
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

.student-no {
  font-family: Monaco, monospace;
  color: #4b5563;
  font-size: 14px;
}

.student-name {
  font-weight: 500;
  color: #1f2937;
}

.score-input {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
}

.score-input-number {
  width: 140px;
}

:deep(.el-input-number .el-input__wrapper) {
  padding: 0 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

:deep(.el-input-number .el-input__wrapper:hover) {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.submit-button {
  min-width: 120px;
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

.status-tag {
  min-width: 72px;
  text-align: center;
  font-size: 13px;
}

:deep(.el-tag--success) {
  background-color: #ecfdf5;
  border-color: #d1fae5;
  color: #059669;
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