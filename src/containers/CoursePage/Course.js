import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import { get } from 'utils'
import Counter from 'components/Counter'
import CourseLessons from 'components/CourseLessons'
import AddCourseLessonForm from 'components/AddCourseLessonForm'
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
      <div className={this.classes}>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <h6>
            Lessons
            <Counter>{course.lessonCount}</Counter>
          </h6>
        </div>
        <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <AddCourseLessonForm course={course} />
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <CourseLessons course={course} />
        </div>
      </div>
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
