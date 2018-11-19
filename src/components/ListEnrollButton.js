import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import List from 'components/mdc/List'
import Icon from 'components/Icon'
import { get, isNil } from 'utils'
import UpdateEnrollmentMutation from 'mutations/UpdateEnrollmentMutation'

class ListEnrollButton extends React.Component {
  state = {
    on: this.isEnrolled,
  }

  handleClick = () => {
    const isEnrolled = this.isEnrolled
    if (isEnrolled) {
      // optimistic update
      this.setState({on: false})

      UpdateEnrollmentMutation(
        this.props.enrollable.id,
        "UNENROLLED",
        (response, errors) => {
          if (!isNil(errors)) {
            console.error(errors[0].message)
          }
        }
      )
    } else {
      // optimistic update
      this.setState({on: true})

      UpdateEnrollmentMutation(
        this.props.enrollable.id,
        "ENROLLED",
        (response, errors) => {
          if (!isNil(errors)) {
            console.error(errors[0].message)
          }
        }
      )
    }
  }

  get isEnrolled() {
    const status = get(this.props, "enrollable.enrollmentStatus")
    if (status === "ENROLLED") {
      return true
    }
    return false
  }

  get text() {
    const {notification} = this.props
    const viewerIsEnrolled = this.isEnrolled
    if (viewerIsEnrolled) {
      if (notification) {
        return "Unsubscribe"
      } else {
        return "Unenroll"
      }
    } else {
      if (notification) {
        return "Subscribe"
      } else {
        return "Enroll"
      }
    }
  }

  render() {
    const {on} = this.state
    const {className, enrollable, notification} = this.props

    if (!enrollable) return null;

    return (
      <List.Item
        className={className}
        role="button"
        onClick={this.handleClick}
      >
        <List.Item.Graphic
          className={cls(
            {
              "mdc-theme--text-icon-on-background": !on,
              "mdc-theme--secondary": on,
            },
          )}
          graphic={
            <Icon icon={
              notification && on
              ? "notifications"
              : notification && !on
                ? "notifications_off"
                : "school"
            }/>
          }
        />
        <List.Item.Text primaryText={this.text} />
      </List.Item>
    )
  }
}

ListEnrollButton.propTypes = {
  notification: PropTypes.bool,
}

ListEnrollButton.defaultProps = {
  notification: false,
}

export default ListEnrollButton
