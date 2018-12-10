import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import moment from 'moment'
import Dialog from 'components/Dialog'
import Snackbar from 'components/mdc/Snackbar'
import StudyBodyEditor from 'components/StudyBodyEditor'
import UserLink from 'components/UserLink'
import Icon from 'components/Icon'
import List from 'components/mdc/List'
import Menu, {Corner} from 'components/mdc/Menu'
import DeleteLessonCommentMutation from 'mutations/DeleteLessonCommentMutation'
import PublishLessonCommentDraftMutation from 'mutations/PublishLessonCommentDraftMutation'
import ResetLessonCommentDraftMutation from 'mutations/ResetLessonCommentDraftMutation'
import UpdateLessonCommentMutation from 'mutations/UpdateLessonCommentMutation'
import {
  debounce,
  filterDefinedReactChildren,
  get,
  timeDifferenceForDate,
} from 'utils'

class LessonComment extends React.Component {
  state = {
    anchorElement: null,
    confirmDeleteDialogOpen: false,
    edit: false,
    error: null,
    draft: {
      dirty: false,
      initialValue: get(this.props, "comment.draft", ""),
      value: get(this.props, "comment.draft", ""),
    },
    menuOpen: false,
    showSnackbar: false,
    snackbarMessage: "",
  }

  setAnchorElement = (el) => {
    if (this.state.anchorElement) {
      return
    }
    this.setState({anchorElement: el})
  }

  updateDraft = debounce((draft) => {
    UpdateLessonCommentMutation(
      this.props.comment.id,
      draft,
      (comment, errors) => {
        if (errors) {
          this.setState({
            error: errors[0].message,
            draft: {
              ...this.state.draft,
              dirty: false,
              value: this.state.draft.initialValue,
            },
            showSnackbar: true,
            snackbarMessage: "Failed to save draft",
          })
          return
        } else if (comment) {
          this.setState({
            draft: {
              ...this.state.draft,
              dirty: false,
              value: comment.draft
            },
          })
        }
      },
    )
  }, 1000)

  handleCancel = () => {
    const {draft} = this.state
    if (draft.dirty) {
      this.updateDraft(draft.initialValue)
    }
    this.handleToggleEdit()
  }

  handleChange = (value) => {
    const {draft} = this.state
    const dirty = draft.dirty || value !== draft.value
    this.setState({
      draft: {
        dirty,
        value,
      },
    })
    if (dirty) {
      this.updateDraft(value)
    }
  }

  handleDelete = () => {
    DeleteLessonCommentMutation(
      this.props.comment.id,
    )
  }

  handlePreview = () => {
    const {draft} = this.state
    if (draft.dirty) {
      this.updateDraft(draft.value)
    }
  }

  handlePublish = () => {
    PublishLessonCommentDraftMutation(
      this.props.comment.id,
      (comment, errors) => {
        if (errors) {
          this.setState({
            error: errors[0].message,
            showSnackbar: true,
            snackbarMessage: "Failed to publish comment",
          })
          return
        }
        this.setState({
          showSnackbar: true,
          snackbarMessage: "Comment published",
        })
        this.handleToggleEdit()
      },
    )
  }

  handleReset = () => {
    ResetLessonCommentDraftMutation(
      this.props.comment.id,
      (comment, errors) => {
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

  handleToggleEdit = () => {
    this.setState({
      // reset anchorElement when switching between modes
      anchorElement: null,
      edit: !this.state.edit,
    })
  }

  get classes() {
    const {className} = this.props
    return cls("LessonComment", className)
  }

  get isPublishable() {
    const comment = get(this.props, "comment", {})
    const {draft} = this.state

    return !draft.dirty &&
      moment(comment.lastEditedAt).isAfter(comment.publishedAt) &&
      draft.value.trim() !== ""
  }

  render() {
    const comment = get(this.props, "comment", {})
    const study = get(comment, "study", null)
    const {anchorElement, edit, menuOpen, showSnackbar, snackbarMessage} = this.state

    return (
      <div className={this.classes}>
        <StudyBodyEditor study={study}>
          <StudyBodyEditor.Main
            placeholder="Leave a comment"
            bodyHeaderText={
              <React.Fragment>
                <UserLink className="rn-link rn-link--secondary" user={get(comment, "author", null)} />
                <span className="ml1">commented {timeDifferenceForDate(comment.createdAt)}</span>
              </React.Fragment>
            }
            bottomActions={(comment.viewerDidAuthor || comment.viewerCanUpdate || comment.viewerCanDelete) &&
              <div className="mdc-card__actions rn-card__actions">
                {comment.viewerDidAuthor &&
                <div className="mdc-card__action-buttons">
                  <button
                    className="mdc-button mdc-card__action mdc-card__action--button"
                    disabled
                  >
                    Author
                  </button>
                </div>}
                {comment.viewerCanUpdate && edit &&
                <div className="mdc-card__action-buttons">
                  <button
                    type="button"
                    className="mdc-button mdc-card__action mdc-card__action--button"
                    onClick={this.handlePublish}
                    disabled={!this.isPublishable}
                  >
                    Publish
                  </button>
                </div>}
                {comment.viewerCanDelete &&
                <div className="mdc-card__action-icons rn-card__actions--spread">
                  <button
                    className="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon"
                    type="button"
                    onClick={this.handleToggleDeleteConfirmation}
                    aria-label="Delete comment"
                    title="Delete comment"
                  >
                    delete
                  </button>
                </div>}
                {comment.viewerCanDelete &&
                <Menu.Anchor
                  className="mdc-card__action-icons rn-card__actions--collapsed"
                  innerRef={this.setAnchorElement}
                >
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
                </Menu.Anchor>}
              </div>
            }
            edit={edit}
            isPublishable={this.isPublishable}
            handleCancel={this.handleCancel}
            handleChange={this.handleChange}
            handlePreview={this.handlePreview}
            handlePublish={this.handlePublish}
            handleReset={this.handleReset}
            handleToggleEdit={this.handleToggleEdit}
            object={comment}
            study={study}
          />
        </StudyBodyEditor>
        {comment.viewerCanDelete && this.renderConfirmDeleteDialog()}
        <Snackbar
          show={showSnackbar}
          message={snackbarMessage}
          actionHandler={() => this.setState({showSnackbar: false})}
          actionText="ok"
          handleHide={() => this.setState({showSnackbar: false})}
        />
      </div>
    )
  }

  renderMenuList() {
    const comment = get(this.props, "comment", {})

    const listItems = [
      comment.viewerCanDelete &&
      <List.Item
        role="button"
        onClick={this.handleToggleDeleteConfirmation}
      >
        <List.Item.Graphic graphic={<Icon icon="delete" />}/>
        <List.Item.Text primaryText="Delete comment" />
      </List.Item>,
    ]

    return <List items={filterDefinedReactChildren(listItems)} />
  }

  renderConfirmDeleteDialog() {
    const {confirmDeleteDialogOpen} = this.state

    return (
      <Dialog
        open={confirmDeleteDialogOpen}
        onClose={() => this.setState({confirmDeleteDialogOpen: false})}
        title={<Dialog.Title>Delete comment</Dialog.Title>}
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

export default createFragmentContainer(LessonComment, graphql`
  fragment LessonComment_comment on LessonComment {
    author {
      ...UserLink_user
    }
    bodyHTML
    createdAt
    draft
    id
    isPublished
    lastEditedAt
    publishedAt
    study {
      ...StudyBodyEditor_study
    }
    updatedAt
    viewerCanDelete
    viewerCanUpdate
    viewerDidAuthor
  }
`)
