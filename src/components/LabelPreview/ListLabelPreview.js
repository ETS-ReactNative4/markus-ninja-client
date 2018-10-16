import * as React from 'react'
import cls from 'classnames'
import Dialog from 'components/Dialog'
import Icon from 'components/Icon'
import LabelLink from 'components/LabelLink'
import DeleteLabelMutation from 'mutations/DeleteLabelMutation'
import {get, isNil} from 'utils'

class ListLabelPreview extends React.Component {
  state = {
    error: null,
    confirmDeleteDialogOpen: false,
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

  get classes() {
    const {className} = this.props
    return cls("ListLabelPreview mdc-list-item", className)
  }

  render() {
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
          </span>
        </li>
        {label.viewerCanDelete && this.renderConfirmDeleteDialog()}
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
