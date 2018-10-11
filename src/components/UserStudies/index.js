import * as React from 'react'
import PropTypes from 'prop-types'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import environment from 'Environment'
import {get} from 'utils'
import UserStudiesContainer, {UserStudiesProp, UserStudiesPropDefaults} from './UserStudiesContainer'

import { USERS_PER_PAGE } from 'consts'

const UserStudiesQuery = graphql`
  query UserStudiesQuery(
    $login: String!,
    $after: String,
    $count: Int!,
    $filterBy: StudyFilters,
    $orderBy: StudyOrder,
    $isUser: Boolean!,
    $isViewer: Boolean!,
    $withLink: Boolean!,
    $withPreview: Boolean!,
  ) {
    user(login: $login) @skip(if: $isViewer) {
      ...UserStudiesContainer_user @arguments(
        after: $after,
        count: $count,
        filterBy: $filterBy,
        orderBy: $orderBy,
        withLink: $withLink,
        withPreview: $withPreview,
      )
    }
    viewer @skip(if: $isUser) {
      ...UserStudiesContainer_user @arguments(
        after: $after,
        count: $count,
        filterBy: $filterBy,
        orderBy: $orderBy,
        withLink: $withLink,
        withPreview: $withPreview,
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
    const {count, fragment, isViewer, match} = this.props

    return (
      <QueryRenderer
        environment={environment}
        query={UserStudiesQuery}
        variables={{
          login: get(match, "params.login", ""),
          count,
          filterBy,
          orderBy,
          isUser: !isViewer,
          isViewer,
          withLink: fragment === "link",
          withPreview: fragment === "preview",
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const {children, orderBy, filterBy, isViewer} = this.props
            const user = isViewer ? props.viewer : props.user

            return (
              <UserStudiesContainer
                count={count}
                orderBy={orderBy}
                filterBy={filterBy}
                isViewer={isViewer}
                user={user}
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
  fragment: PropTypes.oneOf(["link", "preview"]),
  isViewer: PropTypes.bool,
}

UserStudies.defaultProps = {
  count: USERS_PER_PAGE,
  fragment: "preview",
  isViewer: false,
}

export {UserStudiesProp, UserStudiesPropDefaults}
export default withRouter(UserStudies)
