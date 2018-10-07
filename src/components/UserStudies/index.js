import * as React from 'react'
import PropTypes from 'prop-types'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import environment from 'Environment'
import UserStudiesContainer, {UserStudiesProp, UserStudiesPropDefaults} from './UserStudiesContainer'

import { USERS_PER_PAGE } from 'consts'

const UserStudiesQuery = graphql`
  query UserStudiesQuery(
    $login: String!,
    $after: String,
    $count: Int!,
    $filterBy: StudyFilters,
    $orderBy: StudyOrder,
  ) {
    user(login: $login) {
      ...UserStudiesContainer_user @arguments(
        after: $after,
        count: $count,
        filterBy: $filterBy,
        orderBy: $orderBy,
      )
    }
  }
`

class UserStudies extends React.Component {
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
        query={UserStudiesQuery}
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
              <UserStudiesContainer
                count={count}
                orderBy={orderBy}
                filterBy={filterBy}
                user={props.user}
              >
                {children}
              </UserStudiesContainer>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

UserStudies.propTypes = {
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

UserStudies.defaultProps = {
  count: USERS_PER_PAGE,
}

export {UserStudiesProp, UserStudiesPropDefaults}
export default withRouter(UserStudies)
