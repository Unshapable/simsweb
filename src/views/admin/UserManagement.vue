<template>
  <div class="user-management">
    <h2>用户管理</h2>
    <div class="actions">
      <el-button type="primary" @click="showAddUserDialog">添加用户</el-button>
    </div>

    <el-table :data="users" border style="width: 100%">
      <el-table-column prop="userNO" label="学工号" width="120" />
      <el-table-column prop="username" label="用户名" width="120" />
      <el-table-column prop="role" label="角色" width="100" />
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
      <!-- 表单内容 -->
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const users = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('添加用户')

// TODO: 实现用户管理相关功能
</script>

<style scoped>
.actions {
  margin-bottom: 20px;
}
</style> 