import * as React from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import cls from 'classnames'
import { get, isNil } from 'utils'
import UpdateEnrollmentMutation from 'mutations/UpdateEnrollmentMutation'

import './styles.css'

const ARIA_PRESSED = "aria-pressed"
const BUTTON_ON = "mdc-icon-button--on"

export class NotificationButton extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      classList: new Set(),
      attrs: {
        [ARIA_PRESSED]: this.isEnrolled,
      },
    }
  }

  get adapter() {
    return {
      addClass: (className) => {
        const classList = new Set(this.state.classList)
        classList.add(className)
        this.setState({classList})
      },
      removeClass: (className) => {
        const classList = new Set(this.state.classList)
        classList.delete(className)
        this.setState({classList})
      },
      hasClass: (className) => {
        this.classes.split(' ').includes(className)
      },
      setAttr: (attr, value) => {
        this.setState({[attr]: value})
      },
    }
  }

  handleClick = () => {
    const isEnrolled = this.isEnrolled
    if (isEnrolled) {
      // optimistic update
      this.adapter.removeClass(BUTTON_ON)

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
      this.adapter.addClass(BUTTON_ON)

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
    this.adapter.setAttr(ARIA_PRESSED, `${isEnrolled}`)
  }

  get isEnrolled() {
    const status = get(this.props, "enrollable.enrollmentStatus")
    if (status === "ENROLLED") {
      return true
    }
    return false
  }

  get classes() {
    const {classList} = this.state
    const {className} = this.props;
    return cls("mdc-icon-button", Array.from(classList), className, {
      [BUTTON_ON]: this.isEnrolled,
    })
  }

  render() {
    const enrollable = get(this.props, "enrollable", null)
    const viewerIsEnrolled = this.isEnrolled
    if (isNil(enrollable)) {
      return null
    }

    const disabled = this.props.disabled || !enrollable.viewerCanEnroll

    return (
      <button
        className={this.classes}
        title={viewerIsEnrolled ? "Unenroll in thread" : "Enroll in thread"}
        aria-label={viewerIsEnrolled ? "Unenroll in thread" : "Enroll in thread"}
        aria-hidden="true"
        aria-pressed={this.state.attrs[ARIA_PRESSED]}
        disabled={disabled}
        onClick={this.handleClick}
      >
        <i className="mdc-icon-button__icon material-icons">
          notifications
        </i>
        <i
          className="mdc-icon-button__icon mdc-icon-button__icon--on material-icons"
        >
          notifications_off
        </i>
      </button>
    )
  }
}

export default createFragmentContainer(NotificationButton, graphql`
  fragment NotificationButton_enrollable on Enrollable {
    enrollmentStatus
    id
    viewerCanEnroll
  }
`)