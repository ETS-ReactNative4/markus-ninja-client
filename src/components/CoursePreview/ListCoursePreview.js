import * as React from 'react'
import cls from 'classnames'
import moment from 'moment'
import {Link} from 'react-router-dom'
import AppleIconButton from 'components/AppleIconButton'
import Icon from 'components/Icon'
import {get} from 'utils'

class ListCoursePreview extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("ListCoursePreview rn-list-preview mdc-list-item", className)
  }

  get timestamp() {
    const advancedAt = get(this.props, "course.advancedAt", null)
    const createdAt = get(this.props, "course.createdAt")

    if (advancedAt) {
      return `Advanced ${moment(advancedAt).format("MMM D")}`
    } else {
      return `Created ${moment(createdAt).format("MMM D")}`
    }
  }

  render() {
    const course = get(this.props, "course", {})
    const topicNodes = get(course, "topics.nodes", [])
    return (
      <li className={this.classes}>
        <Icon as="span" className="mdc-list-item__graphic" icon="course" />
        <Link className="mdc-list-item__text" to={course.resourcePath}>
          <span className="mdc-list-item__primary-text">
            {course.name}
            <span className="mdc-theme--text-secondary-on-light ml1">#{course.number}</span>
          </span>
          <span className="mdc-list-item__secondary-text">
            <span className="mr1">{this.timestamp}</span>
            by {get(course, "owner.login", "")}
          </span>
        </Link>
        <span className="mdc-list-item__tags">
          {topicNodes.map((node) =>
            node &&
            <Link
              key={node.id}
              className="mdc-button mdc-button--outlined"
              to={node.resourcePath}
            >
              {node.name}
            </Link>
          )}
        </span>
        <span className="mdc-list-item__meta">
          <div className="mdc-list-item__meta-actions mdc-list-item__meta-actions--collapsible">
            <div className="mdc-list-item__meta-actions--spread">
              {course.viewerCanApple &&
              <AppleIconButton appleable={get(this.props, "course", null)} />}
              <Link
                className="rn-icon-link"
                to={course.resourcePath}
              >
                <Icon className="rn-icon-link__icon" icon="lesson" />
                {get(course, "lessons.totalCount", 0)}
              </Link>
            </div>
          </div>
        </span>
      </li>
    )
  }
}

export default ListCoursePreview
