<template>
  <div class="course-students">
    <div class="header">
      <el-button @click="router.back()">返回</el-button>
      <h2>选课学生列表</h2>
    </div>
    
    <el-table :data="students" border style="width: 100%">
      <el-table-column prop="userNO" label="学号" width="120" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column label="成绩" width="200">
        <template #default="{ row }">
          <div class="score-input">
            <el-input-number 
              v-model="row.score" 
              :min="0" 
              :max="100"
              :precision="1"
              :controls="false"
              placeholder="请输入成绩"
            />
            <el-button 
              type="primary" 
              size="small" 
              @click="handleSetScore(row)"
              :disabled="row.score === null"
            >
              提交成绩
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { courseApi } from '@/api'

const router = useRouter()
const route = useRoute()
const students = ref<{ userNO: string; name: string; score: number | null }[]>([])

// 加载学生列表
const loadStudents = async () => {
  try {
    const courseNO = Number(route.params.courseNO)
    if (isNaN(courseNO)) {
      ElMessage.error('无效的课程编号')
      return
    }

    const response = await courseApi.getCourseStudents(courseNO)
    console.log('Course students:', response)
    
    if (Array.isArray(response)) {
      students.value = response.map(student => ({
        ...student,
        score: null
      }))
    } else {
      ElMessage.error('获取学生列表失败')
    }
  } catch (error) {
    console.error('获取学生列表失败:', error)
    ElMessage.error('获取学生列表失败')
  }
}

// 提交成绩
const handleSetScore = async (student: { userNO: string; score: number | null }) => {
  if (student.score === null) return
  
  try {
    const courseNO = Number(route.params.courseNO)
    await courseApi.setScore(courseNO, student.userNO, student.score)
    ElMessage.success('成绩提交成功')
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
  padding: 20px;
}

.header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
}

.score-input {
  display: flex;
  gap: 10px;
  align-items: center;
}
</style> 