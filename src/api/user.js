import request from './request'

export function login(userNO, password) {
  return request({
    url: '/user/login',
    method: 'post',
    params: {
      userNO,
      password
    }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function getCurrentUser() {
  return request({
    url: '/user/getCurrentUser',
    method: 'get'
  })
}

export function updateUser(data) {
  return request({
    url: '/user/updateUser',
    method: 'post',
    data
  })
}

export function changePassword(oldPassword, newPassword) {
  return request({
    url: '/user/changePassword',
    method: 'post',
    params: {
      oldPassword,
      newPassword
    }
  })
} 