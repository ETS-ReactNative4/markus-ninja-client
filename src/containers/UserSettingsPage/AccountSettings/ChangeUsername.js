import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import TextField, {Input} from '@material/react-text-field'
import UpdateViewerAccountMutation from 'mutations/UpdateViewerAccountMutation'
import { get, isNil } from 'utils'

const INFO_STAGE = 'info'
const AGREEMENT_STAGE = 'agreement'
const FORM_STAGE = 'form'

class ChangeUsername extends React.Component {
  state = {
    error: null,
    stage: INFO_STAGE,
    username: get(this.props, "user.login", ""),
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { username } = this.state
    UpdateViewerAccountMutation(
      username,
      null,
      null,
      (error) => {
        if (!isNil(error)) {
          this.setState({ error: error.message })
        }
      },
    )
  }

  handleChangeStage = (stage = INFO_STAGE) => {
    this.setState({ stage })
  }

  get classes() {
    const {className} = this.props
    const {stage} = this.state
    return cls("ChangeUsername mdc-layout-grid__inner", className, {
      [stage]: true,
    })
  }

  render() {
    const {stage} = this.state

    return (
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
    )
  }

  renderInfo() {
    return (
      <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
        <p>Changing your username can have unintended side effects.</p>
        <button
          className="mdc-button mdc-button--unelevated mt2"
          type="button"
          onClick={() => this.handleChangeStage(AGREEMENT_STAGE)}
        >
          Change username
        </button>
      </div>
    )
  }

  renderAgreement() {
    return (
      <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
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
          I understand, change my username
        </button>
        <button
          className="mdc-button mdc-button--outlined ml2"
          type="button"
          onClick={() => this.handleChangeStage(INFO_STAGE)}
        >
          Cancel
        </button>
      </div>
    )
  }

  renderForm() {
    const {username} = this.state

    return (
      <form
        className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12"
        onSubmit={this.handleSubmit}
      >
        <TextField
          className="rn-form__input"
          outlined
          label="New username"
          floatingLabelClassName="mdc-floating-label--float-above"
        >
          <Input
            name="username"
            value={username}
            onChange={this.handleChange}
          />
        </TextField>
        <div className="mt2">
          <button
            className="mdc-button mdc-button--unelevated"
            type="submit"
          >
            Change username
          </button>
          <button
            className="mdc-button mdc-button--outlined ml2"
            type="button"
            onClick={() => this.handleChangeStage(INFO_STAGE)}
          >
            Cancel
          </button>
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
