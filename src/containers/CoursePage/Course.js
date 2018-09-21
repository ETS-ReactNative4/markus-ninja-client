import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import { get } from 'utils'
import Counter from 'components/Counter'
import CourseLessons from './CourseLessons'
import AddCourseLessonForm from './AddCourseLessonForm'
import {isNil} from 'utils'

class Course extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("Course mdc-layout-grid__inner", className)
  }

  render() {
    const course = get(this.props, "course", null)
    if (isNil(course)) {
      return null
    }
    return (
      <React.Fragment>
        <h6 className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          Lessons
          <Counter className="ml1">{course.lessonCount}</Counter>
        </h6>
        <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <AddCourseLessonForm course={course} />
        </div>
        <CourseLessons course={course} />
      </React.Fragment>
    )
  }
}

export default withRouter(createFragmentContainer(Course, graphql`
  fragment Course_course on Course {
    lessonCount
    ...AddCourseLessonForm_course
    ...CourseLessons_course
  }
`))
