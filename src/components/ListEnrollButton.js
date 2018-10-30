import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
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
        (errors) => {
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
        (errors) => {
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

  get classes() {
    const {className} = this.props;
    return cls("mdc-list-item", className)
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
    const {enrollable, notification} = this.props

    if (!enrollable) return null;

    return (
      <li
        className={this.classes}
        role="button"
        onClick={this.handleClick}
      >
        <i className={cls(
          "material-icons mdc-list-item__graphic ",
          {
            "mdc-theme--text-icon-on-background": !on,
            "mdc-theme--secondary": on,
          },
        )} >
          {notification && on
          ? "notifications"
          : notification && !on
            ? "notifications_off"
          : "school"}
        </i>
        <span className="mdc-list-item__text">
          {this.text}
        </span>
      </li>
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
