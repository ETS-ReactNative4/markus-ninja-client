import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import environment from 'Environment'
import { get } from 'utils'

const AuthLinksQuery = graphql`
  query AuthLinksQuery {
    viewer {
      id
      resourcePath
    }
  }
`

class AuthLinks extends Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={AuthLinksQuery}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const resourcePath = get(props, "viewer.resourcePath", "")
            return (
              <ul>
                <li>
                  <Link className="AuthLinks__link" to="/new">New study</Link>
                </li>
                <li>
                  <Link className="AuthLinks__link" to={resourcePath}>Your profile</Link>
                </li>
                <li>
                  <Link className="AuthLinks__link" to="/logout">Logout</Link>
                </li>
                <li>
                  <Link className="AuthLinks__link" to="/settings">Settings</Link>
                </li>
              </ul>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default withRouter(AuthLinks)
