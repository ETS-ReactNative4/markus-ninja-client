import * as React from 'react'
import {
  createFragmentContainer,
  graphql
} from 'react-relay'
import { get } from 'utils'
import CourseMetaDetails from './CourseMetaDetails'
import CourseMetaTopics from './CourseMetaTopics'

import "./styles.css"

class CourseMeta extends React.Component {
  state = {
    detailsOpen: false,
    topicsOpen: false,
  }

  render() {
    const course = get(this.props, "course", null)
    const {detailsOpen, topicsOpen} = this.state
    return (
      <React.Fragment>
        {!topicsOpen &&
        <CourseMetaDetails onOpen={(open) => this.setState({ detailsOpen: open })} course={course} />}
        {!detailsOpen &&
        <CourseMetaTopics onOpen={(open) => this.setState({ topicsOpen: open })} course={course} />}
      </React.Fragment>
    )
  }
}

export default createFragmentContainer(CourseMeta, graphql`
  fragment CourseMeta_course on Course @argumentDefinitions(
    after: {type: "String"},
    count: {type: "Int!"},
  ) {
    ...CourseMetaDetails_course
    ...CourseMetaTopics_course @arguments(
      after: $after,
      count: $count,
    )
  }
`)
