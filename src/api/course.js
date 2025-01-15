import request from './request'

// 获取所有课程
export function getAllCourse() {
  return request({
    url: '/course/getAllCourse',
    method: 'get'
  })
}

// 搜索课程
export function searchCourse(keyword) {
  return request({
    url: '/course/searchCourse',
    method: 'get',
    params: { keyword }
  })
}

// 添加课程(管理员)
export function addCourse(data) {
  return request({
    url: '/course/addCourse',
    method: 'post',
    data
  })
}

// 获取教师的课程
export function getCoursesByTeacherNO(teacherNO) {
  return request({
    url: '/course/getCoursesByTeacherNO',
    method: 'get',
    params: { teacherNO }
  })
}

// 选课
export function selectCourse(courseNO) {
  return request({
    url: '/sc/selectCourse',
    method: 'post',
    params: { courseNO }
  })
}

// 退课
export function cancelCourse(courseNO) {
  return request({
    url: '/sc/cancelCourse',
    method: 'post',
    params: { courseNO }
  })
}

// 获取学生已选课程
export function getSelectedCoursesByStudentNO(studentNO) {
  return request({
    url: '/sc/getSelectedCoursesByStudentNO',
    method: 'get',
    params: { studentNO }
  })
}

// 获取课程的学生列表
export function getCourseStudents(courseNO) {
  return request({
    url: '/sc/getCourseStudents',
    method: 'get',
    params: { courseNO }
  })
}

// 设置成绩
export function setScore(courseNO, studentNO, score) {
  return request({
    url: '/sc/setScore',
    method: 'post',
    params: { courseNO, studentNO, score }
  })
} 