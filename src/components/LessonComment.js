import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import moment from 'moment'
import Dialog from 'components/Dialog'
import HTML from 'components/HTML'
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
  filterDefinedReactChildren,
  get,
  throttle,
  timeDifferenceForDate,
} from 'utils'

class LessonComment extends React.Component {
  state = {
    anchorElement: null,
    autoSaving: false,
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

  setAutoSave = () => {
    if (!this.state.autoSaving) {
      this.setState({autoSaving: true})
      this.autoSaveTimeoutId_ = setTimeout(() =>
        this.updateDraft(this.state.draft.value),
        30000,
      )
    }
  }

  clearAutoSave = () => {
    this.setState({autoSaving: false})
    clearTimeout(this.autoSaveTimeoutId_)
  }

  updateDraft = throttle((draft) => {
    if (this.state.draft.dirty) {
      UpdateLessonCommentMutation(
        this.props.comment.id,
        draft,
        (comment, errors) => {
          this.clearAutoSave()
          if (errors) {
            this.setState({
              error: errors[0].message,
              draft: {
                ...this.state.draft,
                dirty: false,
                value: this.state.draft.initialValue,
              },
              showSnackbar: true,
              snackbarMessage: "Something went wrong",
            })
            return
          } else if (comment) {
            this.setState({
              draft: {
                ...this.state.draft,
                dirty: false,
                value: comment.draft
              },
              showSnackbar: true,
              snackbarMessage: "Draft saved",
            })
          }
        },
      )
    }
  }, 2000)

  handleCancel = () => {
    const {draft} = this.state
    this.updateDraft(draft.initialValue)
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
      this.setAutoSave()
    }
  }

  handleDelete = () => {
    DeleteLessonCommentMutation(
      this.props.comment.id,
    )
  }

  handlePreview = () => {
    const {draft} = this.state
    this.updateDraft(draft.value)
  }

  handlePublish = () => {
    PublishLessonCommentDraftMutation(
      this.props.comment.id,
      (comment, errors) => {
        if (errors) {
          this.setState({
            error: errors[0].message,
            showSnackbar: true,
            snackbarMessage: "Something went wrong",
          })
          return
        }
        this.setState({
          showSnackbar: true,
          snackbarMessage: "Draft published",
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

  handleSubmit = (e) => {
    e.preventDefault()
    const {draft} = this.state
    this.updateDraft(draft.value)
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

  render() {
    const comment = get(this.props, "comment", {})
    const {edit, showSnackbar, snackbarMessage} = this.state

    return (
      <div className={this.classes}>
        {edit && comment.viewerCanUpdate
        ? this.renderForm()
        : this.renderComment()}
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

  renderComment() {
    const {anchorElement, menuOpen} = this.state
    const comment = get(this.props, "comment", {})

    return (
      <div
        id={`lesson_comment${moment(comment.createdAt).unix()}`}
        className="mdc-card"
      >
        <div className="rn-card__header">
          <span className="rn-card__overline">
            <UserLink className="rn-link rn-link--secondary" user={get(comment, "author", null)} />
            <span className="ml1">commented {timeDifferenceForDate(comment.createdAt)}</span>
          </span>
        </div>
        <div className="rn-card__body">
          <HTML html={comment.bodyHTML} />
        </div>
        {comment.viewerCanUpdate &&
        <div className="mdc-card__actions rn-card__actions">
          <div className="mdc-card__action-buttons">
            {comment.viewerDidAuthor &&
            <button
              className="mdc-button mdc-button--outlined mdc-card__action mdc-card__action--button"
              disabled
            >
              Author
            </button>}
          </div>
          <div className="mdc-card__action-icons rn-card__actions--spread">
            {comment.viewerCanDelete &&
            <button
              className="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon"
              type="button"
              onClick={this.handleToggleDeleteConfirmation}
              aria-label="Delete comment"
              title="Delete comment"
            >
              delete
            </button>}
            {comment.viewerCanUpdate &&
            <button
              className="material-icons mdc-icon-button mdc-card__action--icon"
              type="button"
              onClick={this.handleToggleEdit}
              aria-label="Edit comment"
              title="Edit comment"
            >
              edit
            </button>}
          </div>
          {(comment.viewerCanDelete || comment.viewerCanUpdate) &&
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
        </div>}
        {comment.viewerCanDelete && this.renderConfirmDeleteDialog()}
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
      comment.viewerCanUpdate &&
      <List.Item
        role="button"
        onClick={this.handleToggleEdit}
      >
        <List.Item.Graphic graphic={<Icon icon="edit" />}/>
        <List.Item.Text primaryText="Edit comment" />
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

  renderForm() {
    const study = get(this.props, "comment.study", null)
    const comment = get(this.props, "comment", {})

    return (
      <StudyBodyEditor study={study}>
        <form id="lesson-comment-form" onSubmit={this.handleSubmit}>
          <StudyBodyEditor.Main
            placeholder="Leave a comment"
            object={comment}
            showFormButtonsFor="lesson-comment-form"
            onCancel={this.handleCancel}
            onChange={this.handleChange}
            onPreview={this.handlePreview}
            onPublish={this.handlePublish}
            onReset={this.handleReset}
            study={study}
          />
        </form>
      </StudyBodyEditor>
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
