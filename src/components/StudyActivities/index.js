import * as React from 'react'
import PropTypes from 'prop-types'
import {
  QueryRenderer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { withRouter } from 'react-router'
import environment from 'Environment'
import StudyActivitiesContainer, {StudyActivitiesProp, StudyActivitiesPropDefaults} from './StudyActivitiesContainer'

import { ACTIVITIES_PER_PAGE } from 'consts'

const StudyActivitiesQuery = graphql`
  query StudyActivitiesQuery(
    $owner: String!,
    $name: String!,
    $after: String,
    $count: Int!,
    $filterBy: ActivityFilters,
    $orderBy: ActivityOrder,
  ) {
    study(owner: $owner, name: $name) {
      ...StudyActivitiesContainer_study @arguments(
        after: $after,
        count: $count,
        filterBy: $filterBy,
        orderBy: $orderBy,
      )
    }
  }
`

class StudyActivities extends React.Component {
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
        query={StudyActivitiesQuery}
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
              <StudyActivitiesContainer
                count={count}
                orderBy={orderBy}
                filterBy={filterBy}
                study={props.study}
              >
                {children}
              </StudyActivitiesContainer>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

StudyActivities.propTypes = {
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

StudyActivities.defaultProps = {
  count: ACTIVITIES_PER_PAGE,
}

export {StudyActivitiesProp, StudyActivitiesPropDefaults}
export default withRouter(StudyActivities)
