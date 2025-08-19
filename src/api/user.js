import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login/',
    method: 'post',
    data
  })
}

export function user() {
  return request({
    url: '/user/me/',
    method: 'get'
  })
}

export function getUser(id) {
  return request({
    url: '/user/'+id+'/',
    method: 'get'
  })
}

export function updateProfile(data) {
  return request({
    url: '/user/update_profile/',
    method: 'post',
    data
  })
}

export function signUp(data) {
  return request({
    url: '/user/signup/',
    method: 'post',
    data
  })
}

export function getBalance() {
  return request({
    url: '/user/balance/',
    method: 'get'
  })
}

export function logOut() {
  return request({
    url: '/user/logout/',
    method: 'post'
  })
}

export function getTransations(params) {
  return request({
    url: '/transactions/',
    method: 'get',
    params
  })
}

export function postTransations(data) {
  return request({
    url: '/transactions/',
    method: 'post',
    data
  })
}

export function sendEmail(data){
  return request({
    url: '/utils/send_code/',
    method: 'post',
    data
  })
}

export function resetPassword(data){
  return request({
    url: '/user/reset_password/',
    method: 'post',
    data
  })
}

export function updateUser(id,data){
  return request({
    url: '/user/'+id+'/',
    method: 'patch',
    data
  })
}

export function getRecord(params){
  return request({
    url: '/record/',
    method: 'get',
    params
  })
}

export function getBill(params){
  return request({
    url: '/bill/',
    method: 'get',
    params
  })
}
