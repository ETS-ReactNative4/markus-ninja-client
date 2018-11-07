import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import HTML from 'components/HTML'
import StudyBodyEditor from 'components/StudyBodyEditor'
import PublishLessonDraftMutation from 'mutations/PublishLessonDraftMutation'
import UpdateLessonMutation from 'mutations/UpdateLessonMutation'
import {debounce, get, isNil, throttle} from 'utils'

class LessonBody extends React.Component {
  state = {
    edit: !get(this.props, "lesson.isPublished", false),
    error: null,
    draft: {
      dirty: false,
      initialValue: get(this.props, "lesson.draft", ""),
      value: get(this.props, "lesson.draft", ""),
    }
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
            this.setState({ error: errors[0].message })
          }
          if (lesson) {
            this.setState({
              draft: {
                ...this.state.draft,
                dirty: false,
                value: lesson.draft
              }
            })
          }
        },
      )
    }
  }, 2000)

  handleCancel = () => {
    const {initialValue} = this.state
    this.updateDraft(initialValue)
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
          this.setState({ error: errors[0].message })
          return
        }
        this.handleToggleEdit()
      },
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const {draft} = this.state
    this.updateDraft(draft.value)
    this.handleToggleEdit()
  }

  handleToggleEdit = () => {
    this.setState({ edit: !this.state.edit })
  }

  get classes() {
    const {className} = this.props
    return cls("mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const {edit} = this.state

    return (
      <div className={this.classes}>
        <div className="center mw7">
          {edit
          ? this.renderForm()
          : this.renderBody()}
        </div>
      </div>
    )
  }

  renderBody() {
    const lesson = get(this.props, "lesson", {})

    return (
      <div className="mdc-card h-100">
        <div className="rn-card__body">
          <HTML html={lesson.bodyHTML} />
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
            placeholder="Begin your lesson"
            body={lesson.body}
            draft={lesson.draft}
            showFormButtonsFor="lesson-draft-form"
            onCancel={this.handleCancel}
            onChange={this.handleChange}
            onPreview={this.handlePreview}
            onPublish={this.handlePublish}
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
    body
    bodyHTML
    draft
    isPublished
    study {
      ...StudyBodyEditor_study
    }
    viewerCanUpdate
  }
`)
