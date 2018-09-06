import React, {Component} from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import HTML from 'components/HTML'
import RichTextEditor from 'components/RichTextEditor'
import UpdateLessonMutation from 'mutations/UpdateLessonMutation'
import { get, isNil } from 'utils'

class LessonBody extends Component {
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
      (error) => {
        if (!isNil(error)) {
          this.setState({ error: error.message })
        }
        this.handleToggleEdit()
      },
    )
  }

  handleToggleEdit = () => {
    this.setState({ edit: !this.state.edit })
  }

  render() {
    const lesson = get(this.props, "lesson", {})
    const { edit, error, body } = this.state
    if (!edit) {
      return (
        <div className="LessonBody mdc-card mdc-card--outlined">
          <HTML className="mh3" html={lesson.bodyHTML} />
          {lesson.viewerCanUpdate &&
          <div className="mdc-card__actions">
            <div className="mdc-card__actions-icons">
              <button className="material-icons mdc-icon-button mdc-card__action--icon" onClick={this.handleToggleEdit}>
                edit
              </button>
            </div>
          </div>}
        </div>
      )
    } else if (lesson.viewerCanUpdate) {
      return (
        <form onSubmit={this.handleSubmit}>
          <RichTextEditor
            id="LessonBody__body"
            onChange={(body) => this.setState({body})}
            placeholder="Begin your lesson"
            initialValue={body}
            study={get(lesson, "study", null)}
          />
          <button type="submit">Update lesson</button>
          <button onClick={this.handleToggleEdit}>Cancel</button>
          <span>{error}</span>
        </form>
      )
    }
    return null
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
