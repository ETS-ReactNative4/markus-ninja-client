import * as React from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import cls from 'classnames'
import { get, isNil } from 'utils'
import UpdateEnrollmentMutation from 'mutations/UpdateEnrollmentMutation'

import './styles.css'

export class ListEnrollButton extends React.Component {
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

  render() {
    const {on} = this.state
    const enrollable = get(this.props, "enrollable", null)
    const viewerIsEnrolled = this.isEnrolled
    if (isNil(enrollable)) {
      return null
    }

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
          school
        </i>
        <span className="mdc-list-item__text">
          {viewerIsEnrolled ? "Unenroll" : "Enroll"}
        </span>
      </li>
    )
  }
}

export default createFragmentContainer(ListEnrollButton, graphql`
  fragment ListEnrollButton_enrollable on Enrollable {
    enrollmentStatus
    id
    viewerCanEnroll
  }
`)
