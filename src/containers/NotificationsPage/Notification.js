import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import { get } from 'utils'
import MarkNotificationAsReadMutation from 'mutations/MarkNotificationAsReadMutation'
import UpdateEnrollmentMutation from 'mutations/UpdateEnrollmentMutation'
import { isNil, timeDifferenceForDate } from 'utils'

class Notification extends React.Component {
  handleMarkAsRead = (e) => {
    const notificationId = get(this.props, "notification.id", "")

    MarkNotificationAsReadMutation(
      notificationId,
      (response, error) => {
        if (!isNil(error)) {
          console.error(error)
        }
        this.props.history.push(get(this.props, "notification.subject.resourcePath", "."))
      },
    )
  }

  handleUnenroll = (e) => {
    UpdateEnrollmentMutation(
      get(this.props, "notification.subject.id", ""),
      'UNENROLLED',
      (errors) => {
        if (!isNil(errors)) {
          console.error(errors[0].message)
        }
      }
    )
  }

  get classes() {
    const {className} = this.props
    return cls("Notification mdc-list-item", className)
  }

  render() {
    const notification = get(this.props, "notification", {})
    const subject = get(this.props, "notification.subject", {})

    return (
      <li className={this.classes}>
        <span className="mdc-list-item__graphic material-icons">subject</span>
        <span className="mdc-list-item__text pointer" onClick={this.handleMarkAsRead}>
          <span className="mdc-list-item__primary-text">{subject.title}</span>
          <span className="mdc-list-item__secondary-text">
            {timeDifferenceForDate(notification.createdAt)}
          </span>
        </span>
        <span className="mdc-list-item__meta">
          <span
            className="material-icons pointer mr3"
            onClick={this.handleUnenroll}
            title="Unenroll in thread"
            aria-label="Unenroll in thread"
          >
            notifications_off
          </span>
          <span
            className="material-icons pointer"
            onClick={this.handleMarkAsRead}
            title="Mark as read"
            aria-label="Mark as read"
          >
            done
          </span>
        </span>
      </li>
    )
  }
}

export default withRouter(createFragmentContainer(Notification, graphql`
  fragment Notification_notification on Notification {
    id
    createdAt
    subject {
      id
      title
      resourcePath
    }
  }
`))
