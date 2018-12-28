import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { withRouter } from 'react-router'
import getHistory from 'react-router-global-history'
import List from 'components/mdc/List'
import Icon from 'components/Icon'
import Menu from 'components/mdc/Menu'
import NotificationButton from 'components/NotificationButton'
import ListEnrollButton from 'components/ListEnrollButton'
import MarkNotificationAsReadMutation from 'mutations/MarkNotificationAsReadMutation'
import {filterDefinedReactChildren, get, timeDifferenceForDate} from 'utils'

class Notification extends React.Component {
  state = {
    menuOpen: false,
  }

  handleMarkAsRead = (e) => {
    const notificationId = get(this.props, "notification.id", "")

    MarkNotificationAsReadMutation(
      notificationId,
      (response, error) => {
        if (error) {
          console.error(error)
        }
        getHistory().push(get(this.props, "notification.subject.resourcePath", "."))
      },
    )
  }

  get classes() {
    const {className} = this.props
    return cls("Notification rn-list-preview", className)
  }

  get primaryText() {
    const subject = get(this.props, "notification.subject", {})
    switch (subject.__typename) {
      case "Lesson":
        return subject.title
      case "UserAsset":
        return subject.name
      default:
        return ""
    }
  }

  render() {
    const {menuOpen} = this.state
    const notification = get(this.props, "notification", {})
    const subject = get(this.props, "notification.subject", {})

    return (
      <li className={this.classes}>
        <span className="mdc-list-item">
          <span className="mdc-list-item__graphic">
            <Icon className="mdc-icon-button" icon="lesson" onClick={this.handleMarkAsRead} />
          </span>
          <span className="mdc-list-item__text pointer" onClick={this.handleMarkAsRead}>
            <span className="mdc-list-item__primary-text">{this.primaryText}</span>
            <span className="mdc-list-item__secondary-text">
              {timeDifferenceForDate(notification.createdAt)}
            </span>
          </span>
          <span className="mdc-list-item__meta rn-list-preview__actions">
            <span className="rn-list-preview__actions--spread">
              <NotificationButton enrollable={subject} />
              <button
                type="button"
                className="mdc-icon-button material-icons"
                onClick={this.handleMarkAsRead}
                title="Mark as read"
                aria-label="Mark as read"
              >
                done
              </button>
              <span
                className="Notification__why"
                aria-label={notification.reason}
                title={notification.reason}
              >
                ?
              </span>
            </span>
            <Menu.Anchor className="rn-list-preview__actions--collapsed">
              <button
                type="button"
                className="mdc-icon-button material-icons"
                onClick={() => this.setState({menuOpen: !menuOpen})}
              >
                more_vert
              </button>
              <Menu open={menuOpen} onClose={() => this.setState({menuOpen: false})}>
                {this.renderMenuList()}
              </Menu>
            </Menu.Anchor>
          </span>
        </span>
      </li>
    )
  }

  renderMenuList() {
    const subject = get(this.props, "comment", {})

    const listItems = [
      subject.__typename === "Lesson" && subject.viewerCanEnroll &&
      <ListEnrollButton notification enrollable={subject} />,
      <List.Item onClick={this.handleMarkAsRead}>
        <List.Item.Graphic graphic={<Icon icon="done" />} />
        <List.Item.Text primaryText="Mark as read" />
      </List.Item>
    ]

    return <List items={filterDefinedReactChildren(listItems)} />
  }
}

export default withRouter(createFragmentContainer(Notification, graphql`
  fragment Notification_notification on Notification {
    id
    createdAt
    reason
    subject {
      __typename
      id
      resourcePath
      ...on Lesson {
        enrollmentStatus
        title
        viewerCanEnroll
      }
      ...on UserAsset {
        name
      }
    }
  }
`))
