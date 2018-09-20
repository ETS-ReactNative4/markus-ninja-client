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
    const {edit} = this.state

    return (
      <React.Fragment>
        {edit
        ? this.renderForm()
        : this.renderBody()}
      </React.Fragment>
    )
  }

  renderBody() {
    const lesson = get(this.props, "lesson", {})

    return (
      <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
        <div className="mdc-card mdc-card--outlined">
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
      </div>
    )
  }

  renderForm() {
    const lesson = get(this.props, "lesson", {})
    const {body} = this.state

    return (
      <form
        className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12"
        onSubmit={this.handleSubmit}
      >
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
