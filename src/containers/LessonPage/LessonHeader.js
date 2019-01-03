import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import {withRouter} from 'react-router-dom';
import TextField, {defaultTextFieldState} from 'components/TextField'
import Dialog from 'components/Dialog'
import EnrollmentSelect from 'components/EnrollmentSelect'
import Icon from 'components/Icon'
import Snackbar from 'components/mdc/Snackbar'
import StudyPreview from 'components/StudyPreview'
import UserLink from 'components/UserLink'
import PublishLessonDraftMutation from 'mutations/PublishLessonDraftMutation'
import UpdateLessonMutation from 'mutations/UpdateLessonMutation'
import {get, isEmpty, isNil} from 'utils'

class LessonHeader extends React.Component {
  state = {
    error: null,
    open: false,
    title: {
      ...defaultTextFieldState,
      value: get(this.props, "lesson.title", ""),
      valid: true,
    },
    confirmPublishDialogOpen: false,
    showSnackbar: false,
    snackbarMessage: "",
  }

  handleChange = (field) => {
    this.setState({
      [field.name]: field,
    })
  }

  handlePublish = () => {
    PublishLessonDraftMutation(
      this.props.lesson.id,
      (lesson, errors) => {
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
          snackbarMessage: "Lesson published",
        })
      },
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { title } = this.state
    UpdateLessonMutation(
      this.props.lesson.id,
      title.value,
      null,
      (updatedLesson, errors) => {
        if (!isNil(errors)) {
          this.setState({
            error: errors[0].message,
            showSnackbar: true,
            snackbarMessage: "Something went wrong",
          })
          return
        }
        this.setState({
          title: {
            value: get(updatedLesson, "title", ""),
            valid: true,
          },
          showSnackbar: true,
          snackbarMessage: "Title updated",
        })
        this.handleToggleEditTitle()
      },
    )
  }

  handleCancelEditTitle = () => {
    this.handleToggleEditTitle()
    this.reset_()
  }

  handleToggleEditTitle = () => {
    this.setState({ open: !this.state.open })
  }

  handleTogglePublishConfirmation = () => {
    const {confirmPublishDialogOpen} = this.state
    this.setState({
      confirmPublishDialogOpen: !confirmPublishDialogOpen,
    })
  }

  reset_ = () => {
    const lesson = get(this.props, "lesson", {})
    this.setState({
      error: null,
      title: {
        ...defaultTextFieldState,
        value: lesson.title,
        valid: true,
      },
    })
  }

  get classes() {
    const {className} = this.props
    return cls("mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const lesson = get(this.props, "lesson", {})
    const {open, showSnackbar, snackbarMessage} = this.state

    return (
      <div className={this.classes}>
        {open && lesson.viewerCanUpdate
        ? this.renderForm()
        : this.renderHeader()}
        <Snackbar
          show={showSnackbar}
          message={snackbarMessage}
          actionHandler={() => this.setState({showSnackbar: false})}
          actionText="ok"
          handleHide={() => this.setState({showSnackbar: false})}
        />
        {lesson.viewerCanUpdate && !lesson.isPublished && this.renderConfirmPublishDialog()}
      </div>
    )
  }

  renderForm() {
    const {title} = this.state

    return (
      <form onSubmit={this.handleSubmit}>
        <div className="rn-text-field">
          <div className="rn-text-field__input">
            <TextField
              label="Title"
              floatingLabelClassName={!isEmpty(title) ? "mdc-floating-label--float-above" : ""}
              inputProps={{
                name: "title",
                value: title.value,
                required: true,
                onChange: this.handleChange,
              }}
            />
          </div>
          <div className="rn-text-field__actions">
            <button
              type="submit"
              className="mdc-button mdc-button--unelevated rn-text-field__action rn-text-field__action--button"
            >
              Save
            </button>
            <button
              className="mdc-button rn-text-field__action rn-text-field__action--button"
              type="button"
              onClick={this.handleCancelEditTitle}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
      )
    }

  renderHeader() {
    const lesson = get(this.props, "lesson", {})

    return (
      <header className="rn-header rn-header--title">
        <h4 className="rn-header__text rn-file-path">
          <UserLink className="rn-link rn-file-path__directory" user={get(lesson, "study.owner", null)} />
          <span className="rn-file-path__separator">/</span>
          <StudyPreview.Link className="rn-link rn-file-path__directory" study={get(lesson, "study", null)} />
          <span className="rn-file-path__separator">/</span>
          <span className="rn-file-path__file">
            <Icon className="rn-file-path__file__icon" icon="lesson" />
            <span className="rn-file-path__file__text">
              <span className="fw5">{lesson.title}</span>
              <span className="mdc-theme--text-hint-on-light ml2">#{lesson.number}</span>
            </span>
            {lesson.viewerCanUpdate &&
            <button
              className="material-icons mdc-icon-button rn-file-path__file__icon"
              type="button"
              onClick={this.handleToggleEditTitle}
              aria-label="Edit title"
              title="Edit title"
            >
              edit
            </button>}
          </span>
        </h4>
        <div className="rn-header__actions">
          {!lesson.isPublished &&
          <button
            type="button"
            className="mdc-button mdc-button--unelevated mdc-theme--secondary-bg rn-header__action rn-header__action--button"
            onClick={this.handleTogglePublishConfirmation}
          >
            Publish
          </button>}
          {lesson.viewerCanEnroll &&
          <EnrollmentSelect
            className="rn-header__action rn-header__action--button"
            enrollable={lesson}
          />}
        </div>
      </header>
    )
  }

  renderConfirmPublishDialog() {
    const {confirmPublishDialogOpen} = this.state

    return (
      <Dialog
        open={confirmPublishDialogOpen}
        onClose={() => this.setState({confirmPublishDialogOpen: false})}
        title={<Dialog.Title>Publish lesson</Dialog.Title>}
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
              onClick={this.handlePublish}
              data-mdc-dialog-action="yes"
            >
              Yes
            </button>
          </Dialog.Actions>}
        />
    )
  }
}

export default withRouter(createFragmentContainer(LessonHeader, graphql`
  fragment LessonHeader_lesson on Lesson {
    enrollmentStatus
    id
    isPublished
    number
    study {
      ...LinkStudyPreview_study
      owner {
        ...UserLink_user
      }
    }
    title
    viewerCanEnroll
    viewerCanUpdate
  }
`))
