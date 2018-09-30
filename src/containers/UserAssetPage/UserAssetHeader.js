import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router-dom';
import TextField, {Input} from '@material/react-text-field'
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
    return cls("UserAssetHeader mdc-layout-grid__inner", className)
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
      <form
        className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12"
        onSubmit={this.handleSubmit}
      >
        <div className="inline-flex items-center w-100">
          <TextField
            className="flex-auto"
            outlined
            label="Name"
            floatingLabelClassName={"mdc-floating-label--float-above"}
          >
            <Input
              name="name"
              value={name}
              onChange={this.handleChange}
            />
          </TextField>
          <button
            className="mdc-button mdc-button--unelevated ml2"
            type="submit"
            onClick={this.handleSubmit}
          >
            Save
          </button>
          <span
            className="pointer pa2"
            role="button"
            onClick={this.handleToggleOpen}
          >
            Cancel
          </span>
        </div>
      </form>
      )
    }

  renderDetails() {
    const asset = get(this.props, "asset", {})

    return (
      <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
        <div className="inline-flex w-100">
          <h5 className="flex-auto">
            <UserLink className="rn-link" user={get(asset, "study.owner", null)} />
            <span>/</span>
            <StudyLink className="rn-link" study={get(asset, "study", null)} />
            <span>/</span>
            <i className="material-icons v-mid mr1">image</i>
            <span className="fw5">{asset.name}</span>
          </h5>
          {asset.viewerCanUpdate &&
          <button
            className="material-icons mdc-icon-button"
            type="button"
            onClick={this.handleToggleOpen}
          >
            edit
          </button>}
        </div>
      </div>
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
