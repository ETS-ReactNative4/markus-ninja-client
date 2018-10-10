import * as React from 'react'
import cls from 'classnames'
import moment from 'moment'
import { Link } from 'react-router-dom'
import Icon from 'components/Icon'
import UserLink from 'components/UserLink'
import {get} from 'utils'

class StudyCoursePreview extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("StudyCoursePreview mdc-list-item", className)
  }

  render() {
    const course = get(this.props, "course", {})

    return (
      <li className={this.classes}>
        <Icon as="span" className="mdc-list-item__graphic" icon="course" />
        <span className="mdc-list-item__text">
          <Link className="mdc-list-item__primary-text" to={course.resourcePath}>
            {course.name}
            <span className="mdc-theme--text-secondary-on-light ml1">#{course.number}</span>
          </Link>
          <span className="mdc-list-item__secondary-text">
            Created on
            <span className="mh1">{moment(course.createdAt).format("MMM D")}</span>
            by
            <UserLink className="rn-link rn-link--secondary ml1" user={get(course, "owner", null)} />
          </span>
        </span>
        <span className="mdc-list-item__meta">
          <Link
            className="rn-icon-link"
            to={course.resourcePath}
          >
            <Icon className="rn-icon-link__icon" icon="lesson" />
            {get(course, "lessonCount", 0)}
          </Link>
        </span>
      </li>
    )
  }
}

export default StudyCoursePreview
