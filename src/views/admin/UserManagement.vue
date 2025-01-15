<template>
  <div class="user-management">
    <div class="header">
      <h2>用户管理</h2>
      <div class="actions">
        <el-button type="primary" @click="showAddUserDialog">
          <el-icon>
            <Plus />
          </el-icon>添加用户
        </el-button>
      </div>
    </div>

    <el-table :data="users" border style="width: 100%">
      <el-table-column prop="userNO" label="学工号" width="120" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="role" label="角色" width="100">
        <template #default="{ row }">
          {{ roleLabels[row.role] }}
        </template>
      </el-table-column>
      <el-table-column prop="gender" label="性别" width="80">
        <template #default="{ row }">
          {{ genderLabels[row.gender] }}
        </template>
      </el-table-column>
      <el-table-column prop="major" label="专业" />
      <el-table-column prop="grade" label="年级" width="80" />
      <el-table-column prop="email" label="邮箱" />
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

    <!-- 添加/编辑用户对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="userForm" :rules="rules" ref="userFormRef" label-width="100px">
        <el-form-item label="学工号" prop="userNO">
          <el-input v-model="userForm.userNO" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userForm.name" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userForm.password" type="password" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role">
            <el-option label="教师" :value="UserRole.TEACHER" />
            <el-option label="学生" :value="UserRole.STUDENT" />
          </el-select>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="userForm.gender">
            <el-option label="男" :value="Gender.MALE" />
            <el-option label="女" :value="Gender.FEMALE" />
          </el-select>
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-input v-model="userForm.major" />
        </el-form-item>
        <el-form-item label="年级" prop="grade" v-if="userForm.role === UserRole.STUDENT">
          <el-input v-model.number="userForm.grade" type="number" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="userForm.phone" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="userForm.address" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
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
  try {
    await ElMessageBox.confirm('确定要删除该用户吗？', '提示', {
      type: 'warning'
    })
    // TODO: 实现删除用户的 API 调用
    ElMessage.success('删除成功')
    loadUsers()
  } catch {
    // 用户取消删除
  }
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

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
}

.actions {
  display: flex;
  gap: 10px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>