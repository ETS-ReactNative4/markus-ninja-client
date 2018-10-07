import * as React from 'react'
import PropTypes from 'prop-types'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import environment from 'Environment'
import StudyAssetsContainer, {StudyAssetsProp, StudyAssetsPropDefaults} from './StudyAssetsContainer'

import { COURSES_PER_PAGE } from 'consts'

const StudyAssetsQuery = graphql`
  query StudyAssetsQuery(
    $owner: String!,
    $name: String!,
    $after: String,
    $count: Int!,
    $filterBy: UserAssetFilters,
    $orderBy: UserAssetOrder,
  ) {
    study(owner: $owner, name: $name) {
      ...StudyAssetsContainer_study @arguments(
        after: $after,
        count: $count,
        filterBy: $filterBy,
        orderBy: $orderBy,
      )
    }
  }
`

class StudyAssets extends React.Component {
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
        query={StudyAssetsQuery}
        variables={{
          owner: match.params.owner,
          name: match.params.name,
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
              <StudyAssetsContainer
                count={count}
                orderBy={orderBy}
                filterBy={filterBy}
                study={props.study}
              >
                {children}
              </StudyAssetsContainer>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

StudyAssets.propTypes = {
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

StudyAssets.defaultProps = {
  count: COURSES_PER_PAGE,
}

export {StudyAssetsProp, StudyAssetsPropDefaults}
export default withRouter(StudyAssets)
