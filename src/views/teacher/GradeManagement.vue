<template>
  <div class="grade-management">
    <h2>成绩管理</h2>
    <el-select v-model="selectedCourse" placeholder="选择课程" class="course-select">
      <el-option
        v-for="course in courses"
        :key="course.courseNO"
        :label="course.courseName"
        :value="course.courseNO"
      />
    </el-select>

    <el-table v-if="selectedCourse" :data="students" border style="width: 100%">
      <el-table-column prop="userNO" label="学号" width="120" />
      <el-table-column prop="username" label="姓名" width="120" />
      <el-table-column label="成绩" width="200">
        <template #default="{ row }">
          <el-input-number v-model="row.grade" :min="0" :max="100" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="submitGrade(row)">
            提交
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const selectedCourse = ref('')
const courses = ref([])
const students = ref([])

// TODO: 实现课程列表获取和成绩提交功能
</script>

<style scoped>
.course-select {
  margin-bottom: 20px;
  width: 300px;
}
</style> 