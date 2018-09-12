import * as React from 'react'
import cls from 'classnames'
import moment from 'moment'
import { Link } from 'react-router-dom'
import HTML from 'components/HTML'
import UserLink from 'components/UserLink'
import {get} from 'utils'

class StudyCoursePreview extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("StudyCoursePreview flex", className)
  }

  render() {
    const course = get(this.props, "course", {})

    return (
      <div className={this.classes}>
        <div className="inline-flex flex-column flex-auto">
          <Link className="rn-link self-start mdc-typography--headline6" to={course.resourcePath}>
            {course.name}
          </Link>
          <HTML html={course.descriptionHTML} />
          <div className="mdc-typography--subtitle1 mdc-theme--text-secondary-on-light">
            #{course.number} created on
            <span className="mh1">{moment(course.createdAt).format("MMM D")}</span>
            by
            <UserLink className="rn-link rn-link--secondary ml1" user={get(course, "owner", null)} />
          </div>
        </div>
        <Link
          className="rn-link inline-flex items-center self-start"
          to={course.resourcePath}
        >
          <i className="material-icons mr1">subject</i>
          <span className="mdc-typography--subtitle2">
            {course.lessonCount}
          </span>
        </Link>
      </div>
    )
  }
}

export default StudyCoursePreview
