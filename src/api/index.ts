export * from './user' 

export const courseApi = {
  getCourseList: () => request.get('/courses'),
  getCourseDetail: (id: string) => request.get(`/courses/${id}`),
  createCourse: (data: any) => request.post('/courses', data),
  updateCourse: (id: string, data: any) => request.put(`/courses/${id}`, data),
  deleteCourse: (id: string) => request.delete(`/courses/${id}`)
} 