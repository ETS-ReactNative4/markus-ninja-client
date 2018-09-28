import base64url from 'base64url'
import moment from 'moment'
import cookies from 'browser-cookies'
import { isEmpty } from 'utils'

function decodeAccessToken(accessToken) {
  if (!isEmpty(accessToken) && typeof accessToken === 'string') {
    const tokenParts = accessToken.split(".")
    const decodedPayload = base64url.decode(tokenParts[0])
    const payload = JSON.parse(decodedPayload)
    return payload
  }
  return
}

function removeAccessToken() {
  cookies.erase("accessToken")
}

function getAccessToken() {
  return cookies.get("accessToken")
}

function isAccessTokenPayloadValid(payload) {
  if (payload && typeof payload === 'object') {
    if (moment.unix(payload.Exp).isBefore(moment())) {
      console.error("accessToken expired")
      removeAccessToken()
      return false
    } else {
      return true
    }
  }
  return false
}

function setAccessToken(accessToken) {
  const payload = decodeAccessToken(accessToken)
  if (payload) {
    if (moment.unix(payload.Exp).isBefore(moment())) {
      console.error("accessToken expired")
      return
    }
    return cookies.set(
      "accessToken",
      accessToken,
      {
        expires: moment.unix(payload.Exp).toDate(),
        // secure: true,
        // httponly: true,
      },
    )
  }
  return
}

export function login(token) {
  setAccessToken(token)
}

export function logout() {
  removeAccessToken()
}

export function getAuthHeader() {
  const accessToken = getAccessToken()
  const payload = decodeAccessToken(accessToken)
  if (isAccessTokenPayloadValid(payload)) {
    return "Bearer " + accessToken
  }
  return
}

export function getViewerId() {
  const accessToken = getAccessToken()
  const payload = decodeAccessToken(accessToken)
  if (payload) {
    return payload.Sub
  }
  return
}

export function isAuthenticated() {
  const accessToken = getAccessToken()
  const payload = decodeAccessToken(accessToken)
  return isAccessTokenPayloadValid(payload)
}
