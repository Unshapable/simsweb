<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <h2>学生信息管理系统</h2>
      </template>
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef">
        <el-form-item prop="userNO">
          <el-input v-model="loginForm.userNO" placeholder="请输入学号" prefix-icon="User" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" prefix-icon="Lock" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" style="width: 100%">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, inject } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import type { FormInstance } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
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
          router.push('/dashboard')
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
  background-color: #f5f5f5;
}

.login-card {
  width: 400px;
}

.login-card :deep(.el-card__header) {
  text-align: center;
}
</style>