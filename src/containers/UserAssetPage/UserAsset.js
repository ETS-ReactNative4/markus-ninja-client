import * as React from 'react'
import cls from 'classnames'
import moment from 'moment'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import {Link, withRouter} from 'react-router-dom'
import Dialog from 'components/Dialog'
import DeleteUserAssetMutation from 'mutations/DeleteUserAssetMutation'
import UserAssetDescription from './UserAssetDescription'
import {byteSizeToString, get, isNil} from 'utils'

class UserAsset extends React.Component {
  state = {
    confirmDeleteDialogOpen: false,
  }

  handleDelete = () => {
    DeleteUserAssetMutation(
      this.props.asset.id,
      (_, errors) => {
        if (!isNil(errors)) {
          this.setState({ error: errors[0].message })
        } else {
          this.props.history.push(
            get(this.props, "asset.study.resourcePath", "") + "/assets"
          )
        }
      },
    )
  }

  handleToggleDeleteConfirmation = () => {
    const {confirmDeleteDialogOpen} = this.state
    this.setState({
      confirmDeleteDialogOpen: !confirmDeleteDialogOpen,
    })
  }

  get classes() {
    const {className} = this.props
    return cls("UserAsset mdc-card", className)
  }

  render() {
    const asset = get(this.props, "asset", {})
    return (
      <div className={this.classes}>
        <div
          className="mdc-card__media mdc-card__media--16-9"
          style={{
            backgroundImage: `url("${asset.href}")`,
          }}
        />
        <div className="pa3">
          <h6>{asset.name}</h6>
          <div className="mdc-typography--subtitle2 mdc-theme--text-secondary-on-light">
            <div>
              Added on
              <span className="mh1">{moment(asset.createdAt).format("MMM D, YYYY")}</span>
              by
              <Link
                className="rn-link rn-link--secondary ml1"
                to={get(asset, "resourcePath", "")}
              >
                {get(asset, "owner.login", "")}
              </Link>
            </div>
            <div>{asset.type}/{asset.subtype}</div>
            <div>{byteSizeToString(asset.size)}</div>
          </div>
        </div>
        <UserAssetDescription asset={asset} />
        <div className="mdc-card__actions">
          <div className="mdc-card__action-buttons">
            <a
              className="mdc-button mdc-card__action mdc-card__action--button"
              href={asset.href}
              target="_blank"
            >
              View
            </a>
          </div>
          <div className="mdc-card__action-icons">
            {asset.viewerCanDelete &&
            <button
              className="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon"
              type="button"
              onClick={this.handleToggleDeleteConfirmation}
              aria-label="Delete asset"
              title="Delete asset"
            >
              delete
            </button>}
          </div>
        </div>
        {asset.viewerCanDelete && this.renderConfirmDeleteDialog()}
      </div>
    )
  }

  renderConfirmDeleteDialog() {
    const {confirmDeleteDialogOpen} = this.state

    return (
      <Dialog
        open={confirmDeleteDialogOpen}
        onClose={() => this.setState({confirmDeleteDialogOpen: false})}
        title={<Dialog.Title>Delete asset</Dialog.Title>}
        content={
          <Dialog.Content>
            <div className="flex flex-column mw5">
              <p>Are you sure?</p>
            </div>
          </Dialog.Content>
        }
        actions={
          <Dialog.Actions>
            <button
              type="button"
              className="mdc-button"
              data-mdc-dialog-action="no"
            >
              No
            </button>
            <button
              type="button"
              className="mdc-button"
              onClick={this.handleDelete}
              data-mdc-dialog-action="yes"
            >
              Yes
            </button>
          </Dialog.Actions>}
        />
    )
  }
}

export default withRouter(createFragmentContainer(UserAsset, graphql`
  fragment UserAsset_asset on UserAsset {
    id
    createdAt
    description
    descriptionHTML
    href
    name
    owner {
      login
      resourcePath
    }
    size
    study {
      resourcePath
    }
    subtype
    type
    viewerCanDelete
    viewerCanUpdate
  }
`))
