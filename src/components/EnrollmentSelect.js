import * as React from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { get, isNil } from 'utils'
import UpdateEnrollmentMutation from 'mutations/UpdateEnrollmentMutation'

class EnrollmentSelect extends React.Component {
  state = {
    status: get(this.props, "enrollable.enrollmentStatus"),
  }
  render() {
    const enrollable = get(this.props, "enrollable", {})
    const { status } = this.state
    return (
      <div className="EnrollmentSelect">
        {enrollable.viewerCanEnroll &&
        <select
          value={status}
          onChange={this.handleChange}
        >
          <option value="ENROLLED">Enrolled</option>
          <option value="IGNORED">Ignored</option>
          <option value="UNENROLLED">Unenrolled</option>
        </select>}
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
    enrollmentStatus
    id
    viewerCanEnroll
  }
`)
