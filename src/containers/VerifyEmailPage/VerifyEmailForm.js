import * as React from 'react'
import cls from 'classnames'
import { withRouter } from 'react-router'
import TextField, {Input} from '@material/react-text-field'
import RequestEmailVerificationMutation from 'mutations/RequestEmailVerificationMutation'
import {isEmpty, isNil} from 'utils'

import './styles.css'

class VerifyEmailForm extends React.Component {
  state = {
    error: null,
    email: "",
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const {email} = this.state
    RequestEmailVerificationMutation(
      email,
      (errors) => {
        if (!isNil(errors)) {
          this.setState({ error: errors[0].message })
          return
        }
      },
    )
  }

  isValidEmail(email) {
    return !isEmpty(email)
  }

  get classes() {
    const {className} = this.props
    return cls("VerifyEmailForm mdc-layout-grid__inner", className)
  }

  get formValidForRequest() {
    const {email} = this.state
    return this.isValidEmail(email)
  }

  render() {
    const {email} = this.state
    return (
      <form className={this.classes} onSubmit={this.handleSubmit}>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <TextField
            className="w-100"
            outlined
            label="Email"
          >
            <Input
              name="email"
              value={email}
              onChange={this.handleChange}
            />
          </TextField>
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <button
            className="mdc-button mdc-button--unelevated w-100"
            type="submit"
            disabled={!this.formValidForRequest}
          >
            Send verification mail
          </button>
        </div>
      </form>
    )
  }
}

export default withRouter(VerifyEmailForm)
