import * as React from 'react'
import PropTypes from 'prop-types'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import environment from 'Environment'
import UserEnrolledContainer, {UserEnrolledProp, UserEnrolledPropDefaults} from './UserEnrolledContainer'

import { ENROLLEDS_PER_PAGE } from 'consts'

const UserEnrolledQuery = graphql`
  query UserEnrolledQuery(
    $login: String!,
    $after: String,
    $count: Int!,
    $orderBy: EnrollableOrder,
    $search: String,
    $type: EnrollableType!
  ) {
    user(login: $login) {
      ...UserEnrolledContainer_user @arguments(
        after: $after,
        count: $count,
        orderBy: $orderBy,
        search: $search,
        type: $type,
      )
    }
  }
`

class UserEnrolled extends React.Component {
  constructor(props) {
    super(props)

    const {orderBy, search, type} = this.props

    this.state = {
      orderBy,
      search,
      type,
    }
  }

  render() {
    const {orderBy, search, type} = this.state
    const {count, match} = this.props

    return (
      <QueryRenderer
        environment={environment}
        query={UserEnrolledQuery}
        variables={{
          login: match.params.login,
          count,
          orderBy,
          search,
          type,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const {children, orderBy, search, type} = this.props

            return (
              <UserEnrolledContainer
                count={count}
                orderBy={orderBy}
                search={search}
                type={type}
                user={props.user}
              >
                {children}
              </UserEnrolledContainer>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

UserEnrolled.propTypes = {
  count: PropTypes.number,
  orderBy: PropTypes.shape({
    direction: PropTypes.string,
    field: PropTypes.string,
  }),
  search: PropTypes.string,
  type: PropTypes.string.isRequired,
}

UserEnrolled.defaultProps = {
  count: ENROLLEDS_PER_PAGE,
}

export {UserEnrolledProp, UserEnrolledPropDefaults}
export default withRouter(UserEnrolled)
