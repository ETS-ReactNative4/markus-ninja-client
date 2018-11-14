import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import {Link} from 'react-router-dom'
import Icon from 'components/Icon'
import UserLink from 'components/UserLink'
import {get, timeDifferenceForDate} from 'utils'

class RemovedFromCourseEvent extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("RemovedFromCourseEvent rn-list-preview", className)
  }

  render() {
    const {event} = this.props
    const course = get(event, "course")

    if (!event || !course) {
      return null
    }

    return (
      <li className={this.classes}>
        <span className="mdc-list-item">
          <Icon className="mdc-list-item__graphic" icon="remove" />
          <span className="mdc-list-item__text">
            <UserLink className="rn-link fw5" user={get(event, "user", null)} />
            <span className="ml1">
              removed this from course
              <Link
                className="rn-link fw5 ml1"
                to={course.resourcePath}
              >
                {course.name}
                <span className="mdc-theme--text-secondary-on-light ml1">
                  #{course.number}
                </span>
              </Link>
              <span className="ml1">{timeDifferenceForDate(event.createdAt)}</span>
            </span>
          </span>
          <span className="mdc-list-item__meta">
            <Link
              className="mdc-icon-button"
              to={course.resourcePath}
            >
              <Icon className="rn-icon-link__icon" icon="course" />
            </Link>
          </span>
        </span>
      </li>
    )
  }
}

export default createFragmentContainer(RemovedFromCourseEvent, graphql`
  fragment RemovedFromCourseEvent_event on RemovedFromCourseEvent {
    course {
      name
      number
      resourcePath
    }
    createdAt
    id
    user {
      ...UserLink_user
    }
  }
`)
