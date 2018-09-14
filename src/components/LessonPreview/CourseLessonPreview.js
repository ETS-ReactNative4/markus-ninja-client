import * as React from 'react'
import cls from 'classnames'
import moment from 'moment'
import RemoveCourseLessonMutation from 'mutations/RemoveCourseLessonMutation'
import { Link } from 'react-router-dom'
import UserLink from 'components/UserLink'
import { get } from 'utils'

class CourseLessonPreview extends React.Component {
  handleRemove = () => {
    RemoveCourseLessonMutation(
      this.props.lesson.id,
    )
  }

  get classes() {
    const {className} = this.props
    return cls("CourseLessonPreview flex items-center", className)
  }

  render() {
    const lesson = get(this.props, "lesson", {})
    return (
      <div className={this.classes}>
        <div className="inline-flex flex-column flex-auto">
          <Link className="rn-link self-start mdc-typography--headline6" to={lesson.resourcePath}>
            {lesson.title}
          </Link>
          <div className="mdc-typography--subtitle1 mdc-theme--text-secondary-on-light">
            #{lesson.courseNumber} created on
            <span className="mh1">{moment(lesson.createdAt).format("MMM D")}</span>
            by
            <UserLink className="rn-link rn-link--secondary ml1" user={get(lesson, "author", null)} />
          </div>
        </div>
        {get(lesson, "course.viewerCanAdmin", false) &&
        <button
          className="material-icons mdc-icon-button mb1"
          type="button"
          onClick={this.handleRemove}
          aria-label="Remove lesson"
          title="Remove lesson"
        >
          delete
        </button>}
      </div>
    )
  }
}

export default CourseLessonPreview
