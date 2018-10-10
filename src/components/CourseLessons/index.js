import * as React from 'react'
import PropTypes from 'prop-types'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import environment from 'Environment'
import {get} from 'utils'
import CourseLessonsContainer, {CourseLessonsProp, CourseLessonsPropDefaults} from './CourseLessonsContainer'

import { LESSONS_PER_PAGE } from 'consts'

const CourseLessonsQuery = graphql`
  query CourseLessonsQuery(
    $owner: String!,
    $name: String!,
    $number: Int!,
    $after: String,
    $count: Int!,
    $filterBy: LessonFilters,
    $orderBy: LessonOrder,
  ) {
    study(owner: $owner, name: $name) {
      course(number: $number) {
        ...CourseLessonsContainer_course @arguments(
          after: $after,
          count: $count,
          filterBy: $filterBy,
          orderBy: $orderBy,
        )
      }
    }
  }
`

class CourseLessons extends React.Component {
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
        query={CourseLessonsQuery}
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
              <CourseLessonsContainer
                count={count}
                orderBy={orderBy}
                filterBy={filterBy}
                study={get(props, "study.course", null)}
              >
                {children}
              </CourseLessonsContainer>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

CourseLessons.propTypes = {
  count: PropTypes.number,
  orderBy: PropTypes.shape({
    direction: PropTypes.string,
    field: PropTypes.string,
  }),
  filterBy: PropTypes.shape({
    isCourseLesson: PropTypes.bool,
    labels: PropTypes.arrayOf(PropTypes.string),
    search: PropTypes.string,
  }),
}

CourseLessons.defaultProps = {
  count: LESSONS_PER_PAGE,
}

export {CourseLessonsProp, CourseLessonsPropDefaults}
export default withRouter(CourseLessons)
