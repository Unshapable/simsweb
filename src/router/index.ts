import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/home',
      redirect: '/'
    },
    {
      path: '/',
      component: Dashboard,
      children: [
        {
          path: '',  // 空路径，直接对应根路径
          name: 'Home',
          component: () => import('@/views/Home.vue'),
          meta: { requiresAuth: true }
        },
        // 所有用户都可以访问的路由
        {
          path: 'profile',
          name: 'Profile',
          component: () => import('../views/Profile.vue'),
          meta: { requiresAuth: true, title: '个人信息' }
        },
        {
          path: 'change-password',
          name: 'ChangePassword',
          component: () => import('../views/ChangePassword.vue'),
          meta: { requiresAuth: true, title: '修改密码' }
        },
        {
          path: 'courses',
          name: 'Courses',
          component: () => import('../views/Courses.vue'),
          meta: { requiresAuth: true, title: '课程列表' }
        },
        // 学生特有的路由
        {
          path: 'student/my-courses',
          name: 'MyCourses',
          component: () => import('../views/student/MyCourses.vue'),
          meta: { requiresAuth: true, role: 'STUDENT', title: '我的课程' }
        },
        // 教师特有的路由
        {
          path: 'teacher/teaching-courses',
          name: 'TeachingCourses',
          component: () => import('../views/teacher/TeachingCourses.vue'),
          meta: { requiresAuth: true, role: 'TEACHER', title: '授课管理' }
        },
        {
          path: 'teacher/course/:courseNO/students',
          name: 'CourseStudents',
          component: () => import('@/views/teacher/CourseStudents.vue'),
          meta: { requiresAuth: true, role: 'TEACHER', title: '课程学生' }
        },
        // 管理员特有的路由
        {
          path: 'admin/user-management',
          name: 'UserManagement',
          component: () => import('../views/admin/UserManagement.vue'),
          meta: { requiresAuth: true, role: 'ADMIN', title: '用户管理' }
        },
        {
          path: 'admin/course-management',
          name: 'CourseManagement',
          component: () => import('../views/admin/CourseManagement.vue'),
          meta: { requiresAuth: true, role: 'ADMIN', title: '课程管理' }
        },
        {
          path: 'admin/system-log',
          name: 'SystemLog',
          component: () => import('../views/admin/SystemLog.vue'),
          meta: { requiresAuth: true, role: 'ADMIN', title: '系统日志' }
        }
      ]
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('userRole')

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      next('/login')
    } else if (to.meta.role && to.meta.role !== userRole) {
      next('/') // 如果用户没有权限访问该路由，重定向到首页
    } else {
      next()
    }
  } else {
    if (token && to.path === '/login') {
      next('/')
    } else {
      next()
    }
  }
})

export default router 