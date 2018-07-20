import base64url from 'base64url'
import moment from 'moment'
import { isEmpty } from 'utils'

export function isAuthenticated() {
  return tokenIsValid()
}

export function tokenIsValid() {
  const accessToken = window.sessionStorage.getItem("access_token")
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

export function getAuthHeader() {
  if (tokenIsValid()) {
    const accessToken = window.sessionStorage.getItem("access_token")
    return "Bearer "+ accessToken
  }
  return null
}

export function removeAccessToken() {
  console.log("removing access_token")
  window.sessionStorage.removeItem("access_token")
}
