<template>
  <div class="profile-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>个人信息</span>
          <el-button type="primary" @click="handleEdit" v-if="!isEditing">
            编辑
          </el-button>
          <div v-else>
            <el-button @click="cancelEdit">取消</el-button>
            <el-button type="primary" @click="saveProfile">保存</el-button>
          </div>
        </div>
      </template>
      
      <el-form 
        :model="profileForm" 
        :rules="rules"
        ref="profileFormRef"
        label-width="100px"
        :disabled="!isEditing"
      >
        <el-form-item label="学号/工号">
          <el-input v-model="profileForm.userNO" disabled />
        </el-form-item>
        
        <el-form-item label="姓名" prop="name">
          <el-input v-model="profileForm.name" />
        </el-form-item>
        
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="profileForm.gender">
            <el-radio label="MALE">男</el-radio>
            <el-radio label="FEMALE">女</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="专业" prop="major">
          <el-input v-model="profileForm.major" />
        </el-form-item>
        
        <el-form-item label="年级" prop="grade" v-if="userStore.userInfo?.role === 'STUDENT'">
          <el-input v-model.number="profileForm.grade" />
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="profileForm.email" />
        </el-form-item>
        
        <el-form-item label="电话" prop="phone">
          <el-input v-model="profileForm.phone" />
        </el-form-item>
        
        <el-form-item label="地址" prop="address">
          <el-input v-model="profileForm.address" />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'
import { updateUser } from '../api/user'

const userStore = useUserStore()
const profileFormRef = ref(null)
const isEditing = ref(false)

const profileForm = reactive({
  userNO: '',
  name: '',
  gender: 'MALE',
  major: '',
  grade: null,
  email: '',
  phone: '',
  address: ''
})

const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  major: [{ required: true, message: '请输入专业', trigger: 'blur' }],
  email: [
    { required: false, type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { required: false, pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ]
}

// 初始化表单数据
const initForm = () => {
  const user = userStore.userInfo
  if (user) {
    Object.keys(profileForm).forEach(key => {
      if (user[key] !== undefined) {
        profileForm[key] = user[key]
      }
    })
  }
}

onMounted(() => {
  initForm()
})

const handleEdit = () => {
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
  initForm()
}

const saveProfile = async () => {
  if (!profileFormRef.value) return
  
  await profileFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const res = await updateUser(profileForm)
        if (res.data.result) {
          ElMessage.success('个人信息更新成功')
          isEditing.value = false
          // 更新store中的用户信息
          await userStore.getUserInfo()
        }
      } catch (error) {
        console.error('更新个人信息失败:', error)
      }
    }
  })
}
</script>

<style scoped>
.profile-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 