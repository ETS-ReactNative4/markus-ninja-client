import base64url from 'base64url'
import moment from 'moment'
import { isEmpty } from 'utils'

export function isAuthenticated() {
  const accessToken = window.sessionStorage.getItem("access_token")
  return !isEmpty(accessToken)
}

export function getAuthHeader() {
  const accessToken = window.sessionStorage.getItem("access_token")
  if (!isEmpty(accessToken)) {
    const tokenParts = accessToken.split(".")
    const decodedPayload = base64url.decode(tokenParts[0])
    const payload = JSON.parse(decodedPayload)
    if (moment.unix(payload.Exp).isBefore(moment())) {
      console.error("access_token expired")
      window.sessionStorage.removeItem("access_token")
    } else {
      return "Bearer "+ accessToken
    }
  }
  return ""
}

export function removeAccessToken() {
  window.sessionStorage.removeItem("access_token")
}
