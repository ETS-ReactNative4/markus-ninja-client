import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { withRouter } from 'react-router-dom';
import TextField, {Input} from '@material/react-text-field'
import Icon from 'components/Icon'
import StudyLink from 'components/StudyLink'
import UserLink from 'components/UserLink'
import UpdateUserAssetMutation from 'mutations/UpdateUserAssetMutation'
import {get, isNil} from 'utils'

class UserAssetHeader extends React.Component {
  state = {
    error: null,
    open: false,
    name: this.props.asset.name,
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { name } = this.state
    UpdateUserAssetMutation(
      this.props.asset.id,
      null,
      name,
      (updatedUserAsset, errors) => {
        if (!isNil(errors)) {
          this.setState({ error: errors[0].message })
        }
        this.handleToggleOpen()
        this.setState({
          name: get(updatedUserAsset, "name", ""),
        })
        this.props.history.push(updatedUserAsset.resourcePath)
      },
    )
  }

  handleToggleOpen = () => {
    this.setState({ open: !this.state.open })
  }

  get classes() {
    const {className} = this.props
    return cls("UserAssetHeader mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const asset = get(this.props, "asset", {})
    const {open} = this.state

    return (
      <div className={this.classes}>
        {open
        ? asset.viewerCanUpdate && this.renderForm()
        : this.renderDetails()}
      </div>
    )
  }

  renderForm() {
    const {name} = this.state

    return (
      <form onSubmit={this.handleSubmit}>
        <div className="rn-text-field">
          <TextField
            label="Name"
            floatingLabelClassName={"mdc-floating-label--float-above"}
          >
            <Input
              name="name"
              value={name}
              required
              onChange={this.handleChange}
            />
          </TextField>
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
              onClick={this.handleToggleOpen}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
      )
    }

  renderDetails() {
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
              onClick={this.handleToggleOpen}
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
