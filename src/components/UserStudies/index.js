import * as React from 'react'
import PropTypes from 'prop-types'
import {
  QueryRenderer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
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
    $styleCard: Boolean!,
    $styleLink: Boolean!,
    $styleList: Boolean!,
    $styleSelect: Boolean!,
  ) {
    user(login: $login) @skip(if: $isViewer) {
      ...UserStudiesContainer_user @arguments(
        after: $after,
        count: $count,
        filterBy: $filterBy,
        orderBy: $orderBy,
        styleCard: $styleCard,
        styleLink: $styleLink,
        styleList: $styleList,
        styleSelect: $styleSelect,
      )
    }
    viewer @skip(if: $isUser) {
      ...UserStudiesContainer_user @arguments(
        after: $after,
        count: $count,
        filterBy: $filterBy,
        orderBy: $orderBy,
        styleCard: $styleCard,
        styleLink: $styleLink,
        styleList: $styleList,
        styleSelect: $styleSelect,
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
          styleCard: fragment === "card",
          styleLink: fragment === "link",
          styleList: fragment === "list",
          styleSelect: fragment === "select",
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
  fragment: PropTypes.oneOf(["card", "link", "list", "select"]).isRequired,
  isViewer: PropTypes.bool,
}

UserStudies.defaultProps = {
  count: STUDIES_PER_PAGE,
  isViewer: false,
}

export {UserStudiesProp, UserStudiesPropDefaults}
export default withRouter(UserStudies)
