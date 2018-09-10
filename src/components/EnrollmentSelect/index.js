import * as React from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import cls from 'classnames'
import { get, isNil } from 'utils'
import UpdateEnrollmentMutation from 'mutations/UpdateEnrollmentMutation'

import './styles.css'

class EnrollmentSelect extends React.Component {
  state = {
    status: get(this.props, "enrollable.enrollmentStatus"),
  }
  render() {
    const enrollable = get(this.props, "enrollable", null)
    if (isNil(enrollable)) {
      return null
    }

    const disabled = this.props.disabled || !enrollable.viewerCanEnroll
    const { status } = this.state

    return (
      <div
        className={cls(
          "EnrollmentSelect rn-select-button",
          { "rn-select-button--disabled": disabled },
        )}
      >
        <select
          className="rn-select-button__native-control"
          value={status}
          disabled={disabled}
          onChange={this.handleChange}
        >
          <option value="ENROLLED">Enrolled</option>
          <option value="IGNORED">Ignored</option>
          <option value="UNENROLLED">Unenrolled</option>
        </select>
      </div>
    )
  }

  handleChange = (e) => {
    this.setState({
      status: e.target.value,
    })
    UpdateEnrollmentMutation(
      this.props.enrollable.id,
      e.target.value,
      (errors) => {
        if (!isNil(errors)) {
          console.error(errors[0].message)
        }
      }
    )
  }
}

export default createFragmentContainer(EnrollmentSelect, graphql`
  fragment EnrollmentSelect_enrollable on Enrollable {
    enrollmentStatus
    id
    viewerCanEnroll
  }
`)
