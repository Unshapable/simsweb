import { request } from './request'

export * from './user'

export const courseApi = {
  getCourses: (params: { page: number; pageSize: number; courseName?: string }) => 
    request<{ list: any[]; total: number }>('/api/course/getAllCourse', { params }),
  
  getCourseDetail: (courseNO: number) => 
    request<any>(`/api/course/getCourseDetail?courseNO=${courseNO}`),
  
  addCourse: (data: { courseName: string; teacherNO: string }) => 
    request<boolean>('/api/course/addCourse', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  
  searchCourse: (keyword: string) => 
    request<any[]>(`/api/course/searchCourse?keyword=${keyword}`),
  
  getCoursesByTeacher: (teacherNO: string) => 
    request<any[]>(`/api/course/getCoursesByTeacherNO?teacherNO=${teacherNO}`),
  
  selectCourse: (courseNO: number) => 
    request<boolean>(`/api/sc/selectCourse?courseNO=${courseNO}`, { method: 'POST' }),
  
  cancelCourse: (courseNO: number) => 
    request<boolean>(`/api/sc/cancelCourse?courseNO=${courseNO}`, { method: 'POST' }),
  
  getSelectedCourses: (studentNO: string) => 
    request<any[]>(`/api/sc/getSelectedCoursesByStudentNO?studentNO=${studentNO}`),
  
  getCourseStudents: (courseNO: number) => 
    request<any[]>(`/api/sc/getCourseStudents?courseNO=${courseNO}`),
  
  setScore: (courseNO: number, studentNO: string, score: number) => 
    request<boolean>(`/api/sc/setScore?courseNO=${courseNO}&studentNO=${studentNO}&score=${score}`, {
      method: 'POST'
    }),
  
  deleteCourse: (courseNO: number) => 
    request<boolean>(`/api/course/deleteCourse?courseNO=${courseNO}`, {
      method: 'POST'
    })
} 