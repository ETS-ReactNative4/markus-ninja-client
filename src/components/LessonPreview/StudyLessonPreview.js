import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import moment from 'moment'
import { Link } from 'react-router-dom'
import Icon from 'components/Icon'
import Label from 'components/Label'
import UserLink from 'components/UserLink'
import {get} from 'utils'

class StudyLessonPreview extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("StudyLessonPreview mdc-list-item", className)
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
            <span className="mdc-theme--text-secondary-on-light ml1">#{lesson.number}</span>
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
          <Link
            className="rn-icon-link"
            to={lesson.resourcePath}
          >
            <Icon className="rn-icon-link__icon" icon="comment" />
            {get(lesson, "commentCount", 0)}
          </Link>
        </span>
      </li>
    )
  }
}

StudyLessonPreview.propTypes = {
  lesson: PropTypes.shape({
    createdAt: PropTypes.string,
    number: PropTypes.number,
    resourcePath: PropTypes.string,
    title: PropTypes.string,
  })
}

StudyLessonPreview.defaultProps = {
  lesson: {
    createdAt: "",
    number: 0,
    resourcePath: "",
    title: "",
  }
}

export default StudyLessonPreview
