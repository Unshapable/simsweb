<template>
  <div class="profile-page">
    <div class="page-header">
      <h2>个人信息</h2>
    </div>

    <el-card class="profile-card">
      <div class="profile-header">
        <div class="avatar-section">
          <el-avatar :size="80" :icon="UserFilled" class="user-avatar" />
          <div class="user-info">
            <h3>{{ currentUser?.name || '未知用户' }}</h3>
            <el-tag :type="roleTagType" effect="light" class="role-tag">
              {{ roleLabels[currentUser?.role as UserRole] || '未知角色' }}
            </el-tag>
          </div>
        </div>
        <el-button type="primary" @click="handleEdit" v-if="!isEditing">
          <el-icon><Edit /></el-icon>
          编辑信息
        </el-button>
      </div>

      <el-divider />

      <div class="profile-content">
        <el-form 
          ref="formRef"
          :model="userForm" 
          :rules="rules"
          label-width="100px"
          :disabled="!isEditing"
          class="profile-form"
          :class="{ 'is-viewing': !isEditing }"
        >
          <el-row :gutter="32">
            <el-col :span="12">
              <el-form-item label="学工号" prop="userNO">
                <el-input v-model="userForm.userNO" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="userForm.name" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性别" prop="gender">
                <el-select v-model="userForm.gender" class="w-full">
                  <el-option label="男" :value="Gender.MALE" />
                  <el-option label="女" :value="Gender.FEMALE" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="专业" prop="major">
                <el-input v-model="userForm.major" />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="currentUser?.role === UserRole.STUDENT">
              <el-form-item label="年级" prop="grade">
                <el-input-number 
                  v-model="userForm.grade" 
                  :min="2000" 
                  :max="currentYear"
                  :step="1"
                  :controls="false"
                  placeholder="请输入年级"
                  class="w-full" 
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="userForm.email" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="电话" prop="phone">
                <el-input v-model="userForm.phone" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="地址" prop="address">
                <el-input v-model="userForm.address" />
              </el-form-item>
            </el-col>
          </el-row>

          <div class="form-actions" v-if="isEditing">
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="handleSubmit">
              <el-icon><Check /></el-icon>
              保存修改
            </el-button>
          </div>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { UserFilled, Edit, Check } from '@element-plus/icons-vue'
import { userApi, type User } from '@/api/user'
import { UserRole, Gender } from '@/api/user'
import type { FormInstance, FormRules } from 'element-plus'

const formRef = ref<FormInstance>()
const currentUser = ref<User | null>(null)
const isEditing = ref(false)

// 角色标签映射
const roleLabels = {
  [UserRole.ADMIN]: '管理员',
  [UserRole.TEACHER]: '教师',
  [UserRole.STUDENT]: '学生'
}

// 角色标签类型
const roleTagType = computed(() => {
  switch (currentUser.value?.role) {
    case UserRole.ADMIN:
      return 'danger'
    case UserRole.TEACHER:
      return 'warning'
    case UserRole.STUDENT:
      return 'success'
    default:
      return 'info'
  }
})

// 获取当前年份
const currentYear = new Date().getFullYear()

// 表单数据
const userForm = reactive<Partial<User>>({
  userNO: '',
  name: '',
  gender: Gender.MALE,
  major: '',
  grade: currentYear, // 默认为当前年份
  email: '',
  phone: '',
  address: '',
  role: UserRole.STUDENT,
  password: ''
})

