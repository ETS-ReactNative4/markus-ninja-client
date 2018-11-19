import * as React from 'react'
import PropTypes from 'prop-types'
import {
  QueryRenderer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { withRouter } from 'react-router'
import environment from 'Environment'
import StudyLessonsContainer, {StudyLessonsProp, StudyLessonsPropDefaults} from './StudyLessonsContainer'

import { LESSONS_PER_PAGE } from 'consts'

const StudyLessonsQuery = graphql`
  query StudyLessonsQuery(
    $owner: String!,
    $name: String!,
    $after: String,
    $count: Int!,
    $filterBy: LessonFilters,
    $orderBy: LessonOrder,
    $styleCard: Boolean!,
    $styleList: Boolean!,
    $styleSelect: Boolean!,
  ) {
    study(owner: $owner, name: $name) {
      ...StudyLessonsContainer_study @arguments(
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

class StudyLessons extends React.Component {
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
    const {count, fragment, match} = this.props

    return (
      <QueryRenderer
        environment={environment}
        query={StudyLessonsQuery}
        variables={{
          owner: match.params.owner,
          name: match.params.name,
          count,
          filterBy,
          orderBy,
          styleCard: fragment === "card",
          styleList: fragment === "list",
          styleSelect: fragment === "select",
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const {children, orderBy, filterBy} = this.props

            return (
              <StudyLessonsContainer
                count={count}
                orderBy={orderBy}
                filterBy={filterBy}
                study={props.study}
              >
                {children}
              </StudyLessonsContainer>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

StudyLessons.propTypes = {
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
  fragment: PropTypes.oneOf(["card", "list", "select"]).isRequired,
}

StudyLessons.defaultProps = {
  count: LESSONS_PER_PAGE,
}

export {StudyLessonsProp, StudyLessonsPropDefaults}
export default withRouter(StudyLessons)
