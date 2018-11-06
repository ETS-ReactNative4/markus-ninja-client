import * as React from 'react'
import PropTypes from 'prop-types'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import {Link} from 'react-router-dom'
import {get, isEmpty} from 'utils'

class UserLink extends React.Component {
  get otherProps() {
    const {
      className,
      innerRef,
      relay,
      useName,
      user,
      ...otherProps
    } = this.props
    return otherProps
  }

  render() {
    const {
      className,
      innerRef,
      useName,
    } = this.props
    const user = get(this.props, "user", {})

    let text = user.login
    if (useName && !isEmpty(user.name)) {
      text = user.name
    }

    return (
      <Link
        {...this.otherProps}
        innerRef={innerRef}
        className={className}
        to={get(user, "resourcePath", "")}
      >
        {text}
      </Link>
    )
  }
}

UserLink.propTypes = {
  user: PropTypes.shape({
    login: PropTypes.string,
    name: PropTypes.string,
    resourcePath: PropTypes.string,
  }).isRequired,
}

UserLink.defaultProps = {
  user: {
    login: "",
    name: "",
    resourcePath: "",
  },
}

export default createFragmentContainer(UserLink, graphql`
  fragment UserLink_user on User {
    login
    name
    resourcePath
  }
`)
