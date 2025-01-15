import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: { requiresAuth: true },
      children: [
        // 所有用户都可以访问的路由
        {
          path: 'profile',
          name: 'Profile',
          component: () => import('../views/Profile.vue'),
          meta: { title: '个人信息' }
        },
        {
          path: 'change-password',
          name: 'ChangePassword',
          component: () => import('../views/ChangePassword.vue'),
          meta: { title: '修改密码' }
        },
        {
          path: 'courses',
          name: 'Courses',
          component: () => import('../views/Courses.vue'),
          meta: { title: '课程列表' }
        },
        // 学生特有的路由
        {
          path: 'my-courses',
          name: 'MyCourses',
          component: () => import('../views/student/MyCourses.vue'),
          meta: { role: 'student', title: '我的课程' }
        },
        {
          path: 'my-grades',
          name: 'MyGrades',
          component: () => import('../views/student/MyGrades.vue'),
          meta: { role: 'student', title: '成绩查询' }
        },
        // 教师特有的路由
        {
          path: 'teaching-courses',
          name: 'TeachingCourses',
          component: () => import('../views/teacher/TeachingCourses.vue'),
          meta: { role: 'teacher', title: '授课管理' }
        },
        {
          path: 'grade-management',
          name: 'GradeManagement',
          component: () => import('../views/teacher/GradeManagement.vue'),
          meta: { role: 'teacher', title: '成绩管理' }
        },
        // 管理员特有的路由
        {
          path: 'user-management',
          name: 'UserManagement',
          component: () => import('../views/admin/UserManagement.vue'),
          meta: { role: 'admin', title: '用户管理' }
        },
        {
          path: 'course-management',
          name: 'CourseManagement',
          component: () => import('../views/admin/CourseManagement.vue'),
          meta: { role: 'admin', title: '课程管理' }
        },
        {
          path: 'system-log',
          name: 'SystemLog',
          component: () => import('../views/admin/SystemLog.vue'),
          meta: { role: 'admin', title: '系统日志' }
        }
      ]
    },
    {
      path: '/',
      redirect: '/login'
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('userRole') // 需要在登录时存储用户角色

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      next('/login')
    } else if (to.meta.role && to.meta.role !== userRole) {
      next('/dashboard') // 如果用户没有权限访问该路由，重定向到首页
    } else {
      next()
    }
  } else {
    if (token && to.path === '/login') {
      next('/dashboard')
    } else {
      next()
    }
  }
})

export default router 