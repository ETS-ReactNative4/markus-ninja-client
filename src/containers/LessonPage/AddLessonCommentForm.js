import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { withRouter } from 'react-router'
import Dialog from 'components/Dialog'
import AddLessonCommentMutation from 'mutations/AddLessonCommentMutation'
import UpdateLessonCommentMutation from 'mutations/UpdateLessonCommentMutation'
import Snackbar from 'components/mdc/Snackbar'
import StudyBodyEditor from 'components/StudyBodyEditor'
import LessonCommentDraftBackup from 'components/LessonCommentDraftBackup'
import LessonCommentDraftBackups from 'components/LessonCommentDraftBackups'
import {debounce, get, isNil} from 'utils'

class AddLessonCommentForm extends React.Component {
  constructor(props) {
    super(props)

    const comment = get(this.props, "lesson.viewerNewComment", {})

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
    const comment = get(this.props, "lesson.viewerNewComment", {})

    UpdateLessonCommentMutation(
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
    AddLessonCommentMutation(
      get(this.props, "lesson.viewerNewComment.id", ""),
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
          draft: {
            dirty: false,
            initialValue: comment.draft,
            value: comment.draft,
          },
          showSnackbar: true,
          snackbarMessage: "Comment published",
        })
      }
    )
  }

  handleReset = () => {
    const comment = get(this.props, "lesson.viewerNewComment", {})
    const {draft} = this.state

    if (draft.value !== "") {
      UpdateLessonCommentMutation(
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
    return cls("AddLessonCommentForm mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  get isPublishable() {
    const {draft} = this.state

    return !draft.dirty && draft.value.trim() !== ""
  }

  render() {
    const {showSnackbar, snackbarMessage} = this.state
    const study = get(this.props, "lesson.study", null)
    const comment = get(this.props, "lesson.viewerNewComment", {})

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
    const comment = get(this.props, "lesson.viewerNewComment", {})
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
            <LessonCommentDraftBackups
              className="mt2"
              lessonCommentId={comment.id}
              value={draftBackupId}
              onChange={(draftBackupId) => this.setState({draftBackupId})}
            />}
          </Dialog.Title>
        }
        content={
          <Dialog.Content>
            <form id="restore-add-lesson-comment-draft-from-backup" onSubmit={this.handleRestore}>
              <LessonCommentDraftBackup
                lessonCommentId={comment.id}
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
              form="restore-add-lesson-comment-draft-from-backup"
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

AddLessonCommentForm.propTypes = {
  lesson: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
}

AddLessonCommentForm.defaultProps = {
  lesson: {
    id: "",
  },
}

export default withRouter(createFragmentContainer(AddLessonCommentForm, graphql`
  fragment AddLessonCommentForm_lesson on Lesson {
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
