import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import { get, isNil } from 'utils'
import UpdateEnrollmentMutation from 'mutations/UpdateEnrollmentMutation'

import './styles.css'

class EnrollmentSelect extends React.Component {
  state = {
    status: get(this.props, "enrollable.enrollmentStatus"),
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

  get classes() {
    const {className} = this.props
    const enrollable = get(this.props, "enrollable", {})
    const disabled = this.props.disabled || !enrollable.viewerCanEnroll
    return cls("EnrollmentSelect rn-select-button", className, {
      'rn-select-button--disabled': disabled,
    })
  }

  render() {
    const enrollable = get(this.props, "enrollable", null)
    if (isNil(enrollable)) {
      return null
    }

    const disabled = this.props.disabled || !enrollable.viewerCanEnroll
    const { status } = this.state

    return (
      <div className={this.classes}>
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
}

EnrollmentSelect.propTypes = {
  enrollable: PropTypes.shape({
    enrollmentStatus: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    viewerCanEnroll: PropTypes.bool.isRequired,
  }).isRequired,
}

EnrollmentSelect.defaultProps = {
  enrollable: {
    enrollmentStatus: "",
    id: "",
    viewerCanEnroll: false,
  }
}

export default EnrollmentSelect
