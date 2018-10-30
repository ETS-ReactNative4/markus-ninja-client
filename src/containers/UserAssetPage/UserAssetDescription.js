import * as React from 'react'
import PropTypes from 'prop-types'
import TextField, {defaultTextFieldState} from 'components/TextField'
import HTML from 'components/HTML'
import UpdateUserAssetMutation from 'mutations/UpdateUserAssetMutation'
import {get, isEmpty, isNil} from 'utils'

class UserAssetDescription extends React.Component {
  state = {
    error: null,
    open: false,
    description: {
      ...defaultTextFieldState,
      value: this.props.asset.description,
      valid: true,
    }
  }

  handleChange = (field) => {
    this.setState({
      [field.name]: field,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const {description} = this.state
    UpdateUserAssetMutation(
      this.props.asset.id,
      description.value,
      null,
      (updatedUserAsset, errors) => {
        if (!isNil(errors)) {
          this.setState({ error: errors[0].message })
        }
        this.handleToggleOpen()
        this.setState({
          description: get(updatedUserAsset, "description", ""),
        })
      },
    )
  }


  handleToggleOpen = () => {
    this.setState({ open: !this.state.open })
    this.reset_()
  }

  reset_ = () => {
    const asset = get(this.props, "asset", {})
    this.setState({
      error: null,
      description: {
        ...defaultTextFieldState,
        value: asset.description,
        valid: true,
      },
    })
  }

  render() {
    const {open} = this.state

    return (
      <div className="mdc-typography--body2 pl3 pr2 pb2">
        {open
        ? this.renderForm()
        : this.renderDetails()}
      </div>
    )
  }

  renderForm() {
    const {description} = this.state

    return (
      <form onSubmit={this.handleSubmit}>
        <TextField
          className="w-100"
          label="Add a description"
          textarea
          floatingLabelClassName={!isEmpty(description) ? "mdc-floating-label--float-above" : ""}
          inputProps={{
            name: "description",
            value: description.value,
            onChange: this.handleChange,
          }}
        />
        <div className="inline-flex items-center mt2">
          <button
            type="submit"
            className="mdc-button mdc-button--unelevated"
          >
            Save
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

  renderDetails() {
    const asset = get(this.props, "asset", {})

    return (
      <div className="flex items-center w-100">
        {isEmpty(asset.description)
        ? <div className="mdc-theme--text-secondary-on-light">No description provided</div>
        : <HTML html={asset.descriptionHTML} />}
        <div className="ml-auto">
          {asset.viewerCanUpdate &&
          <button
            className="mdc-icon-button material-icons mdc-theme--text-icon-on-background"
            type="button"
            onClick={this.handleToggleOpen}
            aria-label="Edit description"
            title="Edit description"
          >
            edit
          </button>}
        </div>
      </div>
    )
  }
}

UserAssetDescription.propTypes = {
  asset: PropTypes.shape({
    description: PropTypes.string.isRequired,
    descriptionHTML: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
  }).isRequired,
}


UserAssetDescription.defaultProps = {
  asset: {
    description: "",
    descriptionHTML: "",
    id: "",
  },
}

export default UserAssetDescription