// 表单验证规则
const rules = reactive<FormRules>({
  userNO: [{ required: true, message: '学工号不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  major: [{ required: true, message: '请输入专业', trigger: 'blur' }],
  // 可选字段的格式验证
  email: [
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  grade: [
    { 
      required: true, 
      message: '请输入年级', 
      trigger: 'blur' 
    },
    {
      validator: (rule, value, callback) => {
        if (value && (value < 2000 || value > currentYear)) {
          callback(new Error(`入学年份必须在 2000-${currentYear} 之间`))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

// 加载用户信息
const loadUserInfo = async () => {
  try {
    const user = await userApi.getCurrentUser()
    currentUser.value = user
    Object.assign(userForm, {
      ...user,
      password: user.password || '',
      role: user.role,
      major: user.major || '', // 确保专业字段有值
      gender: user.gender || Gender.MALE // 确保性别字段有值
    })
  } catch (error) {
    console.error('获取用户信息失败:', error)
    ElMessage.error('获取用户信息失败')
  }
}

// 处理编辑
const handleEdit = () => {
  isEditing.value = true
}

// 处理取消
const handleCancel = () => {
  isEditing.value = false
  Object.assign(userForm, currentUser.value)
}

// 处理提交
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    // 确保必填字段都有值
    const updatedUser: User = {
      userNO: userForm.userNO || currentUser.value?.userNO || '',
      name: userForm.name || '',
      password: currentUser.value?.password || '', // 保持原密码
      role: currentUser.value?.role || UserRole.STUDENT, // 保持原角色
      gender: userForm.gender || Gender.MALE,
      major: userForm.major || '',
      // 可选字段
      grade: userForm.grade || null,
      email: userForm.email || '',
      phone: userForm.phone || '',
      address: userForm.address || ''
    }

    console.log('更新用户信息:', updatedUser)

    // 发送更新请求
    const response = await userApi.updateUser(updatedUser)
    console.log('更新响应:', response)

    if (response === true) {
      ElMessage.success('保存成功')
      isEditing.value = false
      await loadUserInfo()
    } else {
      throw new Error('更新失败')
    }
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败，请确保填写了所有必填信息')
  }
}

onMounted(() => {
  loadUserInfo()
})
</script>

<style scoped>
.profile-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
  color: #1f2937;
  font-weight: 500;
}

.profile-card {
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 20px;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-avatar {
  background-color: var(--el-color-primary);
  font-size: 32px;
}

.user-info h3 {
  margin: 0 0 8px;
  font-size: 20px;
  color: #1f2937;
}

.role-tag {
  font-size: 13px;
  padding: 4px 12px;
}

.profile-content {
  padding: 32px 0 0;
}

.profile-form {
  max-width: 100%;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--el-border-color-light);
}

.profile-form.is-viewing {
  :deep(.el-input__wrapper),
  :deep(.el-select .el-input__wrapper),
  :deep(.el-input-number .el-input__wrapper) {
    background-color: #fff !important;
    box-shadow: 0 0 0 1px #e5e7eb !important;
    cursor: default !important;
    padding: 0 12px;
    border-radius: 6px;
    height: 40px;
  }

  :deep(.el-select.is-disabled) {
    .el-input__wrapper,
    .el-input__inner,
    .el-input {
      background-color: #fff !important;
      -webkit-text-fill-color: #1f2937 !important;
      color: #1f2937 !important;
      cursor: default !important;
    }
  }

  :deep(.el-select__caret),
  :deep(.el-input-number__decrease),
  :deep(.el-input-number__increase) {
    display: none !important;
  }

  :deep(.el-input.is-disabled),
  :deep(.el-select.is-disabled),
  :deep(.el-input-number.is-disabled),
  :deep(.el-input.is-disabled *),
  :deep(.el-select.is-disabled *),
  :deep(.el-input-number.is-disabled *) {
    background-color: #fff !important;
    cursor: default !important;
  }
}

:deep(.el-input__wrapper),
:deep(.el-select .el-input__wrapper),
:deep(.el-input-number .el-input__wrapper) {
  box-shadow: 0 0 0 1px #e5e7eb !important;
  transition: all 0.3s;
  border-radius: 6px;
  height: 40px;
  background-color: #fff;
}

:deep(.el-input__wrapper:hover),
:deep(.el-select:hover .el-input__wrapper),
:deep(.el-input-number:hover .el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--el-color-primary) !important;
}

:deep(.el-input__wrapper:focus-within),
:deep(.el-select.is-focus .el-input__wrapper),
:deep(.el-input-number:focus-within .el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--el-color-primary) !important;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #374151;
  padding-bottom: 8px;
}

:deep(.el-select),
:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-divider) {
  margin: 0;
}

:deep(.el-tag--success) {
  background-color: #ecfdf5;
  border-color: #d1fae5;
  color: #059669;
}

:deep(.el-tag--warning) {
  background-color: #fffbeb;
  border-color: #fef3c7;
  color: #d97706;
}

:deep(.el-tag--danger) {
  background-color: #fef2f2;
  border-color: #fee2e2;
  color: #dc2626;
}

:deep(.el-button .el-icon) {
  margin-right: 4px;
}

/* 调整年级输入框样式 */
:deep(.el-input-number.is-without-controls .el-input__wrapper) {
  padding: 0 12px;
}

:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
</style> 