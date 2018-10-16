import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import { get, isNil } from 'utils'
import UpdateEnrollmentMutation from 'mutations/UpdateEnrollmentMutation'

import './styles.css'

const ARIA_PRESSED = "aria-pressed"
const BUTTON_ON = "mdc-icon-button--on"

export class EnrollIconButton extends React.Component {
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
    const label = viewerIsEnrolled ? "Unenroll" : "Enroll"

    return (
      <button
        className={this.classes}
        aria-label={label}
        title={label}
        aria-hidden="true"
        aria-pressed={this.state.attrs[ARIA_PRESSED]}
        disabled={disabled}
        onClick={this.handleClick}
      >
        <i className="mdc-icon-button__icon material-icons">
          school
        </i>
        <i
          className="mdc-icon-button__icon mdc-icon-button__icon--on material-icons mdc-theme--secondary"
        >
          school
        </i>
      </button>
    )
  }
}

EnrollIconButton.propTypes = {
  enrollable: PropTypes.shape({
    enrollmentStatus: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    viewerCanEnroll: PropTypes.bool.isRequired,
  }).isRequired,
}

EnrollIconButton.defaultProps = {
  enrollable: {
    enrollmentStatus: "",
    id: "",
    viewerCanEnroll: false,
  }
}

export default EnrollIconButton
