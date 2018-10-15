import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import moment from 'moment'
import {Link} from 'react-router-dom'
import EnrollIconButton from 'components/EnrollIconButton'
import Icon from 'components/Icon'
import LabelLink from 'components/LabelLink'
import UserLink from 'components/UserLink'
import {get} from 'utils'

class ListLessonPreview extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("ListLessonPreview mdc-list-item", className)
  }

  get number() {
    const {isCourse, lesson} = this.props
    return isCourse ? lesson.courseNumber : lesson.number
  }

  render() {
    const {lesson} = this.props
    const labelNodes = get(lesson, "labels.nodes", [])

    if (!lesson) {
      return null
    }

    return (
      <li className={this.classes}>
        <Icon as="span" className="mdc-list-item__graphic" icon="lesson" />
        <span className="mdc-list-item__text">
          <Link className="mdc-list-item__primary-text" to={lesson.resourcePath}>
            {lesson.title}
            <span className="mdc-theme--text-secondary-on-light ml1">#{this.number}</span>
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
            <LabelLink key={node.id} label={node} />
          )}
        </span>
        <span className="mdc-list-item__meta">
          <div className="mdc-list-item__meta-actions">
            {lesson.viewerCanEnroll &&
            <EnrollIconButton enrollable={get(this.props, "lesson", null)} />}
            <Link
              className="rn-icon-link"
              to={lesson.resourcePath}
            >
              <Icon className="rn-icon-link__icon" icon="comment" />
              {get(lesson, "comments.totalCount", 0)}
            </Link>
          </div>
        </span>
      </li>
    )
  }
}

ListLessonPreview.propTypes = {
  isCourse: PropTypes.bool,
}

ListLessonPreview.defaultProps = {
  isCourse: false,
}

export default ListLessonPreview
