<template>
  <div class="profile">
    <h2>个人信息</h2>
    <el-form :model="userInfo" label-width="100px">
      <el-form-item label="学工号">
        <el-input v-model="userInfo.userNO" disabled />
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="userInfo.name" />
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="userInfo.gender">
          <el-option label="男" :value="Gender.MALE" />
          <el-option label="女" :value="Gender.FEMALE" />
        </el-select>
      </el-form-item>
      <el-form-item label="专业">
        <el-input v-model="userInfo.major" />
      </el-form-item>
      <el-form-item label="年级" v-if="userInfo.grade !== undefined">
        <el-input v-model="userInfo.grade" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="userInfo.email" />
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="userInfo.phone" />
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="userInfo.address" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleUpdate">保存修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { userApi, type User, Gender } from '@/api/user'

const userInfo = ref<User>({
  userNO: '',
  name: '',
  password: '',
  role: 'STUDENT',
  gender: Gender.MALE,
  major: '',
  grade: undefined,
  email: '',
  phone: '',
  address: ''
})

onMounted(async () => {
  try {
    const info = await userApi.getCurrentUser()
    userInfo.value = info
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
})

const handleUpdate = async () => {
  try {
    await userApi.updateUserInfo(userInfo.value)
    ElMessage.success('更新成功')
  } catch (error) {
    console.error('更新失败:', error)
  }
}
</script>

<style scoped>
.profile {
  max-width: 600px;
  margin: 0 auto;
}
</style> 