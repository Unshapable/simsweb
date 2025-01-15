<template>
  <div class="course-management">
    <h2>课程管理</h2>
    <div class="actions">
      <el-button type="primary" @click="showAddCourseDialog">添加课程</el-button>
    </div>

    <el-table :data="courses" border style="width: 100%">
      <el-table-column prop="courseNO" label="课程编号" width="120" />
      <el-table-column prop="courseName" label="课程名称" />
      <el-table-column prop="teacher" label="任课教师" width="120" />
      <el-table-column prop="credit" label="学分" width="80" />
      <el-table-column prop="capacity" label="容量" width="80" />
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

    <!-- 添加/编辑课程对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle">
      <!-- 表单内容 -->
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const courses = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('添加课程')

// TODO: 实现课程管理相关功能
</script>

<style scoped>
.actions {
  margin-bottom: 20px;
}
</style> 