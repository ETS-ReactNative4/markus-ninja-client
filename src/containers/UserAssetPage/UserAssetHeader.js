import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { withRouter } from 'react-router-dom';
import getHistory from 'react-router-global-history'
import Icon from 'components/Icon'
import Snackbar from 'components/mdc/Snackbar'
import StudyLink from 'components/StudyLink'
import UserLink from 'components/UserLink'
import UserAssetNameInput, {defaultUserAssetNameState} from 'components/UserAssetNameInput'
import UpdateUserAssetMutation from 'mutations/UpdateUserAssetMutation'
import {get, isNil} from 'utils'

class UserAssetHeader extends React.Component {
  state = {
    error: null,
    open: false,
    name: {
      ...defaultUserAssetNameState,
      value: get(this.props, "asset.name", ""),
      valid: true,
    },
    showSnackbar: false,
    snackbarMessage: "",
  }

  handleChangeField = (field) => {
    this.setState({
      [field.name]: field,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const {name} = this.state
    UpdateUserAssetMutation(
      this.props.asset.id,
      null,
      name.value,
      (updatedUserAsset, errors) => {
        if (!isNil(errors)) {
          this.setState({
            error: errors[0].message,
            showSnackbar: true,
            snackbarMessage: "Something went wrong",
          })
          return
        }
        this.setState({
          name: {
            value: get(updatedUserAsset, "name", ""),
            valid: true,
          },
          showSnackbar: true,
          snackbarMessage: "Name updated",
        })
        this.handleToggleEditName()
        getHistory().push(updatedUserAsset.resourcePath)
      },
    )
  }

  handleCancelEditName = () => {
    this.handleToggleEditName()
    this.reset_()
  }

  handleToggleEditName = () => {
    this.setState({ open: !this.state.open })
  }

  reset_ = () => {
    const asset = get(this.props, "asset", {})
    this.setState({
      error: null,
      name: {
        ...defaultUserAssetNameState,
        value: asset.name,
        valid: true,
      },
    })
  }

  get classes() {
    const {className} = this.props
    return cls("UserAssetHeader mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const asset = get(this.props, "asset", {})
    const {open, showSnackbar, snackbarMessage} = this.state

    return (
      <div className={this.classes}>
        {open && asset.viewerCanUpdate
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
            <UserAssetNameInput
              initialValue={name.value}
              onChange={this.handleChangeField}
            />
          </div>
          <div className="rn-text-field__actions">
            <button
              className="mdc-button mdc-button--unelevated rn-text-field__action rn-text-field__action--button"
              type="submit"
              onClick={this.handleSubmit}
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
    const asset = get(this.props, "asset", {})

    return (
      <header className="rn-header rn-header--title">
        <h4 className="rn-header__text rn-file-path">
          <UserLink className="rn-link rn-file-path__directory" user={get(asset, "study.owner", null)} />
          <span className="rn-file-path__separator">/</span>
          <StudyLink className="rn-link rn-file-path__directory" study={get(asset, "study", null)} />
          <span className="rn-file-path__separator">/</span>
          <span className="rn-file-path__file">
            <span className="rn-file-path__file__text">
              <Icon className="v-mid mr1" icon="asset" />
              <span className="fw5">{asset.name}</span>
            </span>
            {asset.viewerCanUpdate &&
            <button
              className="material-icons mdc-icon-button rn-file-path__file__icon"
              type="button"
              onClick={this.handleToggleEditName}
            >
              edit
            </button>}
          </span>
        </h4>
      </header>
    )
  }
}

export default withRouter(createFragmentContainer(UserAssetHeader, graphql`
  fragment UserAssetHeader_asset on UserAsset {
    id
    name
    study {
      ...StudyLink_study
      owner {
        ...UserLink_user
      }
    }
    viewerCanUpdate
  }
`))
