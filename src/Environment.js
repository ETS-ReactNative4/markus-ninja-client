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
      console.error(json.error_description)
      setTimeout(() => window.location.replace(""), 1000)
    }
    return json
  }).catch(error => {
    console.error(error)
  })
})

const environment = new Environment({
  network,
  store,
})

export default environment
