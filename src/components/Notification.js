import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import { get } from 'utils'
import MarkNotificationAsReadMutation from 'mutations/MarkNotificationAsReadMutation'
import { isNil, timeDifferenceForDate } from 'utils'

class Notification extends React.Component {
  handleClick = (e) => {
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

  get classes() {
    const {className} = this.props
    return cls("Notification flex items-center pointer", className)
  }

  render() {
    const notification = get(this.props, "notification", {})
    const subject = get(this.props, "notification.subject", {})

    return (
      <div className={this.classes} onClick={this.handleClick}>
        <span>{subject.title}</span>
        <span className="ml1">{timeDifferenceForDate(notification.createdAt)}</span>
      </div>
    )
  }
}

export default withRouter(createFragmentContainer(Notification, graphql`
  fragment Notification_notification on Notification {
    id
    createdAt
    subject {
      title
      resourcePath
    }
  }
`))
