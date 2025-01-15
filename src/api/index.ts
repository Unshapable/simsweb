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

export const courseApi = {
  // 获取所有课程
  getAllCourse: (params: { page: number; pageSize: number; courseName?: string }) => 
    request<{ list: Course[]; total: number }>('/api/course/getAllCourse', { params }),
  
  // 添加课程
  addCourse: (data: { courseName: string; teacherNO: string }) => 
    request<boolean>('/api/course/addCourse', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  
  // 搜索课程
  searchCourse: (keyword: string) => 
    request<Course[]>('/api/course/searchCourse', {
      params: { keyword }
    }),
  
  // 获取教师的课程
  getCoursesByTeacherNO: (teacherNO: string) => 
    request<Course[]>('/api/course/getCoursesByTeacherNO', {
      params: { teacherNO }
    }),
  
  // 选课
  selectCourse: (courseNO: number) => 
    request<boolean>('/api/sc/selectCourse', {
      method: 'POST',
      params: { courseNO }
    }),
  
  // 退课
  cancelCourse: (courseNO: number) => 
    request<boolean>('/api/sc/cancelCourse', {
      method: 'POST',
      params: { courseNO }
    }),
  
  // 获取学生选课列表
  getSelectedCoursesByStudentNO: (studentNO: string) => 
    request<Course[]>('/api/sc/getSelectedCoursesByStudentNO', {
      params: { studentNO }
    }),
  
  // 获取课程的学生列表
  getCourseStudents: (courseNO: number) => 
    request<{ userNO: string; username: string; grade: number | null }[]>(
      '/api/sc/getCourseStudents',
      { params: { courseNO } }
    ),
  
  // 设置成绩
  setScore: (courseNO: number, studentNO: string, score: number) => 
    request<boolean>('/api/sc/setScore', {
      method: 'POST',
      params: { courseNO, studentNO, score }
    })
} 