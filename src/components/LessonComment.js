import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import shortid from 'shortid'
import moment from 'moment'
import Dialog from 'components/Dialog'
import Snackbar from 'components/mdc/Snackbar'
import StudyBodyEditor from 'components/StudyBodyEditor'
import LessonCommentDraftBackup from 'components/LessonCommentDraftBackup'
import LessonCommentDraftBackups from 'components/LessonCommentDraftBackups'
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
  editorElement_ = React.createRef()
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
    draftBackup: "",
    draftBackupId: "",
    formId: "",
    menuOpen: false,
    restoreDraftFromBackupDialogOpen: false,
    showSnackbar: false,
    snackbarMessage: "",
  }

  componentDidMount() {
    this.setState({
      formId: `restore-lesson-comment-draft-from-backup${shortid.generate()}`,
    })
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

  handleChange = (value) => {
    this.setState({
      draft: {
        dirty: true,
        value,
      },
    })
    this.updateDraft(value)
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
        if (comment) {
          this.setState({
            draft: {
              ...this.state.draft,
              dirty: false,
              value: comment.draft
            },
          })
          const editor = this.editorElement_ && this.editorElement_.current
          editor.setText(comment.draft)
        }
      },
    )
  }

  handleRestore = (e) => {
    e.preventDefault()
    const editor = this.editorElement_ && this.editorElement_.current
    editor && editor.changeText(this.state.draftBackup)
    this.setState({
      draftBackup: "",
      draftBackupId: "",
    })
  }

  handleToggleDeleteConfirmation = () => {
    const {confirmDeleteDialogOpen} = this.state
    this.setState({
      confirmDeleteDialogOpen: !confirmDeleteDialogOpen,
    })
  }

  handleToggleRestoreDraftFromBackup = () => {
    const {restoreDraftFromBackupDialogOpen} = this.state
    this.setState({
      restoreDraftFromBackupDialogOpen: !restoreDraftFromBackupDialogOpen,
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
            ref={this.editorElement_}
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
            handleChange={this.handleChange}
            handlePreview={this.handlePreview}
            handlePublish={this.handlePublish}
            handleReset={this.handleReset}
            handleRestore={this.handleToggleRestoreDraftFromBackup}
            handleToggleEdit={this.handleToggleEdit}
            object={comment}
            study={study}
          />
        </StudyBodyEditor>
        {comment.viewerCanDelete && this.renderConfirmDeleteDialog()}
        {comment.viewerCanUpdate && this.renderRestoreDraftFromBackupDialog()}
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

  renderRestoreDraftFromBackupDialog() {
    const lessonCommentId = get(this.props, "comment.id")
    const {draftBackupId, formId, restoreDraftFromBackupDialogOpen} = this.state

    return (
      <Dialog
        open={restoreDraftFromBackupDialogOpen}
        onClose={() => this.setState({restoreDraftFromBackupDialogOpen: false})}
        title={
          <Dialog.Title>
            <div>
              Restore draft from backup
            </div>
            {restoreDraftFromBackupDialogOpen &&
            <LessonCommentDraftBackups
              className="mt2"
              lessonCommentId={lessonCommentId}
              value={draftBackupId}
              onChange={(draftBackupId) => this.setState({draftBackupId})}
            />}
          </Dialog.Title>
        }
        content={
          <Dialog.Content>
            <form id={formId} onSubmit={this.handleRestore}>
              <LessonCommentDraftBackup
                lessonCommentId={lessonCommentId}
                backupId={draftBackupId}
                onChange={(draftBackup) => this.setState({draftBackup})}
              />
            </form>
          </Dialog.Content>
        }
        actions={
          <Dialog.Actions>
            <button
              type="button"
              className="mdc-button"
              data-mdc-dialog-action="cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              form={formId}
              className="mdc-button"
              data-mdc-dialog-action="restore"
            >
              Restore
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
