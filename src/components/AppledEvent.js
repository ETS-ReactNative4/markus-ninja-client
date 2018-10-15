import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import moment from 'moment'
import { Link } from 'react-router-dom'
import Icon from 'components/Icon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faApple } from '@fortawesome/free-brands-svg-icons'
import UserLink from 'components/UserLink'
import {get} from 'utils'

class AppledEvent extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("AppledEvent mdc-list-item", className)
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
    const {withUser} = this.props
    const event = get(this.props, "event", {})
    const appleable = get(event, "appleable", {})

    return (
      <li className={this.classes}>
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
            Appled on {moment(event.createdAt).format("MMM D, YYYY")}
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
