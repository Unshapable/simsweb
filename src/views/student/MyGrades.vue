<template>
  <div class="my-grades">
    <h2>成绩查询</h2>
    <el-table :data="grades" border style="width: 100%">
      <el-table-column prop="courseNO" label="课程编号" width="120" />
      <el-table-column prop="courseName" label="课程名称" />
      <el-table-column prop="teacher" label="任课教师" width="120" />
      <el-table-column prop="credit" label="学分" width="80" />
      <el-table-column prop="grade" label="成绩" width="80" />
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const grades = ref([])

// TODO: 实现获取成绩列表功能
</script> 