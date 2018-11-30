import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import HTML from 'components/HTML'
import Snackbar from 'components/mdc/Snackbar'
import StudyBodyEditor from 'components/StudyBodyEditor'
import PublishLessonDraftMutation from 'mutations/PublishLessonDraftMutation'
import ResetLessonDraftMutation from 'mutations/ResetLessonDraftMutation'
import UpdateLessonMutation from 'mutations/UpdateLessonMutation'
import {debounce, get, isNil, throttle, timeDifferenceForDate} from 'utils'

class LessonBody extends React.Component {
  state = {
    edit: !get(this.props, "lesson.isPublished", false),
    error: null,
    draft: {
      dirty: false,
      initialValue: get(this.props, "lesson.draft", ""),
      value: get(this.props, "lesson.draft", ""),
    },
    showSnackbar: false,
    snackbarMessage: "",
  }

  autoSaveOnChange = throttle(
    debounce(() => this.updateDraft(this.state.draft.value), 30000)
  , 30000)

  updateDraft = throttle((draft) => {
    if (this.state.draft.dirty) {
      UpdateLessonMutation(
        this.props.lesson.id,
        null,
        draft,
        (lesson, errors) => {
          if (!isNil(errors)) {
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
          } else if (lesson) {
            this.setState({
              draft: {
                ...this.state.draft,
                dirty: false,
                value: lesson.draft
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
      this.autoSaveOnChange()
    }
  }

  handlePreview = () => {
    const {draft} = this.state
    this.updateDraft(draft.value)
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
          snackbarMessage: "Draft published",
        })
        this.handleToggleEdit()
      },
    )
  }

  handleReset = () => {
    ResetLessonDraftMutation(
      this.props.lesson.id,
      (lesson, errors) => {
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

  handleToggleEdit = () => {
    this.setState({ edit: !this.state.edit })
  }

  get classes() {
    const {className} = this.props
    return cls("LessonBody mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const {edit, showSnackbar, snackbarMessage} = this.state

    return (
      <div className={this.classes}>
        <div className="center mw7">
          {edit
          ? this.renderForm()
          : this.renderBody()}
        </div>
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

  renderBody() {
    const lesson = get(this.props, "lesson", {})

    return (
      <div className="mdc-card">
        <div className="rn-card__actions mdc-card__actions">
          <span className="rn-card__overline">
            Updated {timeDifferenceForDate(lesson.publishedAt)}
          </span>
          {lesson.viewerCanUpdate &&
          <div className="mdc-card__action-icons">
            <button
              className="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon"
              type="button"
              onClick={this.handleToggleEdit}
              aria-label="Edit lesson"
              title="Edit lesson"
            >
              edit
            </button>
          </div>}
        </div>
        <div className="rn-card__body min-vh-25">
          <HTML className="mdc-typography--body1" html={lesson.bodyHTML} />
        </div>
        {lesson.viewerCanUpdate &&
        <div className="mdc-card__actions bottom">
          <div className="mdc-card__action-icons">
            <button
              className="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon"
              type="button"
              onClick={this.handleToggleEdit}
              aria-label="Edit lesson"
              title="Edit lesson"
            >
              edit
            </button>
          </div>
        </div>}
      </div>
    )
  }

  renderForm() {
    const study = get(this.props, "lesson.study", null)
    const lesson = get(this.props, "lesson", {})

    return (
      <StudyBodyEditor study={study}>
        <form id="lesson-draft-form" onSubmit={this.handleSubmit}>
          <StudyBodyEditor.Main
            bodyClassName="min-vh-25"
            placeholder="Begin your lesson"
            object={lesson}
            showFormButtonsFor="lesson-draft-form"
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

export default createFragmentContainer(LessonBody, graphql`
  fragment LessonBody_lesson on Lesson {
    id
    bodyHTML
    draft
    isPublished
    lastEditedAt
    publishedAt
    study {
      ...StudyBodyEditor_study
    }
    viewerCanUpdate
  }
`)
