import * as React from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import Dialog from 'components/Dialog'
import Icon from 'components/Icon'
import DeleteEmailMutation from 'mutations/DeleteEmailMutation'
import RequestEmailVerificationMutation from 'mutations/RequestEmailVerificationMutation'
import { get } from 'utils'

class ViewerEmail extends React.Component {
  state = {
    confirmDeleteDialogOpen: false,
    error: null,
  }

  handleDelete = (e) => {
    e.preventDefault()
    DeleteEmailMutation(
      get(this.props,  "email.id", ""),
      (errors) => {
        if (errors) {
          this.setState({ error: errors[0].message })
          return
        }
      },
    )
  }

  handleRequestVerification = (e) => {
    e.preventDefault()
    RequestEmailVerificationMutation(
      get(this.props,  "email.value", ""),
      (errors) => {
        if (errors) {
          this.setState({ error: errors[0].message })
          return
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

  get canDelete() {
    const emailType = get(this.props, "email.type", "")
    return emailType !== 'PRIMARY'
  }

  render() {
    const email = get(this.props, "email", {})
    return (
      <React.Fragment>
        <li className="ViewerEmail mdc-list-item">
          <Icon as="span" className="mdc-list-item__graphic" icon="email" />
          <div className="mdc-list-item__text">
            {email.value}
          </div>
          <div className="mdc-list-item__meta">
            <div className="mdc-list-item__meta-actions">
              <span className="mdc-button mdc-button--outlined mdc-list-item__meta-action mdc-list-item__meta-action--button">
                {email.type}
              </span>
              {email.isVerified
              ? <i
                  className="material-icons mdc-list-item__meta-action mdc-list-item__meta-action--icon"
                  aria-label="Verified"
                  title="Verified"
                >
                  verified_user
                </i>
              : <button
                  className="material-icons mdc-list-item__meta-action mdc-list-item__meta-action--icon"
                  onClick={this.handleRequestVerification}
                  aria-label="Request verification"
                  title="Request verification"
                >
                  email
                </button>}
              {email.viewerCanDelete &&
              <button
                className="material-icons mdc-icon-button mdc-list-item__meta-action--icon"
                type="button"
                onClick={this.handleToggleDeleteConfirmation}
                aria-label="Delete email"
                title="Delete email"
              >
                delete
              </button>}
            </div>
          </div>
        </li>
        {this.renderConfirmDeleteDialog()}
      </React.Fragment>
    )
  }

  renderConfirmDeleteDialog() {
    const {confirmDeleteDialogOpen} = this.state

    return (
      <Dialog
        open={confirmDeleteDialogOpen}
        onClose={() => this.setState({confirmDeleteDialogOpen: false})}
        title={<Dialog.Title>Delete email</Dialog.Title>}
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

export default createFragmentContainer(ViewerEmail, graphql`
  fragment ViewerEmail_email on Email {
    id
    isVerified
    type
    value
    viewerCanDelete
  }
`)
