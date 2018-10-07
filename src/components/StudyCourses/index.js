import * as React from 'react'
import PropTypes from 'prop-types'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import environment from 'Environment'
import StudyCoursesContainer, {StudyCoursesProp, StudyCoursesPropDefaults} from './StudyCoursesContainer'

import { COURSES_PER_PAGE } from 'consts'

const StudyCoursesQuery = graphql`
  query StudyCoursesQuery(
    $owner: String!,
    $name: String!,
    $after: String,
    $count: Int!,
    $filterBy: CourseFilters,
    $orderBy: CourseOrder,
  ) {
    study(owner: $owner, name: $name) {
      ...StudyCoursesContainer_study @arguments(
        after: $after,
        count: $count,
        filterBy: $filterBy,
        orderBy: $orderBy,
      )
    }
  }
`

class StudyCourses extends React.Component {
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
        query={StudyCoursesQuery}
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
              <StudyCoursesContainer
                count={count}
                orderBy={orderBy}
                filterBy={filterBy}
                study={props.study}
              >
                {children}
              </StudyCoursesContainer>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

StudyCourses.propTypes = {
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

StudyCourses.defaultProps = {
  count: COURSES_PER_PAGE,
}

export {StudyCoursesProp, StudyCoursesPropDefaults}
export default withRouter(StudyCourses)
