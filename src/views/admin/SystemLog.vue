<template>
  <div class="system-log">
    <h2>系统日志</h2>
    <el-table :data="logs" border style="width: 100%">
      <el-table-column prop="timestamp" label="时间" width="180" />
      <el-table-column prop="userNO" label="用户" width="120" />
      <el-table-column prop="action" label="操作" />
      <el-table-column prop="status" label="状态" width="100" />
    </el-table>

    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const logs = ref([])
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

// TODO: 实现系统日志查询功能
</script>

<style scoped>
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 