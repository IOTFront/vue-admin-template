import Cookies from 'js-cookie'

const TokenKey = 'Totems-Token'
const UserKey = 'Totems-user'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function setUser(token) {
  return Cookies.set(UserKey, token)
}

export function getUser(token) {
  return Cookies.get(UserKey, token)
}

export function removeUser(token) {
  return Cookies.remove(UserKey)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
