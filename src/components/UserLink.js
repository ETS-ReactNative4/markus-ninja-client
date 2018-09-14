import * as React from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import {Link} from 'react-router-dom'
import {get, isEmpty} from 'utils'

class UserLink extends React.Component {
  render() {
    const { className, innerRef, useName, ...props } = this.props
    const user = get(this.props, "user", {})

    if (useName && isEmpty(user.name)) {
      return null
    }

    return (
      <Link innerRef={innerRef} className={className} to={user.resourcePath} {...props}>
        {useName ? user.name : user.login}
      </Link>
    )
  }
}

export default createFragmentContainer(UserLink, graphql`
  fragment UserLink_user on User {
    login
    name
    resourcePath
  }
`)
