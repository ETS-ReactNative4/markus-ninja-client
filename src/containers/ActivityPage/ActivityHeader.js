import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import TextField, {defaultTextFieldState} from 'components/TextField'
import Icon from 'components/Icon'
import Snackbar from 'components/mdc/Snackbar'
import StudyLink from 'components/StudyLink'
import UserLink from 'components/UserLink'
import UpdateActivityMutation from 'mutations/UpdateActivityMutation'
import {get, isEmpty, throttle} from 'utils'

class ActivityHeader extends React.Component {
  state = {
    error: null,
    open: false,
    name: {
      ...defaultTextFieldState,
      value: get(this.props, "activity.name", ""),
      valid: true,
    },
    showSnackbar: false,
    snackbarMessage: "",
  }

  handleChange = (field) => {
    this.setState({
      [field.name]: field,
    })
  }

  handleSubmit = throttle((e) => {
    e.preventDefault()
    const { name } = this.state
    UpdateActivityMutation(
      this.props.activity.id,
      null,
      name.value,
      (updatedActivity, errors) => {
        if (errors) {
          this.setState({
            error: errors[0].message,
            showSnackbar: true,
            snackbarMessage: "Something went wrong",
          })
          return
        }
        this.setState({
          name: get(updatedActivity, "name", ""),
          showSnackbar: true,
          snackbarMessage: "Name updated",
        })
        this.handleToggleEditName()
      },
    )
  }, 2000)

  handleCancelEditName = () => {
    this.handleToggleEditName()
    this.reset_()
  }

  handleToggleEditName = () => {
    this.setState({ open: !this.state.open })
  }

  reset_ = () => {
    const activity = get(this.props, "activity", {})
    this.setState({
      error: null,
      name: {
        ...defaultTextFieldState,
        value: activity.name,
        valid: true,
      },
    })
  }

  get classes() {
    const {className} = this.props
    return cls("mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const activity = get(this.props, "activity", {})
    const {open, showSnackbar, snackbarMessage} = this.state

    return (
      <div className={this.classes}>
        {open && activity.viewerCanAdmin
        ? this.renderForm()
        : this.renderHeader()}
        <Snackbar
          show={showSnackbar}
          message={snackbarMessage}
          actionHandler={() => this.setState({showSnackbar: false})}
          actionText="ok"
          handleHide={() => this.setState({showSnackbar: false})}
        />
      </div>
    )
  }

  renderForm() {
    const {name} = this.state

    return (
      <form onSubmit={this.handleSubmit}>
        <div className="rn-text-field">
          <div className="rn-text-field__input">
            <TextField
              className="flex-auto"
              label="Name"
              floatingLabelClassName={!isEmpty(name) ? "mdc-floating-label--float-above" : ""}
              inputProps={{
                name: "name",
                value: name.value,
                onChange: this.handleChange,
              }}
            />
          </div>
          <div className="rn-text-field__actions">
            <button
              type="submit"
              className="mdc-button mdc-button--unelevated rn-text-field__action rn-text-field__action--button"
            >
              Save
            </button>
            <button
              className="mdc-button rn-text-field__action rn-text-field__action--button"
              type="button"
              onClick={this.handleCancelEditName}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    )
  }

  renderHeader() {
    const activity = get(this.props, "activity", null)

    return (
      <header className="rn-header rn-header--title">
        <h4 className="rn-header__text rn-file-path">
          <UserLink className="rn-link rn-file-path__directory" user={get(activity, "study.owner", null)} />
          <span className="rn-file-path__separator">/</span>
          <StudyLink className="rn-link rn-file-path__directory" study={get(activity, "study", null)} />
          <span className="rn-file-path__separator">/</span>
          <span className="rn-file-path__file">
            <span className="rn-file-path__file__text">
              <Icon className="v-mid mr1" icon="activity" />
              <span className="fw5">{get(activity, "name", "")}</span>
              <span className="mdc-theme--text-hint-on-light ml2">#{get(activity, "number", 0)}</span>
            </span>
            {activity.viewerCanAdmin &&
            <button
              className="material-icons mdc-icon-button rn-file-path__file__icon"
              type="button"
              onClick={this.handleToggleEditName}
              aria-label="Edit name"
              title="Edit name"
            >
              edit
            </button>}
          </span>
        </h4>
      </header>
    )
  }
}

export default createFragmentContainer(ActivityHeader, graphql`
  fragment ActivityHeader_activity on Activity {
    advancedAt
    createdAt
    id
    name
    number
    resourcePath
    study {
      ...StudyLink_study
      owner {
        ...UserLink_user
      }
    }
    updatedAt
    viewerCanAdmin
  }
`)
