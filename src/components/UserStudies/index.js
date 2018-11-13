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

import { STUDIES_PER_PAGE } from 'consts'

const UserStudiesQuery = graphql`
  query UserStudiesQuery(
    $login: String!,
    $after: String,
    $count: Int!,
    $filterBy: StudyFilters,
    $orderBy: StudyOrder,
    $isUser: Boolean!,
    $isViewer: Boolean!,
    $styleLink: Boolean!,
    $stylePreview: Boolean!,
  ) {
    user(login: $login) @skip(if: $isViewer) {
      ...UserStudiesContainer_user @arguments(
        after: $after,
        count: $count,
        filterBy: $filterBy,
        orderBy: $orderBy,
        styleLink: $styleLink,
        stylePreview: $stylePreview,
      )
    }
    viewer @skip(if: $isUser) {
      ...UserStudiesContainer_user @arguments(
        after: $after,
        count: $count,
        filterBy: $filterBy,
        orderBy: $orderBy,
        styleLink: $styleLink,
        stylePreview: $stylePreview,
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
          styleLink: fragment === "link",
          stylePreview: fragment === "preview",
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          }

          props = props ? props : {}
          const {children, orderBy, filterBy, isViewer} = this.props
          const user = isViewer ? props.viewer : props.user

          return (
            <UserStudiesContainer
              count={count}
              orderBy={orderBy}
              filterBy={filterBy}
              isViewer={isViewer}
              user={user ? user : null}
            >
              {children}
            </UserStudiesContainer>
          )
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
  count: STUDIES_PER_PAGE,
  fragment: "preview",
  isViewer: false,
}

export {UserStudiesProp, UserStudiesPropDefaults}
export default withRouter(UserStudies)
