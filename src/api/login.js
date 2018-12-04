import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/j_spring_security_check',
    method: 'get',
    params: {
      j_username: username,
      j_password: password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/fwUser/getCurrentFwUser',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}
