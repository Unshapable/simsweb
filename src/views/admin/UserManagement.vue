<template>
  <div class="user-management">
    <h2>用户管理</h2>
    <div class="actions">
      <el-button type="primary" @click="showAddUserDialog">添加用户</el-button>
    </div>

    <el-table :data="users" border style="width: 100%">
      <el-table-column prop="userNO" label="学工号" width="120" />
      <el-table-column prop="name" label="用户名" width="120" />
      <el-table-column prop="role" label="角色" width="100">
        <template #default="{ row }">
          {{ row.role === 'ADMIN' ? '管理员' : row.role === 'TEACHER' ? '教师' : '学生' }}
        </template>
      </el-table-column>
      <el-table-column prop="major" label="专业" />
      <el-table-column prop="grade" label="年级" width="80" />
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
    <el-dialog v-model="dialogVisible" :title="dialogTitle">
      <el-form :model="form" label-width="100px">
        <el-form-item label="学工号">
          <el-input v-model="form.userNO" :disabled="dialogTitle === '编辑用户'" />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="密码" v-if="dialogTitle === '添加用户'">
          <el-input v-model="form.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.role">
            <el-option label="管理员" :value="UserRole.ADMIN" />
            <el-option label="教师" :value="UserRole.TEACHER" />
            <el-option label="学生" :value="UserRole.STUDENT" />
          </el-select>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="form.gender">
            <el-option label="男" :value="Gender.MALE" />
            <el-option label="女" :value="Gender.FEMALE" />
          </el-select>
        </el-form-item>
        <el-form-item label="专业">
          <el-input v-model="form.major" />
        </el-form-item>
        <el-form-item label="年级" v-if="form.role === UserRole.STUDENT">
          <el-input v-model="form.grade" type="number" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.address" />
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
import { userApi, type User, UserRole, Gender } from '@/api/user'

const users = ref<User[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('添加用户')

const form = ref<User>({
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

// 加载用户列表
const loadUsers = async () => {
  try {
    const { result } = await userApi.getAllUsers()
    users.value = result
  } catch (error) {
    console.error('获取用户列表失败:', error)
    ElMessage.error('获取用户列表失败')
  }
}

// 显示添加用户对话框
const showAddUserDialog = () => {
  dialogTitle.value = '添加用户'
  form.value = {
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

// 显示编辑用户对话框
const handleEdit = (row: User) => {
  dialogTitle.value = '编辑用户'
  form.value = { ...row }
  dialogVisible.value = true
}

// 处理删除用户
const handleDelete = async (row: User) => {
  try {
    await ElMessageBox.confirm('确定要删除该用户吗？', '提示', {
      type: 'warning'
    })
    // TODO: 调用删除用户接口
    ElMessage.success('删除成功')
    loadUsers()
  } catch (error) {
    console.error('删除用户失败:', error)
  }
}

// 提交表单
const handleSubmit = async () => {
  try {
    if (dialogTitle.value === '添加用户') {
      await userApi.register(form.value)
    } else {
      await userApi.updateUser(form.value)
    }
    ElMessage.success(dialogTitle.value === '添加用户' ? '添加成功' : '更新成功')
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
.actions {
  margin-bottom: 20px;
}
</style> 