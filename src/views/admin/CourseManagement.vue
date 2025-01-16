<template>
  <div class="course-management">
    <div class="page-header">
      <h2>课程管理</h2>
      <el-button type="primary" @click="showAddDialog">
        <el-icon><Plus /></el-icon>
        添加课程
      </el-button>
    </div>

    <el-table :data="courses" border style="width: 100%">
      <el-table-column prop="courseNO" label="课程编号" width="120" />
      <el-table-column prop="courseName" label="课程名称" min-width="180" />
      <el-table-column prop="teacherName" label="授课教师" width="120" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)">
            <el-icon><Edit /></el-icon>
            编辑
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">
            <el-icon><Delete /></el-icon>
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑课程对话框 -->
    <el-dialog 
      v-model="dialogVisible" 
      :title="isEdit ? '编辑课程' : '添加课程'"
      width="500px"
    >
      <el-form 
        ref="formRef"
        :model="courseForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="courseForm.courseName" placeholder="请输入课程名称" />
        </el-form-item>
        <el-form-item label="授课教师" prop="teacherNO">
          <el-select v-model="courseForm.teacherNO" placeholder="请选择教师" class="w-full">
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
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="isSubmitting">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 删除确认对话框 -->
    <el-dialog
      v-model="deleteDialogVisible"
      title="确认删除"
      width="400px"
      center
    >
      <div class="delete-confirm">
        <el-icon class="warning-icon"><Warning /></el-icon>
        <p>确定要删除课程 "{{ selectedCourse?.courseName }}" 吗？</p>
        <p class="warning-text">此操作不可恢复！</p>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="confirmDelete" :loading="isDeleting">
            确认删除
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Edit, Delete, Warning } from '@element-plus/icons-vue'
import { courseApi, userApi, type Course } from '@/api'
import type { FormInstance } from 'element-plus'
import type { User } from '@/api/user'

const courses = ref<Course[]>([])
const teachers = ref<User[]>([])
const dialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const isEdit = ref(false)
const isSubmitting = ref(false)
const isDeleting = ref(false)
const formRef = ref<FormInstance>()
const selectedCourse = ref<Course | null>(null)

const courseForm = ref({
  courseNO: 0,
  courseName: '',
  teacherNO: ''
})

const rules = {
  courseName: [
    { required: true, message: '请输入课程名称', trigger: 'blur' }
  ],
  teacherNO: [
    { required: true, message: '请选择授课教师', trigger: 'change' }
  ]
}

// 加载课程列表
const loadCourses = async () => {
  try {
    const data = await courseApi.getAllCourse()
    if (Array.isArray(data)) {
      // 获取教师信息
      const teacherMap = new Map(
        teachers.value.map(teacher => [teacher.userNO, teacher.name])
      )
      
      // 添加教师姓名到课程信息中
      courses.value = data.map(course => ({
        ...course,
        teacherName: teacherMap.get(course.teacherNO) || '未知教师'
      }))
    } else {
      ElMessage.error('获取课程列表失败')
    }
  } catch (error) {
    console.error('获取课程列表失败:', error)
    ElMessage.error('获取课程列表失败')
  }
}

// 加载教师列表
const loadTeachers = async () => {
  try {
    const data = await userApi.getAllTeachers()
    teachers.value = data
  } catch (error) {
    console.error('获取教师列表失败:', error)
    ElMessage.error('获取教师列表失败')
  }
}

// 显示添加对话框
const showAddDialog = () => {
  isEdit.value = false
  courseForm.value = {
    courseNO: 0,
    courseName: '',
    teacherNO: ''
  }
  dialogVisible.value = true
}

// 处理编辑
const handleEdit = (course: Course) => {
  isEdit.value = true
  courseForm.value = {
    courseNO: course.courseNO,
    courseName: course.courseName,
    teacherNO: course.teacherNO
  }
  dialogVisible.value = true
}

// 处理删除
const handleDelete = (course: Course) => {
  selectedCourse.value = course
  deleteDialogVisible.value = true
}

// 确认删除
const confirmDelete = async () => {
  if (!selectedCourse.value) return
  
  try {
    isDeleting.value = true
    const response = await courseApi.deleteCourse(selectedCourse.value.courseNO)
    
    if (response === true) {
      ElMessage.success('删除成功')
      deleteDialogVisible.value = false
      loadCourses()
    } else {
      throw new Error('删除失败')
    }
  } catch (error: any) {
    ElMessage.error(error.message || '删除失败')
  } finally {
    isDeleting.value = false
  }
}

// 处理提交
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    isSubmitting.value = true

    if (isEdit.value) {
      // 编辑课程
      const response = await courseApi.updateCourse({
        courseNO: courseForm.value.courseNO,
        courseName: courseForm.value.courseName,
        teacherNO: courseForm.value.teacherNO
      })
      
      if (response === true) {
        ElMessage.success('更新成功')
        dialogVisible.value = false
        loadCourses()
      } else {
        throw new Error('更新失败')
      }
    } else {
      // 添加课程
      const response = await courseApi.addCourse({
        courseName: courseForm.value.courseName,
        teacherNO: courseForm.value.teacherNO
      })
      
      if (response === true) {
        ElMessage.success('添加成功')
        dialogVisible.value = false
        loadCourses()
      } else {
        throw new Error('添加失败')
      }
    }
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  // 先加载教师列表，再加载课程列表
  await loadTeachers()
  await loadCourses()
})
</script>

<style scoped>
.course-management {
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

.delete-confirm {
  text-align: center;
  padding: 20px 0;
}

.warning-icon {
  font-size: 48px;
  color: #f59e0b;
  margin-bottom: 16px;
}

.warning-text {
  color: #dc2626;
  font-size: 14px;
  margin: 8px 0 0;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 12px;
}

:deep(.el-button) {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-form-item:last-child) {
  margin-bottom: 0;
}
</style> 