import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { withRouter } from 'react-router'
import Dialog from 'components/Dialog'
import AddCommentMutation from 'mutations/AddCommentMutation'
import UpdateCommentMutation from 'mutations/UpdateCommentMutation'
import Snackbar from 'components/mdc/Snackbar'
import StudyBodyEditor from 'components/StudyBodyEditor'
import CommentDraftBackup from 'components/CommentDraftBackup'
import CommentDraftBackups from 'components/CommentDraftBackups'
import {debounce, get, isNil} from 'utils'

class AddCommentForm extends React.Component {
  constructor(props) {
    super(props)

    const comment = get(this.props, "commentable.viewerNewComment", {})

    this.editorElement_ = React.createRef()
    this.state = {
      error: null,
      draft: {
        dirty: false,
        initialValue: comment.draft,
        value: comment.draft,
      },
      draftBackup: "",
      draftBackupId: "",
      restoreDraftFromBackupDialogOpen: false,
      showSnackbar: false,
      snackbarMessage: "",
    }
  }

  updateDraft = debounce((draft) => {
    const comment = get(this.props, "commentable.viewerNewComment", {})

    UpdateCommentMutation(
      comment.id,
      draft,
      (comment, errors) => {
        if (!isNil(errors)) {
          this.setState({
            error: errors[0].message,
            showSnackbar: true,
            snackbarMessage: "Failed to save draft",
          })
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

  handlePreview = () => {
    const {draft} = this.state
    if (draft.dirty) {
      this.updateDraft(draft.value)
    }
  }

  handlePublish = () => {
    AddCommentMutation(
      get(this.props, "commentable.viewerNewComment.id", ""),
      (newComment, errors) => {
        if (errors) {
          this.setState({
            error: errors[0].message,
            showSnackbar: true,
            snackbarMessage: "Failed to publish comment",
          })
          return
        }
        if (newComment) {
          this.setState({
            draft: {
              dirty: false,
              initialValue: newComment.draft,
              value: newComment.draft,
            },
            showSnackbar: true,
            snackbarMessage: "Comment published",
          })
          const editor = this.editorElement_ && this.editorElement_.current
          editor.setText(newComment.draft)
        }
      }
    )
  }

  handleReset = () => {
    const comment = get(this.props, "commentable.viewerNewComment", {})
    const {draft} = this.state

    if (draft.value !== "") {
      UpdateCommentMutation(
        comment.id,
        "",
        (comment, errors) => {
          if (!isNil(errors)) {
            this.setState({ error: errors[0].message })
            return
          }
          if (comment) {
            this.setState({
              draft: {
                ...this.state.draft,
                dirty: false,
                value: comment.draft
              }
            })
            const editor = this.editorElement_ && this.editorElement_.current
            editor.setText(comment.draft)
          }
        },
      )
    }
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

  handleToggleRestoreDraftFromBackup = () => {
    const {restoreDraftFromBackupDialogOpen} = this.state
    this.setState({
      restoreDraftFromBackupDialogOpen: !restoreDraftFromBackupDialogOpen,
    })
  }

  get classes() {
    const {className} = this.props
    return cls("AddCommentForm mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  get isPublishable() {
    const {draft} = this.state

    return !draft.dirty && draft.value.trim() !== ""
  }

  render() {
    const {showSnackbar, snackbarMessage} = this.state
    const study = get(this.props, "commentable.study", null)
    const comment = get(this.props, "commentable.viewerNewComment", {})

    return (
      <React.Fragment>
        <StudyBodyEditor study={study}>
          <div className={this.classes}>
            <StudyBodyEditor.Main
              ref={this.editorElement_}
              placeholder="Leave a comment"
              bottomActions={
                <div className="mdc-card__actions rn-card__actions">
                  <div className="mdc-card__action-buttons">
                    <button
                      type="button"
                      className="mdc-button mdc-card__action mdc-card__action--button"
                      onClick={this.handlePublish}
                      disabled={!this.isPublishable}
                    >
                      Comment
                    </button>
                  </div>
                </div>
              }
              edit={true}
              isPublishable={this.isPublishable}
              handleChange={this.handleChange}
              handlePreview={this.handlePreview}
              handlePublish={this.handlePublish}
              handleReset={this.handleReset}
              handleRestore={this.handleToggleRestoreDraftFromBackup}
              object={comment}
              study={study}
            />
          </div>
        </StudyBodyEditor>
        {comment.viewerCanUpdate && this.renderRestoreDraftFromBackupDialog()}
        <Snackbar
          show={showSnackbar}
          message={snackbarMessage}
          actionHandler={() => this.setState({showSnackbar: false})}
          actionText="ok"
          handleHide={() => this.setState({showSnackbar: false})}
        />
      </React.Fragment>
    )
  }

  renderRestoreDraftFromBackupDialog() {
    const comment = get(this.props, "commentable.viewerNewComment", {})
    const {draftBackupId, restoreDraftFromBackupDialogOpen} = this.state

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
            <CommentDraftBackups
              className="mt2"
              commentId={comment.id}
              value={draftBackupId}
              onChange={(draftBackupId) => this.setState({draftBackupId})}
            />}
          </Dialog.Title>
        }
        content={
          <Dialog.Content>
            <form id="restore-add-comment-draft-from-backup" onSubmit={this.handleRestore}>
              <CommentDraftBackup
                commentId={comment.id}
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
              form="restore-add-comment-draft-from-backup"
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

AddCommentForm.propTypes = {
  commentable: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
}

AddCommentForm.defaultProps = {
  commentable: {
    id: "",
  },
}

export default withRouter(createFragmentContainer(AddCommentForm, graphql`
  fragment AddCommentForm_commentable on Commentable {
    id
    study {
      ...StudyBodyEditor_study
    }
    viewerNewComment {
      bodyHTML
      draft
      id
      isPublished
      lastEditedAt
      viewerCanUpdate
    }
  }
`))
