<template>
  <div class="system-log">
    <div class="page-header">
      <h2>系统日志</h2>
    </div>

    <!-- 顶部统计卡片 -->
    <el-row :gutter="20" class="statistics-cards">
      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>总调用次数</span>
            </div>
          </template>
          <div class="card-content">
            {{ totalCalls }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>成功率</span>
            </div>
          </template>
          <div class="card-content">
            {{ successRate }}%
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>平均响应时间</span>
            </div>
          </template>
          <div class="card-content">
            {{ avgResponseTime }}ms
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- API详细信息 -->
    <el-card class="api-details">
      <template #header>
        <div class="card-header">
          <span>API详细信息</span>
        </div>
      </template>
      <el-table :data="apiDetails" border style="width: 100%">
        <el-table-column prop="api" label="API接口" min-width="200" />
        <el-table-column prop="calls" label="调用次数" width="100" align="center" />
        <el-table-column label="成功次数" width="100" align="center">
          <template #default="{ row }">
            {{ row.success || 0 }}
          </template>
        </el-table-column>
        <el-table-column label="失败次数" width="100" align="center">
          <template #default="{ row }">
            {{ row.failure || 0 }}
          </template>
        </el-table-column>
        <el-table-column label="成功率" width="100" align="center">
          <template #default="{ row }">
            {{ calculateSuccessRate(row) }}%
          </template>
        </el-table-column>
        <el-table-column label="平均响应时间" width="120" align="center">
          <template #default="{ row }">
            {{ (row.time / row.calls).toFixed(2) }}ms
          </template>
        </el-table-column>
        <el-table-column label="总响应时间" width="120" align="center">
          <template #default="{ row }">
            {{ row.time }}ms
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 24小时调用趋势图 -->
    <el-card class="chart-card">
      <template #header>
        <div class="card-header">
          <span>24小时调用趋势</span>
        </div>
      </template>
      <div class="chart-container">
        <div ref="hourlyChart" style="width: 100%; height: 400px"></div>
      </div>
    </el-card>

    <!-- 热门API排行（Top 3） -->
    <el-card class="top-apis">
      <template #header>
        <div class="card-header">
          <span>热门API排行（Top 3）</span>
        </div>
      </template>
      <el-row :gutter="20" class="top-api-cards">
        <el-col :span="8" v-for="(api, index) in topApis" :key="api.api">
          <el-card :class="['top-api-card', `rank-${index + 1}`]">
            <div class="rank-number">#{{ index + 1 }}</div>
            <h3 class="api-name">{{ api.api }}</h3>
            <div class="api-stats">
              <div class="stat-item">
                <div class="stat-label">调用次数</div>
                <div class="stat-value">{{ api.calls }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">成功率</div>
                <div class="stat-value">{{ ((api.success || 0) / api.calls * 100).toFixed(2) }}%</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">平均响应时间</div>
                <div class="stat-value">{{ (api.time / api.calls).toFixed(2) }}ms</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { statisticsApi } from '@/api'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const hourlyChart = ref<HTMLElement>()
const totalCalls = ref(0)
const successRate = ref(0)
const avgResponseTime = ref(0)
const apiDetails = ref<any[]>([])
const topApis = ref<any[]>([])

// 计算单个API的成功率
const calculateSuccessRate = (api: any) => {
  const totalResults = (api.success || 0) + (api.failure || 0)
  if (totalResults === 0) return '100.00'
  return ((api.success || 0) / totalResults * 100).toFixed(2)
}

// 加载所有统计数据
const loadAllStatistics = async () => {
  try {
    const response = await statisticsApi.getAllStatistics()
    console.log('All statistics:', response)
    
    let total = 0
    let success = 0
    let failure = 0
    let totalTime = 0

    // 转换数据为表格格式
    apiDetails.value = Object.entries(response).map(([api, stat]) => {
      total += stat.calls
      success += stat.success || 0
      failure += stat.failure || 0
      totalTime += stat.time
      return {
        api,
        ...stat
      }
    }).sort((a, b) => b.calls - a.calls)

    totalCalls.value = total
    const totalWithResult = success + failure
    successRate.value = totalWithResult > 0 
      ? Number(((success / totalWithResult) * 100).toFixed(2))
      : 100
    avgResponseTime.value = Number((totalTime / total).toFixed(2))
  } catch (error) {
    console.error('获取统计数据失败:', error)
    ElMessage.error(error instanceof Error ? error.message : '获取统计数据失败')
  }
}

// 加载24小时统计数据并绘制图表
const loadHourlyStatistics = async () => {
  try {
    const response = await statisticsApi.getLast24HourStatistics()
    console.log('Hourly statistics:', response)
    
    if (!response || Object.keys(response).length === 0) {
      console.warn('No hourly statistics data')
      return
    }

    // 按时间排序
    const hours = Object.keys(response).sort()
    const calls = hours.map(hour => response[hour].totalCalls)
    const avgTimes = hours.map(hour => response[hour].avgTime)

    // 格式化时间显示
    const formattedHours = hours.map(hour => {
      const [date, time] = hour.split(':')
      return `${time}:00`
    })

    if (!hourlyChart.value) return

    const chart = echarts.init(hourlyChart.value)
    chart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: ['调用次数', '平均响应时间']
      },
      xAxis: {
        type: 'category',
        data: formattedHours,
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: [
        {
          type: 'value',
          name: '调用次数',
          position: 'left'
        },
        {
          type: 'value',
          name: '响应时间(ms)',
          position: 'right'
        }
      ],
      series: [
        {
          name: '调用次数',
          type: 'bar',
          data: calls
        },
        {
          name: '平均响应时间',
          type: 'line',
          yAxisIndex: 1,
          data: avgTimes
        }
      ]
    })

    // 处理窗口大小变化
    const handleResize = () => chart.resize()
    window.addEventListener('resize', handleResize)
    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
      chart.dispose()
    })
  } catch (error) {
    console.error('获取24小时统计数据失败:', error)
    ElMessage.error(error instanceof Error ? error.message : '获取24小时统计数据失败')
  }
}

