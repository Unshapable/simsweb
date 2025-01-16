<template>
  <div class="user-management">
    <div class="page-header">
      <h2>用户管理</h2>
      <el-button type="primary" @click="showAddUserDialog">
        <el-icon><Plus /></el-icon>
        添加用户
      </el-button>
    </div>

    <el-table :data="users" border style="width: 100%">
      <el-table-column prop="userNO" label="学工号" width="120" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="role" label="角色" width="100">
        <template #default="{ row }">
          {{ roleLabels[row.role as UserRole] }}
        </template>
      </el-table-column>
      <el-table-column prop="gender" label="性别" width="80">
        <template #default="{ row }">
          {{ genderLabels[row.gender as Gender] }}
        </template>
      </el-table-column>
      <el-table-column prop="major" label="专业" />
      <el-table-column prop="grade" label="年级" width="80" />
      <el-table-column prop="email" label="邮箱" min-width="180" />
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

    <!-- 添加/编辑用户对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="userForm" :rules="rules" ref="userFormRef" label-width="100px">
        <el-form-item label="学工号" prop="userNO">
          <el-input v-model="userForm.userNO" :disabled="isEdit" placeholder="请输入学工号" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userForm.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userForm.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role" style="width: 100%">
            <el-option label="教师" :value="UserRole.TEACHER" />
            <el-option label="学生" :value="UserRole.STUDENT" />
          </el-select>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="userForm.gender" style="width: 100%">
            <el-option label="男" :value="Gender.MALE" />
            <el-option label="女" :value="Gender.FEMALE" />
          </el-select>
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-input v-model="userForm.major" placeholder="请输入专业" />
        </el-form-item>
        <el-form-item label="年级" prop="grade" v-if="userForm.role === UserRole.STUDENT">
          <el-input v-model.number="userForm.grade" type="number" placeholder="请输入年级" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="userForm.phone" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="userForm.address" placeholder="请输入地址" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { userApi, User, UserRole, Gender } from '@/api/user'

const users = ref<User[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('添加用户')
const isEdit = ref(false)
const userFormRef = ref<FormInstance>()

const roleLabels = {
  [UserRole.ADMIN]: '管理员',
  [UserRole.TEACHER]: '教师',
  [UserRole.STUDENT]: '学生'
}

const genderLabels = {
  [Gender.MALE]: '男',
  [Gender.FEMALE]: '女'
}

const userForm = ref<Partial<User>>({
  userNO: '',
  name: '',
  password: '',
  role: UserRole.STUDENT,
  gender: Gender.MALE,
  major: '',
  grade: undefined,
  email: '',
  phone: '',
  address: ''
})

const rules = {
  userNO: [{ required: true, message: '请输入学工号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  major: [{ required: true, message: '请输入专业', trigger: 'blur' }],
  email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }]
}

// 加载用户列表
const loadUsers = async () => {
  try {
    const data = await userApi.getAllUsers()
    users.value = data
  } catch (error) {
    console.error('获取用户列表失败:', error)
    ElMessage.error('获取用户列表失败')
  }
}

// 显示添加用户对话框
const showAddUserDialog = () => {
  dialogTitle.value = '添加用户'
  isEdit.value = false
  userForm.value = {
    userNO: '',
    name: '',
    password: '',
    role: UserRole.STUDENT,
    gender: Gender.MALE,
    major: '',
    grade: undefined,
    email: '',
    phone: '',
    address: ''
  }
  dialogVisible.value = true
}

// 处理编辑用户
const handleEdit = (row: User) => {
  dialogTitle.value = '编辑用户'
  isEdit.value = true
  userForm.value = { ...row }
  dialogVisible.value = true
}

// 处理删除用户
const handleDelete = async (row: User) => {
  ElMessage.warning('暂不支持删除用户功能')
}

// 处理表单提交
const handleSubmit = async () => {
  if (!userFormRef.value) return

  try {
    await userFormRef.value.validate()

    if (isEdit.value) {
      await userApi.updateUser(userForm.value as User)
      ElMessage.success('更新成功')
    } else {
      await userApi.register(userForm.value as User)
      ElMessage.success('添加成功')
    }

    dialogVisible.value = false
    loadUsers()
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败')
  }
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.user-management {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

:deep(.el-button) {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

:deep(.el-table) {
  margin-top: 20px;
  border-radius: 4px;
  overflow: hidden;
}

:deep(.el-dialog__body) {
  padding: 20px 40px;
}

:deep(.el-form-item:last-child) {
  margin-bottom: 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

:deep(.el-select) {
  width: 100%;
}
</style>