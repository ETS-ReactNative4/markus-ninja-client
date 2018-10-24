import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import HTML from 'components/HTML'
import StudyBodyEditor from 'components/StudyBodyEditor'
import UpdateLessonMutation from 'mutations/UpdateLessonMutation'
import { get, isNil } from 'utils'

class LessonBody extends React.Component {
  state = {
    edit: false,
    error: null,
    body: this.props.lesson.body,
  }

  handleSubmit = () => {
    const { body } = this.state
    UpdateLessonMutation(
      this.props.lesson.id,
      null,
      body,
      (lesson, errors) => {
        if (!isNil(errors)) {
          this.setState({ error: errors[0].message })
        }
        this.setState({body: lesson.body})
        this.handleToggleEdit()
      },
    )
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
    const body = get(this.props, "lesson.body", "")

    return (
      <StudyBodyEditor study={study}>
        <form id="lesson-body-form" onSubmit={this.handleSubmit}>
          <StudyBodyEditor.Main
            placeholder="Begin your lesson"
            initialValue={body}
            showFormButtonsFor="lesson-body-form"
            submitText="Update lesson"
            onCancel={this.handleToggleEdit}
            onChange={(body) => this.setState({body})}
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
    study {
      ...StudyBodyEditor_study
    }
    viewerCanUpdate
  }
`)
