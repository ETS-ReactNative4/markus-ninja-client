import base64url from 'base64url'
import moment from 'moment'
import { isEmpty } from 'utils'

function isAccessTokenValid(accessToken) {
  if (!isEmpty(accessToken)) {
    const tokenParts = accessToken.split(".")
    const decodedPayload = base64url.decode(tokenParts[0])
    const payload = JSON.parse(decodedPayload)
    if (moment.unix(payload.Exp).isBefore(moment())) {
      console.error("access_token expired")
      removeAccessToken()
      return false
    } else {
      return true
    }
  }
  return false
}

function removeAccessToken() {
  window.sessionStorage.removeItem("access_token")
}

function getAccessToken() {
  return window.sessionStorage.getItem("access_token")
}

function setAccessToken(accessToken) {
  if (isAccessTokenValid(accessToken)) {
    window.sessionStorage.setItem("access_token", accessToken)
  }
}

export function login(token) {
  setAccessToken(token)
}

export function logout() {
  removeAccessToken()
}

export function getAuthHeader() {
  if (isAccessTokenValid(getAccessToken())) {
    const accessToken = window.sessionStorage.getItem("access_token")
    return "Bearer "+ accessToken
  }
  return null
}

export function getViewerId() {
  const accessToken = window.sessionStorage.getItem("access_token")
  if (!isEmpty(accessToken)) {
    const tokenParts = accessToken.split(".")
    const decodedPayload = base64url.decode(tokenParts[0])
    const payload = JSON.parse(decodedPayload)
    return payload.Sub
  }
  return null
}

export function isAuthenticated() {
  return isAccessTokenValid(getAccessToken())
}
