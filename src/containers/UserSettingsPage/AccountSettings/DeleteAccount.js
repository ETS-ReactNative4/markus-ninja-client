import * as React from 'react'
import cls from 'classnames'
import { withRouter } from 'react-router-dom';
import TextField, {Input} from '@material/react-text-field'
import DeleteViewerAccountMutation from 'mutations/DeleteViewerAccountMutation'
import { isEmpty, isNil } from 'utils'

class DeleteAccount extends React.Component {
  state = {
    error: null,
    open: false,
    password: "",
    login: "",
    verify: "",
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { login, password, verify } = this.state
    if (verify !== 'delete my account') {
      return
    } else {
      return DeleteViewerAccountMutation(
        login,
        password,
        (error) => {
          if (!isNil(error)) {
            this.setState({ error: error.message })
          }
          this.history.replace('/')
        },
      )
    }
  }

  handleToggleOpen = () => {
    this.setState({ open: !this.state.open })
  }

  get classes() {
    const {className} = this.props
    const {open} = this.state
    return cls("DeleteAccount mdc-layout-grid__inner", className, {
      open,
    })
  }

  get isSubmittable() {
    const {login, password, verify} = this.state
    return !isEmpty(login) &&
      !isEmpty(password) &&
      verify === 'delete my account'
  }

  render() {
    const {open} = this.state

    return (
      <div className={this.classes}>
        {open
        ? this.renderForm()
        : this.renderInfo()}
      </div>
    )
  }

  renderInfo() {
    return (
      <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
        <p>Once you delete your account, there is no going back. Please be certain.</p>
        <button
          className="mdc-button mdc-button--unelevated mt2"
          type="button"
          onClick={this.handleToggleOpen}
        >
          Delete your account
        </button>
      </div>
    )
  }

  renderForm() {
    const {login, password, verify} = this.state

    return (
      <form
        className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12"
        onSubmit={this.handleSubmit}
      >
        <h6>This is extremely important.</h6>
        <p>
          We will immediately delete all your studies, and anything associated with your account.
          You will no longer receive any communication from us about your account.
          Please be sure before you proceed.
        </p>
        <div className="flex flex-column">
          <TextField
            className="rn-form__input"
            label="You username or email"
          >
            <Input
              name="login"
              value={login}
              required
              onChange={this.handleChange}
            />
          </TextField>
          <TextField
            className="rn-form__input mt3"
            label="Password"
          >
            <Input
              type="password"
              name="password"
              value={password}
              required
              onChange={this.handleChange}
            />
          </TextField>
        </div>
        <p>
          To verify, type <em>delete my account</em> below:
        </p>
        <TextField
          className="rn-form__input"
          label="Verify"
        >
          <Input
            name="verify"
            value={verify}
            required
            pattern="delete my account"
            onChange={this.handleChange}
          />
        </TextField>
        <div className="mt2">
          <button
            type="submit"
            className="mdc-button mdc-button--unelevated"
          >
            Delete this account
          </button>
          <button
            className="mdc-button ml2"
            type="button"
            onClick={this.handleToggleOpen}
          >
            Cancel
          </button>
        </div>
      </form>
    )
  }
}

export default withRouter(DeleteAccount)
