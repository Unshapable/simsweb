<template>
  <div class="admin-course-view">
    <el-card class="course-card">
      <template #header>
        <div class="card-header">
          <div class="left">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索课程"
              style="width: 200px"
              @keyup.enter="handleSearch"
            >
              <template #append>
                <el-button @click="handleSearch">
                  <el-icon><Search /></el-icon>
                </el-button>
              </template>
            </el-input>
          </div>
          <el-button type="primary" @click="showAddDialog">添加课程</el-button>
        </div>
      </template>

      <el-table :data="courseList" style="width: 100%">
        <el-table-column prop="courseNO" label="课程编号" width="120" />
        <el-table-column prop="courseName" label="课程名称" />
        <el-table-column prop="teacherNO" label="教师工号" width="120" />
        <el-table-column prop="teacherName" label="教师姓名" width="120">
          <template #default="{ row }">
            {{ getTeacherName(row.teacherNO) }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加课程对话框 -->
    <el-dialog
      v-model="addDialogVisible"
      title="添加课程"
      width="500px"
    >
      <el-form
        :model="courseForm"
        :rules="rules"
        ref="courseFormRef"
        label-width="100px"
      >
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="courseForm.courseName" />
        </el-form-item>
        
        <el-form-item label="任课教师" prop="teacherNO">
          <el-select v-model="courseForm.teacherNO" placeholder="请选择教师">
            <el-option
              v-for="teacher in teacherList"
              :key="teacher.userNO"
              :label="teacher.name"
              :value="teacher.userNO"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAddCourse">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { getAllCourse, searchCourse, addCourse } from '../../api/course'
import { getAllTeachers } from '../../api/user'

const searchKeyword = ref('')
const courseList = ref([])
const teacherList = ref([])
const addDialogVisible = ref(false)
const courseFormRef = ref(null)

const courseForm = reactive({
  courseName: '',
  teacherNO: ''
})

const rules = {
  courseName: [
    { required: true, message: '请输入课程名称', trigger: 'blur' }
  ],
  teacherNO: [
    { required: true, message: '请选择任课教师', trigger: 'change' }
  ]
}

// 获取所有课程
const fetchCourses = async () => {
  try {
    const res = await getAllCourse()
    courseList.value = res.data.result
  } catch (error) {
    console.error('获取课程列表失败:', error)
  }
}

// 获取所有教师
const fetchTeachers = async () => {
  try {
    const res = await getAllTeachers()
    teacherList.value = res.data.result
  } catch (error) {
    console.error('获取教师列表失败:', error)
  }
}

onMounted(() => {
  fetchCourses()
  fetchTeachers()
})

// 搜索课程
const handleSearch = async () => {
  if (!searchKeyword.value) {
    await fetchCourses()
    return
  }
  
  try {
    const res = await searchCourse(searchKeyword.value)
    courseList.value = res.data.result
  } catch (error) {
    console.error('搜索课程失败:', error)
  }
}

// 显示添加课程对话框
const showAddDialog = () => {
  addDialogVisible.value = true
  courseForm.courseName = ''
  courseForm.teacherNO = ''
}

// 添加课程
const handleAddCourse = async () => {
  if (!courseFormRef.value) return
  
  await courseFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const res = await addCourse(courseForm)
        if (res.data.result) {
          ElMessage.success('添加课程成功')
          addDialogVisible.value = false
          await fetchCourses()
        }
      } catch (error) {
        console.error('添加课程失败:', error)
      }
    }
  })
}

// 获取教师姓名
const getTeacherName = (teacherNO) => {
  const teacher = teacherList.value.find(t => t.userNO === teacherNO)
  return teacher ? teacher.name : teacherNO
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left {
  display: flex;
  align-items: center;
  gap: 20px;
}
</style> 