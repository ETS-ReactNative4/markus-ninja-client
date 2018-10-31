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
    edit: false,
    error: null,
    draft: {
      dirty: false,
      initialValue: get(this.props, "lesson.draft", ""),
      value: get(this.props, "lesson.draft", ""),
    }
  }

  autoSaveOnChange = throttle(
    debounce(() => {
      this.updateDraft()
    }, 30000)
  , 30000)

  updateDraft = () => {
    const { draft } = this.state
    if (draft.dirty) {
      UpdateLessonMutation(
        this.props.lesson.id,
        null,
        draft.value,
        (lesson, errors) => {
          if (!isNil(errors)) {
            this.setState({ error: errors[0].message })
          }
          this.setState({
            draft: {
              ...this.state.draft,
              dirty: false,
              value: lesson.draft
            }
          })
        },
      )
    }
  }

  handleChange = (value) => {
    const {draft} = this.state
    this.setState({
      draft: {
        dirty: value !== draft.initialValue,
        value,
      },
    })
    this.autoSaveOnChange()
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
    this.updateDraft()
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
        <div className="ph3 pv2">
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
    const draft = get(this.props, "lesson.draft", "")

    return (
      <StudyBodyEditor study={study}>
        <form id="lesson-draft-form" onSubmit={this.handleSubmit}>
          <StudyBodyEditor.Main
            placeholder="Begin your lesson"
            initialValue={draft}
            showFormButtonsFor="lesson-draft-form"
            submitText="Update draft"
            onCancel={this.handleToggleEdit}
            onChange={this.handleChange}
            onPreview={this.updateDraft}
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
    study {
      ...StudyBodyEditor_study
    }
    viewerCanUpdate
  }
`)
