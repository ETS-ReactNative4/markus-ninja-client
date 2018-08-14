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

    const enrolleeCount = get(enrollable, "enrolleeCount", 0)
    const disabled = !enrollable.viewerCanEnroll
    const { status } = this.state

    return (
      <div
        className={cls(
          "EnrollmentSelect mdc-select mdc-select-box",
          { "mdc-select-disabled": disabled },
        )}
      >
        <div className="es-count mdc-chip">
          <div className="mdc-chip__text">{enrolleeCount}</div>
        </div>
        <select
          className="mdc-select__native-control"
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
      (error) => {
        if (!isNil(error)) {
          console.error(error.message)
        }
      }
    )
  }
}

export default createFragmentContainer(EnrollmentSelect, graphql`
  fragment EnrollmentSelect_enrollable on Enrollable {
    enrolleeCount
    enrollmentStatus
    id
    viewerCanEnroll
  }
`)
