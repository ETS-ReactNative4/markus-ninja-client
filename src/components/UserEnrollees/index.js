import * as React from 'react'
import PropTypes from 'prop-types'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import environment from 'Environment'
import UserEnrolleesContainer, {UserEnrolleesProp, UserEnrolleesPropDefaults} from './UserEnrolleesContainer'

import { USERS_PER_PAGE } from 'consts'

const UserEnrolleesQuery = graphql`
  query UserEnrolleesQuery(
    $login: String!,
    $after: String,
    $count: Int!,
    $filterBy: StudyFilters,
    $orderBy: StudyOrder,
  ) {
    user(login: $login) {
      ...UserEnrolleesContainer_user @arguments(
        after: $after,
        count: $count,
        filterBy: $filterBy,
        orderBy: $orderBy,
      )
    }
  }
`

class UserEnrollees extends React.Component {
  constructor(props) {
    super(props)

    const {filterBy, orderBy} = this.props

    this.state = {
      orderBy,
      filterBy,
    }
  }

  render() {
    const {orderBy, filterBy} = this.state
    const {count, match} = this.props

    return (
      <QueryRenderer
        environment={environment}
        query={UserEnrolleesQuery}
        variables={{
          login: match.params.login,
          count,
          filterBy,
          orderBy,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const {children, orderBy, filterBy} = this.props

            return (
              <UserEnrolleesContainer
                count={count}
                orderBy={orderBy}
                filterBy={filterBy}
                user={props.user}
              >
                {children}
              </UserEnrolleesContainer>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

UserEnrollees.propTypes = {
  count: PropTypes.number,
  orderBy: PropTypes.shape({
    direction: PropTypes.string,
    field: PropTypes.string,
  }),
  filterBy: PropTypes.shape({
    topics: PropTypes.arrayOf(PropTypes.string),
    search: PropTypes.string,
  }),
}

UserEnrollees.defaultProps = {
  count: USERS_PER_PAGE,
}

export {UserEnrolleesProp, UserEnrolleesPropDefaults}
export default withRouter(UserEnrollees)
