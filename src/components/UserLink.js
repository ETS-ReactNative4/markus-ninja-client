import * as React from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import {Link} from 'react-router-dom'
import {isEmpty} from 'utils'

class UserLink extends React.Component {
  render() {
    const {
      className,
      innerRef,
      relay,
      useName,
      user = {},
      ...otherProps
    } = this.props

    let text = user.login
    if (useName && !isEmpty(user.name)) {
      text = user.name
    }

    return (
      <Link innerRef={innerRef} className={className} to={user.resourcePath} {...otherProps}>
        {text}
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
