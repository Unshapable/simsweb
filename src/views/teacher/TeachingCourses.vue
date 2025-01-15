<template>
  <div class="teaching-courses">
    <h2>授课管理</h2>
    <el-table :data="courses" border style="width: 100%">
      <el-table-column prop="courseNO" label="课程编号" width="120" />
      <el-table-column prop="courseName" label="课程名称" />
      <el-table-column prop="credit" label="学分" width="80" />
      <el-table-column prop="capacity" label="容量" width="80" />
      <el-table-column prop="selected" label="已选" width="80" />
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="viewStudents(row)">
            查看学生
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const courses = ref([])

// TODO: 实现获取教授课程列表和查看学生功能
</script> 