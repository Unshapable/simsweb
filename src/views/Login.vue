<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <el-icon class="logo-icon"><School /></el-icon>
        <h2>学生信息管理系统</h2>
        <p class="subtitle">Student Infomation Management System</p>
      </div>
      
      <el-form 
        class="login-form"
        :model="loginForm" 
        :rules="rules" 
        ref="loginFormRef"
      >
        <el-form-item prop="userNO">
          <el-input 
            v-model="loginForm.userNO" 
            placeholder="请输入学工号" 
            :prefix-icon="User"
            size="large"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="请输入密码" 
            :prefix-icon="Lock"
            size="large"
            show-password 
          />
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleLogin" 
            size="large"
            class="login-button"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-footer">
        <p>© {{ new Date().getFullYear() }} Student Infomation Management System. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, inject } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import type { FormInstance } from 'element-plus'
import { User, Lock, School } from '@element-plus/icons-vue'
import { userApi } from '@/api'

const router = useRouter()
const loginFormRef = ref<FormInstance>()
const getCurrentUser = inject('getCurrentUser') as () => Promise<void>

const loginForm = reactive({
  userNO: '',
  password: ''
})

const rules = {
  userNO: [
    { required: true, message: '请输入学号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const token = await userApi.login(loginForm)
        if (token) {
          localStorage.setItem('token', token)
          await getCurrentUser()
          ElMessage.success('登录成功')
          router.push('/home')
        }
      } catch (error) {
        console.error(error)
        ElMessage.error('登录失败')
      }
    }
  })
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%);
}

.login-box {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  width: 420px;
  padding: 40px;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo-icon {
  font-size: 48px;
  color: #1890ff;
  margin-bottom: 16px;
}

.login-header h2 {
  margin: 0;
  font-size: 24px;
  color: #1f2937;
  margin-bottom: 8px;
}

.subtitle {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.login-form {
  margin-bottom: 24px;
}

:deep(.el-input__wrapper) {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  padding: 8px 12px;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.login-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
  border-radius: 6px;
}

.login-footer {
  text-align: center;
  color: #6b7280;
  font-size: 12px;
}

:deep(.el-form-item) {
  margin-bottom: 24px;
}

:deep(.el-form-item__error) {
  padding-top: 4px;
}

:deep(.el-input__prefix-inner) {
  font-size: 18px;
  color: #9ca3af;
}
</style>