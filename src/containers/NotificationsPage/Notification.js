import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import Icon from 'components/Icon'
import NotificationButton from 'components/NotificationButton'
import MarkNotificationAsReadMutation from 'mutations/MarkNotificationAsReadMutation'
import UpdateEnrollmentMutation from 'mutations/UpdateEnrollmentMutation'
import {get, isNil, timeDifferenceForDate} from 'utils'

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
    return cls("Notification mdc-list-item rn-list-preview", className)
  }

  render() {
    const notification = get(this.props, "notification", {})
    const subject = get(this.props, "notification.subject", {})

    return (
      <li className={this.classes}>
        <Icon as="span" className="mdc-list-item__graphic" icon="lesson" />
        <span className="mdc-list-item__text pointer" onClick={this.handleMarkAsRead}>
          <span className="mdc-list-item__primary-text">{subject.title}</span>
          <span className="mdc-list-item__secondary-text">
            {timeDifferenceForDate(notification.createdAt)}
          </span>
        </span>
        <span className="mdc-list-item__meta">
          <div className="mdc-list-item__meta-actions mdc-list-item__meta-actions--collapsible">
            <div className="mdc-list-item__meta-actions--spread">
              <NotificationButton enrollable={subject} />
              <span
                className="mdc-icon-button material-icons"
                onClick={this.handleMarkAsRead}
                title="Mark as read"
                aria-label="Mark as read"
              >
                done
              </span>
              <span
                className="Notification__why"
                aria-label={notification.reason}
                title={notification.reason}
              >
                ?
              </span>
            </div>
          </div>
        </span>
      </li>
    )
  }
}

export default withRouter(createFragmentContainer(Notification, graphql`
  fragment Notification_notification on Notification {
    id
    createdAt
    reason
    subject {
      ...NotificationButton_enrollable
      id
      title
      resourcePath
    }
  }
`))
