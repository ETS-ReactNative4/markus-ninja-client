import * as React from 'react'
import cls from 'classnames'
import Relay from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import hoistNonReactStatic from 'hoist-non-react-statics'
import { Link } from 'react-router-dom'
import { get } from 'utils'
import ListUserPreview from './ListUserPreview'

const FRAGMENT = graphql`
  fragment UserPreview_user on User {
    bio
    createdAt
    enrollmentStatus
    id
    isViewer
    login
    name
    resourcePath
    studies(first: 0) {
      totalCount
    }
    viewerCanEnroll
  }
`

class UserPreview extends React.Component {
  static List = Relay.createFragmentContainer(ListUserPreview, FRAGMENT)

  get classes() {
    const {className} = this.props
    return cls("UserPreview", className)
  }

  render() {
    const user = get(this.props, "user", {})
    return (
      <div className={this.classes}>
        <Link to={user.resourcePath}>
          <span>{user.login}</span>
          <span>{user.name}</span>
          <div>{user.bio}</div>
        </Link>
      </div>
    )
  }
}


export default hoistNonReactStatic(
  Relay.createFragmentContainer(UserPreview, FRAGMENT),
  UserPreview,
)
