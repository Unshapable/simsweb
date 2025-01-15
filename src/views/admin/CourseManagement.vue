<template>
  <div class="course-management">
    <h2>课程管理</h2>
    <div class="actions">
      <el-button type="primary" @click="showAddCourseDialog">添加课程</el-button>
    </div>

    <el-table :data="courses" border style="width: 100%">
      <el-table-column prop="courseNO" label="课程编号" width="120" />
      <el-table-column prop="courseName" label="课程名称" />
      <el-table-column prop="teacherName" label="任课教师" width="120" />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑课程对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle">
      <el-form :model="form" label-width="100px">
        <el-form-item label="课程名称">
          <el-input v-model="form.courseName" />
        </el-form-item>
        <el-form-item label="任课教师">
          <el-select v-model="form.teacherNO" placeholder="请选择教师">
            <el-option
              v-for="teacher in teachers"
              :key="teacher.userNO"
              :label="teacher.name"
              :value="teacher.userNO"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { courseApi, userApi, type Course } from '@/api'

interface Teacher {
  userNO: string
  name: string
}

const courses = ref<Course[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('添加课程')
const teachers = ref<Teacher[]>([])

const form = ref({
  courseName: '',
  teacherNO: ''
})

// 加载课程列表
const loadCourses = async () => {
  try {
    const { list } = await courseApi.getAllCourse({ page: 1, pageSize: 100 })
    courses.value = list
  } catch (error) {
    console.error('获取课程列表失败:', error)
    ElMessage.error('获取课程列表失败')
  }
}

// 加载教师列表
const loadTeachers = async () => {
  try {
    const result = await userApi.getAllTeachers()
    teachers.value = result.map(teacher => ({
      userNO: teacher.userNO,
      name: teacher.name
    }))
  } catch (error) {
    console.error('获取教师列表失败:', error)
    ElMessage.error('获取教师列表失败')
  }
}

// 显示添加课程对话框
const showAddCourseDialog = () => {
  dialogTitle.value = '添加课程'
  form.value = {
    courseName: '',
    teacherNO: ''
  }
  dialogVisible.value = true
}

// 显示编辑课程对话框
const handleEdit = (row: Course) => {
  dialogTitle.value = '编辑课程'
  form.value = {
    courseName: row.courseName,
    teacherNO: row.teacherNO
  }
  dialogVisible.value = true
}

// 处理删除课程
const handleDelete = async (row: Course) => {
  ElMessage.warning('暂不支持删除课程功能')
}

// 提交表单
const handleSubmit = async () => {
  try {
    // 表单验证
    if (!form.value.courseName || !form.value.teacherNO) {
      ElMessage.warning('请填写完整信息')
      return
    }

    if (dialogTitle.value === '添加课程') {
      // 添加课程
      await courseApi.addCourse({
        courseName: form.value.courseName,
        teacherNO: form.value.teacherNO
      })
      ElMessage.success('添加成功')
    } else {
      // TODO: 实现编辑课程功能
      ElMessage.warning('暂不支持编辑课程功能')
    }
    
    dialogVisible.value = false
    loadCourses() // 重新加载课程列表
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败')
  }
}

onMounted(() => {
  loadCourses()
  loadTeachers()
})
</script>

<style scoped>
.actions {
  margin-bottom: 20px;
}
</style> 