const {
  Environment,
  Network,
  RecordSource,
  Store,
} = require('relay-runtime')
const { isEmpty, isNil } = require('utils')
const { getAuthHeader } = require('auth')

const store = new Store(new RecordSource())

const network = Network.create((operation, variables) => {
  const headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
  }
  const accessToken = getAuthHeader()
  if (!isEmpty(accessToken)) {
    headers.Authorization = accessToken
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
  }).then(json => {
    if (!isNil(json.error)) {
      if (json.error === 'unauthorized') {
        console.error("unauthorized user")
        window.sessionStorage.removeItem("access_token")
      }
    }
    return json
  })
})

const environment = new Environment({
  network,
  store,
})

export default environment
