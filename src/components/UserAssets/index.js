import * as React from 'react'
import PropTypes from 'prop-types'
import {
  QueryRenderer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { withRouter } from 'react-router'
import environment from 'Environment'
import {get} from 'utils'
import UserAssetsContainer, {UserAssetsProp, UserAssetsPropDefaults} from './UserAssetsContainer'

import { ASSETS_PER_PAGE } from 'consts'

const UserAssetsQuery = graphql`
  query UserAssetsQuery(
    $login: String!,
    $after: String,
    $count: Int!,
    $filterBy: UserAssetFilters,
    $orderBy: UserAssetOrder,
    $isUser: Boolean!,
    $isViewer: Boolean!,
    $styleCard: Boolean!,
    $styleList: Boolean!,
    $styleSelect: Boolean!,
  ) {
    user(login: $login) @skip(if: $isViewer) {
      ...UserAssetsContainer_user @arguments(
        after: $after,
        count: $count,
        filterBy: $filterBy,
        orderBy: $orderBy,
        styleCard: $styleCard,
        styleList: $styleList,
        styleSelect: $styleSelect,
      )
    }
    viewer @skip(if: $isUser) {
      ...UserAssetsContainer_user @arguments(
        after: $after,
        count: $count,
        filterBy: $filterBy,
        orderBy: $orderBy,
        styleCard: $styleCard,
        styleList: $styleList,
        styleSelect: $styleSelect,
      )
    }
  }
`

class UserAssets extends React.Component {
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
        query={UserAssetsQuery}
        variables={{
          login: get(match, "params.login", ""),
          count,
          filterBy,
          orderBy,
          isUser: !isViewer,
          isViewer,
          styleCard: fragment === "card",
          styleList: fragment === "list",
          styleSelect: fragment === "select",
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const {children, orderBy, filterBy, isViewer} = this.props
            const user = isViewer ? props.viewer : props.user

            return (
              <UserAssetsContainer
                count={count}
                orderBy={orderBy}
                filterBy={filterBy}
                isViewer={isViewer}
                user={user}
              >
                {children}
              </UserAssetsContainer>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

UserAssets.propTypes = {
  count: PropTypes.number,
  orderBy: PropTypes.shape({
    direction: PropTypes.string,
    field: PropTypes.string,
  }),
  filterBy: PropTypes.shape({
    topics: PropTypes.arrayOf(PropTypes.string),
    search: PropTypes.string,
  }),
  fragment: PropTypes.oneOf(["card", "list", "select"]).isRequired,
  isViewer: PropTypes.bool,
}

UserAssets.defaultProps = {
  count: ASSETS_PER_PAGE,
  isViewer: false,
}

export {UserAssetsProp, UserAssetsPropDefaults}
export default withRouter(UserAssets)
