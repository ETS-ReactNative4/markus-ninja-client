import React, {Component} from 'react'
import {
  QueryRenderer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
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
              <div className="mdc-menu" tabindex="-1">
                <ul className="mdc-menu__items mdc-list" role="menu" aria-hidden="true">
                  <li className="mdc-list-item" role="menuitem" tabindex="0">
                    <Link className="link" to="/notifications">Notifications</Link>
                  </li>
                  <li className="mdc-list-item" role="menuitem" tabindex="0">
                    <Link className="link" to="/new">New study</Link>
                  </li>
                  <li className="mdc-list-item" role="menuitem" tabindex="0">
                    <Link className="link" to={resourcePath}>Your profile</Link>
                  </li>
                  <li className="mdc-list-item" role="menuitem" tabindex="0">
                    <Link className="link" to="/signout">Sign out</Link>
                  </li>
                  <li className="mdc-list-item" role="menuitem" tabindex="0">
                    <Link className="link" to="/settings">Settings</Link>
                  </li>
                </ul>
              </div>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default withRouter(AuthLinks)
