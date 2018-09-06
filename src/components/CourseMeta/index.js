import React, {Component} from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql
} from 'react-relay'
import { get } from 'utils'
import CourseMetaDetails from './CourseMetaDetails'
import CourseMetaTopics from './CourseMetaTopics'

import "./styles.css"

class CourseMeta extends Component {
  state = {
    detailsOpen: false,
    topicsOpen: false,
  }

  get classes() {
    const {className} = this.props
    return cls("CourseMeta mdc-layout-inner", className)
  }

  render() {
    const course = get(this.props, "course", null)
    const {detailsOpen, topicsOpen} = this.state
    return (
      <div className={this.classes}>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          {!topicsOpen &&
          <CourseMetaDetails onOpen={(open) => this.setState({ detailsOpen: open })} course={course} />}
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          {!detailsOpen &&
          <CourseMetaTopics onOpen={(open) => this.setState({ topicsOpen: open })} course={course} />}
        </div>
      </div>
    )
  }
}

export default createFragmentContainer(CourseMeta, graphql`
  fragment CourseMeta_course on Course {
    ...CourseMetaDetails_course
    ...CourseMetaTopics_course
  }
`)
