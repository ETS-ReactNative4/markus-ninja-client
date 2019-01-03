import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import {Link} from 'react-router-dom'
import Icon from 'components/Icon'
import UserLink from 'components/UserLink'
import {get, timeDifferenceForDate} from 'utils'

class AddedToActivityEvent extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("AddedToActivityEvent rn-list-preview", className)
  }

  render() {
    const {event} = this.props
    const activity = get(event, "activity")

    if (!event || !activity) {
      return null
    }

    return (
      <li className={this.classes}>
        <span className="mdc-list-item">
          <Icon className="mdc-list-item__graphic" icon="add" />
          <span className="mdc-list-item__text">
            <UserLink className="rn-link fw5" user={get(event, "user", null)} />
            <span className="ml1">
              added this to activity
              <Link
                className="rn-link fw5 ml1"
                to={activity.resourcePath}
              >
                {activity.name}
                <span className="mdc-theme--text-secondary-on-light ml1">
                  #{activity.number}
                </span>
              </Link>
              <span className="ml1">
                {timeDifferenceForDate(event.createdAt)}
              </span>
            </span>
          </span>
          <span className="mdc-list-item__meta">
            <Link
              className="mdc-icon-button"
              to={activity.resourcePath}
            >
              <Icon className="rn-icon-link__icon" icon="activity" />
            </Link>
          </span>
        </span>
      </li>
    )
  }
}

export default createFragmentContainer(AddedToActivityEvent, graphql`
  fragment AddedToActivityEvent_event on AddedToActivityEvent {
    activity {
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
