import * as React from 'react'
import PropTypes from 'prop-types'
import TextField, {Input} from '@material/react-text-field'
import HTML from 'components/HTML'
import UpdateUserAssetMutation from 'mutations/UpdateUserAssetMutation'
import {get, isEmpty, isNil} from 'utils'

class UserAssetDescription extends React.Component {
  state = {
    error: null,
    open: false,
    description: this.props.asset.description,
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const {description} = this.state
    UpdateUserAssetMutation(
      this.props.asset.id,
      description,
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
  }

  render() {
    const {open} = this.state

    return (
      <div className="mdc-typography--body2 ph3 pb2">
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
        >
          <Input
            name="description"
            value={description}
            onChange={this.handleChange}
          />
        </TextField>
        <div className="inline-flex items-center mt2">
          <button
            className="mdc-button mdc-button--unelevated"
            type="submit"
            onClick={this.handleSubmit}
          >
            Save
          </button>
          <button
            className="mdc-button mdc-button--outlined ml2"
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
        <div className="truncate">
          {isEmpty(asset.description)
          ? <div className="mdc-theme--text-secondary-on-light">No description provided</div>
          : <HTML html={asset.descriptionHTML} />}
        </div>
        <div className="ml-auto">
          {asset.viewerCanUpdate &&
          <button
            className="mdc-icon-button material-icons"
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
