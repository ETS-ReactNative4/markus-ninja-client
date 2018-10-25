import * as React from 'react'
import cls from 'classnames'
import moment from 'moment'
import { Link } from 'react-router-dom'
import AppleIconButton from 'components/AppleIconButton'
import Icon from 'components/Icon'
import { get } from 'utils'

class CardCoursePreview extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("CardCoursePreview mdc-card", className)
  }

  render() {
    const course = get(this.props, "course", {})
    return (
      <div className={this.classes}>
        <Link className="mdc-card__primary-action" to={course.resourcePath}>
          <div className="pa3">
            <h6 className="inline-flex-center">
              <Icon as="span" className="mr2" icon="course" />
              {course.name}
            </h6>
            <div className="mdc-typography--subtitle2 mdc-theme--text-secondary-on-light">
              #{course.number} created on
              <span className="mh1">{moment(course.createdAt).format("MMM D, YYYY")}</span>
              by
              <span className="ml1">{get(course, "owner.login", "")}</span>
            </div>
          </div>
          <div className="mdc-typography--body2 ph3 pb2">
            {course.description}
          </div>
        </Link>
        <div className="mdc-card__actions bottom">
          <div className="mdc-card__action-buttons">
            <Link
              className="mdc-button mdc-card__action mdc-card__action--button"
              to={course.resourcePath}
            >
              Begin
            </Link>
          </div>
          <div className="mdc-card__action-icons">
            {course.viewerCanApple &&
            <AppleIconButton
              className="mdc-card__action mdc-card__action--icon"
              appleable={get(this.props, "course", null)}
            />}
            <Link
              className="rn-icon-link mdc-card__action mdc-card__action--icon"
              to={course.resourcePath}
            >
              <Icon className="rn-icon-link__icon" icon="lesson" />
              {get(course, "lessons.totalCount", 0)}
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export default CardCoursePreview
