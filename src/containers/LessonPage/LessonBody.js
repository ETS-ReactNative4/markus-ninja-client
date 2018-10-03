import * as React from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import HTML from 'components/HTML'
import RichTextEditor from 'components/RichTextEditor'
import UpdateLessonMutation from 'mutations/UpdateLessonMutation'
import { get, isNil } from 'utils'

class LessonBody extends React.Component {
  state = {
    edit: false,
    error: null,
    body: this.props.lesson.body,
  }

  handleSubmit = (e) => {
    e.preventDefault()
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

  render() {
    const {edit} = this.state

    return (
      <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
        <div className="center mw7 ph3">
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
      <React.Fragment>
        <HTML html={lesson.bodyHTML} />
        {lesson.viewerCanUpdate &&
        <div className="mt2">
          <button
            className="mdc-button mdc-button--outlined"
            type="button"
            onClick={this.handleToggleEdit}
          >
            Edit lesson
          </button>
        </div>}
      </React.Fragment>
    )
  }

  renderForm() {
    const lesson = get(this.props, "lesson", {})
    const {body} = this.state

    return (
      <form onSubmit={this.handleSubmit}>
        <RichTextEditor
          id="LessonBody__body"
          onChange={(body) => this.setState({body})}
          placeholder="Begin your lesson"
          initialValue={body}
          study={get(lesson, "study", null)}
        />
        <div className="mt2">
          <button
            className="mdc-button mdc-button--unelevated"
            type="submit"
          >
            Update lesson
          </button>
          <button
            className="mdc-button mdc-button--outlined ml2"
            onClick={this.handleToggleEdit}
          >
            Cancel
          </button>
        </div>
      </form>
    )
  }
}

export default createFragmentContainer(LessonBody, graphql`
  fragment LessonBody_lesson on Lesson {
    id
    body
    bodyHTML
    study {
      ...RichTextEditor_study
    }
    viewerCanUpdate
  }
`)
