import * as React from 'react'
import cls from 'classnames'
import moment from 'moment'
import RemoveCourseLessonMutation from 'mutations/RemoveCourseLessonMutation'
import { Link } from 'react-router-dom'
import Icon from 'components/Icon'
import Label from 'components/Label'
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
    return cls("CourseLessonPreview mdc-list-item", className)
  }

  render() {
    const lesson = get(this.props, "lesson", {})
    const labelNodes = get(lesson, "labels.nodes", [])

    return (
      <li className={this.classes}>
        <Icon as="span" className="mdc-list-item__graphic" icon="lesson" />
        <span className="mdc-list-item__text">
          <Link className="mdc-list-item__primary-text" to={lesson.resourcePath}>
            {lesson.title}
            <span className="mdc-theme--text-secondary-on-light ml1">#{get(lesson, "courseNumber", 0)}</span>
          </Link>
          <span className="mdc-list-item__secondary-text">
            Created on
            <span className="mh1">{moment(lesson.createdAt).format("MMM D")}</span>
            by
            <UserLink className="rn-link rn-link--secondary ml1" user={get(lesson, "author", null)} />
          </span>
        </span>
        <span className="mdc-list-item__tags">
          {labelNodes.map((node) =>
            node &&
            <Label key={node.id} label={node} selected />)}
        </span>
        <span className="mdc-list-item__meta">
          <div className="inline-flex items-center justify-center">
            {get(lesson, "course.viewerCanAdmin", false) &&
            <button
              className="material-icons mdc-icon-button"
              type="button"
              onClick={this.handleRemove}
              aria-label="Remove lesson"
              title="Remove lesson"
            >
              delete
            </button>}
            <Link
              className="rn-icon-link"
              to={lesson.resourcePath}
            >
              <Icon className="rn-icon-link__icon" icon="comment" />
              {get(lesson, "commentCount", 0)}
            </Link>
          </div>
        </span>
      </li>
    )
  }
}

export default CourseLessonPreview
