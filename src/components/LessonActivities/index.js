import * as React from 'react'
import PropTypes from 'prop-types'
import {
  QueryRenderer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { withRouter } from 'react-router'
import environment from 'Environment'
import LessonActivitiesContainer, {LessonActivitiesProp, LessonActivitiesPropDefaults} from './LessonActivitiesContainer'

import { ACTIVITIES_PER_PAGE } from 'consts'

const LessonActivitiesQuery = graphql`
  query LessonActivitiesQuery(
    $owner: String!,
    $name: String!,
    $number: Int!,
    $after: String,
    $count: Int!,
    $filterBy: ActivityFilters,
    $orderBy: ActivityOrder,
  ) {
    study(owner: $owner, name: $name) {
      lesson(number: $number) {
        ...LessonActivitiesContainer_lesson @arguments(
          after: $after,
          count: $count,
          filterBy: $filterBy,
          orderBy: $orderBy,
        )
      }
    }
  }
`

class LessonActivities extends React.Component {
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
        query={LessonActivitiesQuery}
        variables={{
          owner: match.params.owner,
          name: match.params.name,
          number: parseInt(match.params.number, 10),
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
              <LessonActivitiesContainer
                count={count}
                orderBy={orderBy}
                filterBy={filterBy}
                lesson={props.study.lesson}
              >
                {children}
              </LessonActivitiesContainer>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

LessonActivities.propTypes = {
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

LessonActivities.defaultProps = {
  count: ACTIVITIES_PER_PAGE,
}

export {LessonActivitiesProp, LessonActivitiesPropDefaults}
export default withRouter(LessonActivities)
