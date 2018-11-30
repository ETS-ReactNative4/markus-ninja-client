import * as React from 'react'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import List from 'components/mdc/List'
import Dialog from 'components/Dialog'
import Icon from 'components/Icon'
import Menu, {Corner} from 'components/mdc/Menu'
import DeleteEmailMutation from 'mutations/DeleteEmailMutation'
import RequestEmailVerificationMutation from 'mutations/RequestEmailVerificationMutation'
import {filterDefinedReactChildren, get} from 'utils'

class ViewerEmail extends React.Component {
  state = {
    anchorElement: null,
    confirmDeleteDialogOpen: false,
    error: null,
    menuOpen: false,
  }

  setAnchorElement = (el) => {
    if (this.state.anchorElement) {
      return
    }
    this.setState({anchorElement: el})
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
    const {anchorElement, menuOpen} = this.state
    const email = get(this.props, "email", {})

    return (
      <React.Fragment>
        <li className="ViewerEmail rn-list-preview">
          <span className="mdc-list-item">
            <Icon as="span" className="mdc-list-item__graphic" icon="email" />
            <div className="mdc-list-item__text">
              {email.value}
            </div>
            <span className="mdc-list-item__meta rn-list-preview__actions">
              <span className="rn-list-preview__actions--spread">
                <span className="mdc-button mdc-button--unelevated mdc-theme--secondary-bg">
                  {email.type}
                </span>
                {email.isVerified
                ? <i
                    className="material-icons rn-list-preview__action rn-list-preview__action--icon"
                    aria-label="Verified"
                    title="Verified"
                  >
                    verified_user
                  </i>
                : <button
                    className="material-icons mdc-icon-button rn-list-preview__action rn-list-preview__action--icon"
                    onClick={this.handleRequestVerification}
                    aria-label="Request verification"
                    title="Request verification"
                  >
                    email
                  </button>}
                {email.viewerCanDelete &&
                <button
                  className="material-icons mdc-icon-button rn-list-preview__action--icon"
                  type="button"
                  onClick={this.handleToggleDeleteConfirmation}
                  aria-label="Delete email"
                  title="Delete email"
                >
                  delete
                </button>}
              </span>
              <Menu.Anchor className="rn-list-preview__actions--collapsed" innerRef={this.setAnchorElement}>
                <button
                  type="button"
                  className="mdc-icon-button material-icons"
                  onClick={() => this.setState({menuOpen: !menuOpen})}
                >
                  more_vert
                </button>
                <Menu
                  open={menuOpen}
                  onClose={() => this.setState({menuOpen: false})}
                  anchorElement={anchorElement}
                  anchorCorner={Corner.BOTTOM_LEFT}
                >
                  {this.renderMenuList()}
                </Menu>
              </Menu.Anchor>
            </span>
          </span>
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

  renderMenuList() {
    const email = get(this.props, "email", {})

    const listItems = [
      email.viewerCanDelete &&
      <List.Item
        role="button"
        onClick={this.handleToggleDeleteConfirmation}
      >
        <List.Item.Graphic
          graphic={<Icon className="mdc-theme--text-icon-on-background" icon="delete" />}
        />
        <List.Item.Text primaryText="Delete" />
      </List.Item>,
      <List.Item className="mdc-theme--secondary">
        <List.Item.Graphic
          graphic={<Icon className="mdc-theme--text-icon-on-background" icon="email" />}
        />
        <List.Item.Text primaryText={email.type} />
      </List.Item>,
      email.isVerified
      ? <List.Item className="mdc-theme--text-primary-on-light">
          <List.Item.Graphic
            graphic={<Icon className="mdc-theme--text-icon-on-background" icon="verified_user" />}
          />
          <List.Item.Text primaryText="Verified" />
        </List.Item>
      : <List.Item
          role="button"
          onClick={this.handleRequestVerification}
        >
          <List.Item.Graphic
            graphic={<Icon className="mdc-theme--text-icon-on-background" icon="send" />}
          />
          <List.Item.Text primaryText="Request verification" />
        </List.Item>,
    ]

    return <List items={filterDefinedReactChildren(listItems)} />
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
