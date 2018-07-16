const {
  Environment,
  Network,
  RecordSource,
  Store,
} = require('relay-runtime')
const { isNil } = require('utils')
const base64url = require('base64url')

const store = new Store(new RecordSource())

const network = Network.create((operation, variables) => {
  const headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
  }
  const accessToken = window.sessionStorage.getItem("access_token")
  if (!isNil(accessToken)) {
    const tokenParts = accessToken.split(".")
    const decodedPayload = base64url.decode(tokenParts[0])
    const payload = JSON.parse(decodedPayload)
    if (Date(payload.Exp) < Date.now()) {
      window.sessionStorage.removeItem("access_token")
    } else {
      headers.Authorization = "Bearer "+ accessToken
    }
  }
  return fetch("http://localhost:5000/graphql", {
    method: "POST",
    headers,
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then(response => {
    return response.json()
  })
})

const environment = new Environment({
  network,
  store,
})

export default environment