// 添加加载热门API的函数
const loadTopApis = async () => {
  try {
    const response = await statisticsApi.getTopApis()
    console.log('Top APIs:', response)
    topApis.value = response
  } catch (error) {
    console.error('获取热门API失败:', error)
    ElMessage.error(error instanceof Error ? error.message : '获取热门API失败')
  }
}

onMounted(async () => {
  await Promise.all([
    loadAllStatistics(),
    loadHourlyStatistics(),
    loadTopApis()
  ])
})
</script>

<style scoped>
.system-log {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
  color: #1f2937;
  font-weight: 500;
}

.statistics-cards {
  margin-bottom: 20px;
}

.api-details {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-content {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  color: #409EFF;
}

.chart-card {
  margin-bottom: 20px;
}

.chart-container {
  padding: 20px;
}

.top-apis {
  margin-bottom: 20px;
}

.top-api-cards {
  padding: 10px;
}

.top-api-card {
  position: relative;
  transition: transform 0.3s;
  height: 220px;
  display: flex;
  flex-direction: column;
}

.top-api-card :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 15px;
}

.top-api-card:hover {
  transform: translateY(-5px);
}

.rank-number {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  font-weight: bold;
  opacity: 0.2;
}

.rank-1 {
  background: linear-gradient(135deg, #fdf8e5 0%, #fff 100%);
}

.rank-2 {
  background: linear-gradient(135deg, #f5f7fa 0%, #fff 100%);
}

.rank-3 {
  background: linear-gradient(135deg, #fff3e5 0%, #fff 100%);
}

.api-name {
  margin: 10px 0;
  font-size: 16px;
  color: #303133;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 44px;
}

.api-stats {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  gap: 8px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px dashed #eee;
}

.stat-label {
  color: #909399;
  font-size: 14px;
}

.stat-value {
  color: #409EFF;
  font-weight: bold;
}

.stat-item:last-child {
  border-bottom: none;
}
</style> 