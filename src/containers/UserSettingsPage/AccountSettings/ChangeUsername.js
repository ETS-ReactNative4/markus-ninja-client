import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import {HelperText} from '@material/react-text-field'
import ErrorText from 'components/ErrorText'
import Snackbar from 'components/mdc/Snackbar'
import TextField, {defaultTextFieldState} from 'components/TextField'
import UpdateViewerAccountMutation from 'mutations/UpdateViewerAccountMutation'
import {get} from 'utils'

const INFO_STAGE = 'info'
const AGREEMENT_STAGE = 'agreement'
const FORM_STAGE = 'form'

const defaultState = {
  error: null,
  showSnackbar: false,
  stage: INFO_STAGE,
  username: defaultTextFieldState,
}

class ChangeUsername extends React.Component {
  constructor(props) {
    super(props)

    const value = get(this.props, "user.login", "")

    this.state = {
      ...defaultState,
      username: {
        ...defaultState.username,
        initialValue: value,
        value,
        valid: true,
      }
    }
  }

  handleChange = (field) => {
    this.setState({
      error: null,
      [field.name]: field,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { username } = this.state
    UpdateViewerAccountMutation(
      username.value,
      null,
      null,
      (viewer, errors) => {
        if (errors) {
          this.setState({ error: errors[0].message })
          return
        }
        const value = get(viewer, "login", "")
        this.setState({
          ...defaultState,
          showSnackbar: true,
          username: {
            ...defaultState.username,
            initialValue: value,
            value,
            valid: true,
          }
        })
      },
    )
  }

  handleChangeStage = (stage = INFO_STAGE) => {
    this.setState({ stage })
  }

  get classes() {
    const {className} = this.props
    const {stage} = this.state
    return cls("ChangeUsername mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className, {
      [stage]: true,
    })
  }

  render() {
    const {showSnackbar, stage} = this.state

    return (
      <React.Fragment>
        <div className={this.classes}>
          {(() => {
            switch (stage) {
              case INFO_STAGE:
                return this.renderInfo()
              case AGREEMENT_STAGE:
                return this.renderAgreement()
              case FORM_STAGE:
                return this.renderForm()
              default:
                return null
            }
          })()}
        </div>
        <Snackbar
          show={showSnackbar}
          message="Username changed"
          actionHandler={() => {this.setState({showSnackbar: false})}}
          actionText="ok"
          handleHide={() => {this.setState({showSnackbar: false})}}
        />
      </React.Fragment>
    )
  }

  renderInfo() {
    return (
      <React.Fragment>
        <p>Changing your username can have unintended side effects.</p>
        <button
          className="mdc-button mdc-button--unelevated mt2"
          type="button"
          onClick={() => this.handleChangeStage(AGREEMENT_STAGE)}
        >
          Change username
        </button>
      </React.Fragment>
    )
  }

  renderAgreement() {
    return (
      <React.Fragment>
        <h6>Are you sure you want to change your username?</h6>
        <div className="warning">
          <span>This will result in unexpected behavior if you don't read this!</span>
        </div>
        <ul>
          <li>All previous links to your profile/studies <b>will not</b> go to your respective page.</li>
          <li>If someone takes your old username, then all previous links will direct to them.</li>
        </ul>
        <button
          className="mdc-button mdc-button--unelevated"
          type="button"
          onClick={() => this.handleChangeStage(FORM_STAGE)}
        >
          I understand
        </button>
        <button
          className="mdc-button ml2"
          type="button"
          onClick={() => this.handleChangeStage(INFO_STAGE)}
        >
          Cancel
        </button>
      </React.Fragment>
    )
  }

  renderForm() {
    const {error, username} = this.state

    return (
      <form
        className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12"
        onSubmit={this.handleSubmit}
      >
        <TextField
          className="rn-form__input"
          label="New username"
          floatingLabelClassName="mdc-floating-label--float-above"
          helperText={
            <HelperText persistent validation={!username.valid}>
              {username.valid
              ? "Your name by which other users will know you."
              : "Usernames must be less than 40 characters, and may only " +
                "contain alphanumeric characters or hyphens. Cannot have " +
                "multiple consecutive hyphens, and begin or end with a hyphen."}
            </HelperText>
          }
          inputProps={{
            name: "username",
            value: username.value,
            required: true,
            pattern: "^([a-zA-Z0-9]+-)*[a-zA-Z0-9]+$",
            maxLength: 39,
            onChange: this.handleChange,
          }}
        />
        <div className="mt2">
          <button
            type="submit"
            className="mdc-button mdc-button--unelevated"
          >
            Change username
          </button>
          <button
            className="mdc-button ml2"
            type="button"
            onClick={() => this.handleChangeStage(INFO_STAGE)}
          >
            Cancel
          </button>
        </div>
        <div className="mt2">
          <ErrorText error={error} />
        </div>
      </form>
    )
  }
}

export default createFragmentContainer(ChangeUsername, graphql`
  fragment ChangeUsername_user on User {
    login
  }
`)
