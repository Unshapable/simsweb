<template>
  <div class="my-courses">
    <h2>我的课程</h2>
    <el-table :data="courses" border style="width: 100%">
      <el-table-column prop="courseNO" label="课程编号" width="120" />
      <el-table-column prop="courseName" label="课程名称" />
      <el-table-column prop="teacher" label="任课教师" width="120" />
      <el-table-column prop="credit" label="学分" width="80" />
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button type="danger" size="small" @click="handleDrop(row)">
            退课
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const courses = ref([])

// TODO: 实现获取我的课程列表和退课功能
</script> 