<template>
  <div class="change-password">
    <div class="page-header">
      <h2>修改密码</h2>
    </div>

    <el-card class="password-card">
      <el-form 
        ref="formRef"
        :model="passwordForm"
        :rules="rules"
        label-width="120px"
        class="password-form"
      >
        <el-form-item label="当前密码" prop="oldPassword">
          <el-input
            v-model="passwordForm.oldPassword"
            type="password"
            placeholder="请输入当前密码"
            show-password
          />
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            placeholder="请输入新密码"
            show-password
          />
        </el-form-item>

        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password
          />
        </el-form-item>

        <div class="form-actions">
          <el-button @click="handleReset">重置</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="isSubmitting">
            <el-icon><Check /></el-icon>
            确认修改
          </el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Check } from '@element-plus/icons-vue'
import { userApi } from '@/api'
import type { FormInstance, FormRules } from 'element-plus'

const formRef = ref<FormInstance>()
const isSubmitting = ref(false)

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 验证确认密码
const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (value !== passwordForm.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules = reactive<FormRules>({
  oldPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
})

// 处理提交
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    isSubmitting.value = true
    
    const response = await userApi.changePassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    })

    if (response === true) {
      ElMessage.success('密码修改成功')
      handleReset()
    } else {
      throw new Error('密码修改失败')
    }
  } catch (error: any) {
    ElMessage.error(error.message || '密码修改失败')
  } finally {
    isSubmitting.value = false
  }
}

// 重置表单
const handleReset = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
}
</script>

<style scoped>
.change-password {
  padding: 24px;
  max-width: 600px;
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

.password-card {
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background: #fff;
}

.password-form {
  padding: 32px 40px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 40px;
}

:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #e5e7eb !important;
  transition: all 0.3s;
  border-radius: 6px;
  height: 40px;
}

:deep(.el-input__wrapper:hover),
:deep(.el-input__wrapper:focus-within) {
  box-shadow: 0 0 0 1px var(--el-color-primary) !important;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #374151;
  padding-bottom: 8px;
}

:deep(.el-button .el-icon) {
  margin-right: 4px;
}

:deep(.el-form-item) {
  margin-bottom: 24px;
}

:deep(.el-form-item:last-child) {
  margin-bottom: 0;
}
</style> 