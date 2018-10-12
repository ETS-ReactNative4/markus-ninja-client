import * as React from 'react'
import cls from 'classnames'
import moment from 'moment'
import { Link } from 'react-router-dom'
import EnrollButton from 'components/EnrollButton'
import Icon from 'components/Icon'
import { get } from 'utils'

class CardLessonPreview extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("CardLessonPreview mdc-card", className)
  }

  render() {
    const lesson = get(this.props, "lesson", {})
    return (
      <div className={this.classes}>
        <Link className="mdc-card__primary-action" to={lesson.resourcePath}>
          <div className="pa3">
            <h6>{lesson.title}</h6>
            <div className="mdc-typography--subtitle2 mdc-theme--text-secondary-on-light">
              #{lesson.number} created on
              <span className="mh1">{moment(lesson.createdAt).format("MMM D, YYYY")}</span>
              by
              <span className="ml1">{get(lesson, "author.login", "")}</span>
            </div>
          </div>
        </Link>
        <div className="mdc-card__actions">
          <div className="mdc-card__action-buttons">
            <Link
              className="mdc-button mdc-card__action mdc-card__action--button"
              to={lesson.resourcePath}
            >
              Read
            </Link>
            <EnrollButton
              className="mdc-card__action mdc-card__action--button"
              enrollable={get(this.props, "lesson", null)}
            />
          </div>
          <div className="mdc-card__action-icons">
            <Link
              className="rn-icon-link mdc-card__action mdc-card__action--icon"
              to={lesson.resourcePath}
            >
              <Icon className="rn-icon-link__icon" icon="comment" />
              {get(lesson, "comments.totalCount", 0)}
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export default CardLessonPreview
