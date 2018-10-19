import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import moment from 'moment'
import { Link } from 'react-router-dom'
import EnrollIconButton from 'components/EnrollIconButton'
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
          </div>
          <div className="mdc-card__action-icons">
            {lesson.viewerCanEnroll &&
            <EnrollIconButton
              className="mdc-card__action mdc-card__action--icon"
              enrollable={get(this.props, "lesson", null)}
            />}
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

CardLessonPreview.propTypes = {
  edit: PropTypes.bool,
  isCourse: PropTypes.bool,
  lesson: PropTypes.shape({
    author: PropTypes.shape({
      login: PropTypes.string.isRequired,
      resourcePath: PropTypes.string.isRequired,
    }).isRequired,
    createdAt: PropTypes.string.isRequired,
    comments: PropTypes.shape({
      totalCount: PropTypes.number.isRequired,
    }).isRequired,
    id: PropTypes.string.isRequired,
    number: PropTypes.number.isRequired,
    resourcePath: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }),
}

CardLessonPreview.defaultProps = {
  edit: false,
  isCourse: false,
  lesson: {
    author: {
      login: "",
      resourcePath: "",
    },
    createdAt: "",
    comments: {
      totalCount: 0,
    },
    id: "",
    number: 0,
    resourcePath: "",
    title: "",
  }
}

export default createFragmentContainer(CardLessonPreview, graphql`
  fragment CardLessonPreview_lesson on Lesson {
    author {
      login
      resourcePath
    }
    comments(first: 0) {
      totalCount
    }
    createdAt
    enrollmentStatus
    id
    number
    resourcePath
    title
    viewerCanEnroll
  }
`)
