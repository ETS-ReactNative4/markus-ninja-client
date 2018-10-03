const {
  Environment,
  Network,
  RecordSource,
  Store,
} = require('relay-runtime')
const {isNil} = require('utils')

const store = new Store(new RecordSource())

const network = Network.create((operation, variables) => {
  const headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
  }
  return fetch(process.env.REACT_APP_API_URL + "/graphql", {
    method: "POST",
    headers,
    credentials: "include",
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
