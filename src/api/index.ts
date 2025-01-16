import { request } from './request'

export * from './user'

export interface Course {
  courseNO: number
  courseName: string
  teacherNO: string
  teacherName?: string
  credit: number
  selected?: number
  capacity?: number
}

export interface ApiResponse<T> {
  code: string
  msg: string | null
  result: T
}

export const courseApi = {
  // 获取所有课程
  getAllCourse: () =>
    request<Course[]>('/api/course/getAllCourse', {
      headers: {
        'token': localStorage.getItem('token') || ''
      }
    }),

  // 添加课程
  addCourse: (data: { courseName: string; teacherNO: string }) =>
    request<boolean>('/api/course/addCourse', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('token') || ''
      }
    }),

  // 搜索课程
  searchCourse: (keyword: string) =>
    request<Course[]>('/api/course/searchCourse', {
      params: { keyword },
      headers: {
        'token': localStorage.getItem('token') || ''
      }
    }),

  // 获取教师的课程
  getCoursesByTeacherNO: (teacherNO: string) =>
    request<Course[]>('/api/course/getCoursesByTeacherNO', {
      params: { teacherNO },
      headers: {
        'token': localStorage.getItem('token') || ''
      }
    }),

  // 选课
  selectCourse: (courseNO: number) =>
    request<boolean>('/api/sc/selectCourse', {
      method: 'POST',
      params: { courseNO },
      headers: {
        'token': localStorage.getItem('token') || ''
      }
    }),

  // 退课
  cancelCourse: (courseNO: number) =>
    request<boolean>('/api/sc/cancelCourse', {
      method: 'POST',
      params: { courseNO },
      headers: {
        'token': localStorage.getItem('token') || ''
      }
    }),

  // 获取学生选课列表
  getSelectedCoursesByStudentNO: (studentNO: string) =>
    request<ApiResponse<{ courseNO: number; courseName: string; teacherName: string; score: number | null }[]>>(
      '/api/sc/getSelectedCoursesByStudentNO',
      {
        params: { studentNO },
        headers: {
          'token': localStorage.getItem('token') || ''
        }
      }
    ),

  // 获取课程的学生列表
  getCourseStudents: (courseNO: number) =>
    request<{ userNO: string; username: string; grade: number | null }[]>(
      '/api/sc/getCourseStudents',
      {
        params: { courseNO },
        headers: {
          'token': localStorage.getItem('token') || ''
        }
      }
    ),

  // 设置成绩
  setScore: (courseNO: number, studentNO: string, score: number) =>
    request<boolean>('/api/sc/setScore', {
      method: 'POST',
      params: { courseNO, studentNO, score },
      headers: {
        'token': localStorage.getItem('token') || ''
      }
    })
}

// 统计信息接口类型
interface ApiStatistic {
  calls: number
  success?: number
  failure?: number
  time: number
}

interface AllStatistics {
  [key: string]: ApiStatistic
}

interface HourlyStatistic {
  totalCalls: number
  apis: {
    [key: string]: {
      calls: number
      time: number
    }
  }
  avgTime: number
}

interface HourlyStatistics {
  [hour: string]: HourlyStatistic
}

interface TopApi extends ApiStatistic {
  api: string
}

export const statisticsApi = {
  // 获取所有统计信息
  getAllStatistics: () =>
    request<AllStatistics>('/api/statistics/all', {
      headers: {
        'token': localStorage.getItem('token') || ''
      }
    }),

  // 获取最近24小时统计
  getLast24HourStatistics: () =>
    request<HourlyStatistics>('/api/statistics/last24hours', {
      headers: {
        'token': localStorage.getItem('token') || ''
      }
    }),

  // 获取调用次数最多的API
  getTopApis: () =>
    request<TopApi[]>('/api/statistics/top', {
      headers: {
        'token': localStorage.getItem('token') || ''
      }
    })
} 