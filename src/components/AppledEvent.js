import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { Link } from 'react-router-dom'
import Icon from 'components/Icon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faApple } from '@fortawesome/free-brands-svg-icons'
import UserLink from 'components/UserLink'
import {get, timeDifferenceForDate} from 'utils'

class AppledEvent extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("AppledEvent rn-list-preview", className)
  }

  get appleableType() {
    switch (get(this.props, "event.appleable.__typename", "")) {
      case "Course":
        return "course"
      case "Study":
        return "study"
      default:
        return ""
    }
  }

  render() {
    const {event, withUser} = this.props
    const appleable = get(event, "appleable")

    if (!event || !appleable) {
      return null
    }

    return (
      <li className={this.classes}>
        <span className="mdc-list-item">
          <FontAwesomeIcon
            className="mdc-list-item__graphic"
            aria-label="Appled"
            title="Appled"
            icon={faApple}
          />
          <span className="mdc-list-item__text">
            <span className="mdc-list-item__primary-text">
              {withUser &&
              <UserLink className="rn-link fw5" user={get(event, "user", null)} />}
              <span className="ml1">
                {withUser ? 'a' : 'A'}ppled a {this.appleableType}
              </span>
              <Link className="rn-link fw5 ml1" to={appleable.resourcePath}>
                {appleable.name}
              </Link>
            </span>
            <span className="mdc-list-item__secondary-text">
              Appled {timeDifferenceForDate(event.createdAt)}
            </span>
          </span>
          <span className="mdc-list-item__meta">
            <Link
              className="mdc-icon-button"
              to={appleable.resourcePath}
            >
              <Icon className="rn-icon-link__icon" icon={this.appleableType} />
            </Link>
          </span>
        </span>
      </li>
    )
  }
}

export default createFragmentContainer(AppledEvent, graphql`
  fragment AppledEvent_event on AppledEvent {
    appleable {
      __typename
      ...on Course {
        name
        resourcePath
      }
      ...on Study {
        name
        resourcePath
      }
    }
    createdAt
    id
    user {
      ...UserLink_user
    }
  }
`)
