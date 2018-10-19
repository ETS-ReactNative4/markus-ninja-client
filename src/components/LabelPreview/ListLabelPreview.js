import * as React from 'react'
import cls from 'classnames'
import Dialog from 'components/Dialog'
import Icon from 'components/Icon'
import LabelLink from 'components/LabelLink'
import DeleteLabelMutation from 'mutations/DeleteLabelMutation'
import UpdateLabelDialog from './UpdateLabelDialog'
import {get, isNil} from 'utils'

class ListLabelPreview extends React.Component {
  state = {
    confirmDeleteDialogOpen: false,
    error: null,
    editDialogOpen: false,
  }

  handleDelete = () => {
    DeleteLabelMutation(
      this.props.label.id,
      (response, errors) => {
        if (!isNil(errors)) {
          this.setState({ error: errors[0].message })
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

  handleToggleEdit = () => {
    const {editDialogOpen} = this.state
    this.setState({
      editDialogOpen: !editDialogOpen,
    })
  }

  get classes() {
    const {className} = this.props
    return cls("ListLabelPreview mdc-list-item", className)
  }

  render() {
    const {editDialogOpen} = this.state
    const label = get(this.props, "label", {})
    return (
      <React.Fragment>
        <li className={this.classes}>
          <Icon as="span" className="mdc-list-item__graphic" icon="label" />
          <span className="mdc-list-item__text">
            <LabelLink label={label} />
            <span className="ml2">
              {label.description}
            </span>
          </span>
          <span className="mdc-list-item__meta">
            {label.viewerCanDelete &&
            <button
              className="material-icons mdc-icon-button"
              type="button"
              onClick={this.handleToggleDeleteConfirmation}
              aria-label="Delete label"
              title="Delete label"
            >
              delete
            </button>}
            {label.viewerCanUpdate &&
            <button
              className="material-icons mdc-icon-button"
              type="button"
              onClick={this.handleToggleEdit}
              aria-label="Edit label"
              title="EditDelete label"
            >
              edit
            </button>}
          </span>
        </li>
        {label.viewerCanDelete && this.renderConfirmDeleteDialog()}
        {label.viewerCanUpdate &&
        <UpdateLabelDialog
          open={editDialogOpen}
          label={label}
          onClose={() => this.setState({editDialogOpen: false})}
        />}
      </React.Fragment>
    )
  }

  renderConfirmDeleteDialog() {
    const {confirmDeleteDialogOpen} = this.state

    return (
      <Dialog
        open={confirmDeleteDialogOpen}
        onClose={() => this.setState({confirmDeleteDialogOpen: false})}
        title={<Dialog.Title>Delete label</Dialog.Title>}
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

export default ListLabelPreview
