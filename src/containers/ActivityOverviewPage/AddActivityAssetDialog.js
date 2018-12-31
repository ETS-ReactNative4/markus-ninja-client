import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import TextField, {Icon, Input} from '@material/react-text-field'
import Dialog from 'components/Dialog'
import StudyAssets from 'components/StudyAssets'
import UserAssetPreview from 'components/UserAssetPreview'
import AddActivityAssetMutation from 'mutations/AddActivityAssetMutation'
import {get, isEmpty, throttle} from 'utils'

class Assets extends React.Component {
  state = {
    assetId: "",
  }

  handleSelect = (assetId) => {
    this.setState({assetId})
    this.props.onSelect(assetId)
  }

  render() {
    const {assetId} = this.state
    const {assets} = this.props
    const edges = get(assets, "edges", [])
    const noResults = isEmpty(edges)

    return (
      <ul className="mdc-list">
        {noResults
        ? <li className="mdc-list-item">No assets found</li>
        : edges.map(({node}) => (
            node &&
            <UserAssetPreview.Select
              key={node.id}
              asset={node}
              selected={assetId === node.id}
              onClick={this.handleSelect}
            />
          ))}
      </ul>
    )
  }
}

Assets.propTypes = {
  onSelect: PropTypes.func.isRequired,
}

Assets.defaultProps = {
  onSelect: () => {},
}

class AddActivityAssetDialog extends React.Component {
  state = {
    assetsFetched: false,
    assetId: "",
    loading: false,
    query: "",
  }

  componentDidUpdate(prevProps) {
    const {assetsFetched} = this.state
    if (!assetsFetched && !prevProps.open && this.props.open) {
      this.setState({assetsFetched: true})
    }
  }

  handleCancel = () => {
    this.setState({query: ""})
    this.props.onClose()
  }

  handleChange = (e) => {
    this.setState({
      query: e.target.value,
    })
  }

  handleSelectAsset = (assetId) => {
    this.setState({assetId})
  }

  handleSubmit = throttle((e) => {
    e.preventDefault()
    const { assetId } = this.state

    this.setState({loading: true})

    AddActivityAssetMutation(
      this.props.activity.id,
      assetId,
      (response, errors) => {
        this.setState({loading: false})
        if (errors) {
          this.setState({ error: errors[0].message })
          return
        }
        this.setState({
          assetsFetched: false,
          assetId: "",
          query: "",
        })
      }
    )
  }, 1000)

  get classes() {
    const {className} = this.props
    return cls("AddActivityAssetDialog", className)
  }

  get isLoading() {
    return this.state.loading
  }

  get _filterBy() {
    const {query} = this.state
    return {
      isActivityAsset: false,
      search: query,
    }
  }

  render() {
    const {assetsFetched} = this.state
    const {open} = this.props

    return (
      <Dialog
        className={this.classes}
        open={open}
        onClose={this.handleCancel}
        title={
          <Dialog.Title>
            Add asset to activity
          </Dialog.Title>}
        content={
          <Dialog.Content>
            {this.renderInput()}
            {(open || assetsFetched) &&
            <StudyAssets filterBy={this._filterBy} fragment="select">
              <Assets onSelect={this.handleSelectAsset} />
            </StudyAssets>}
          </Dialog.Content>}
        actions={
          <Dialog.Actions>
            <button
              type="button"
              className="mdc-button"
              data-mdc-dialog-action="close"
            >
              Cancel
            </button>
            <button
              type="button"
              className="mdc-button mdc-button--unelevated"
              disabled={this.isLoading}
              onClick={this.handleSubmit}
              data-mdc-dialog-action="add"
            >
              Add
            </button>
          </Dialog.Actions>}
      />
    )
  }

  renderInput() {
    const {query} = this.state

    return (
      <TextField
        fullWidth
        label="Find an asset..."
        trailingIcon={<Icon><i className="material-icons">search</i></Icon>}
      >
        <Input
          name="query"
          autoComplete="off"
          placeholder="Find an asset..."
          value={query}
          onChange={this.handleChange}
        />
      </TextField>
    )
  }
}

AddActivityAssetDialog.propTypes = {
  onClose: PropTypes.func,
}

AddActivityAssetDialog.defaultProps = {
  onClose: () => {},
}

export default createFragmentContainer(AddActivityAssetDialog, graphql`
  fragment AddActivityAssetDialog_activity on Activity {
    id
    viewerCanAdmin
  }
`)
