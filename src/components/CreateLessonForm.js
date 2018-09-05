import React, {Component} from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import TextField, {Input} from '@material/react-text-field'
import CreateLessonMutation from 'mutations/CreateLessonMutation'
import RichTextEditor from 'components/RichTextEditor'
import StudyCourseSelect from 'components/StudyCourseSelect'
import { get, isNil } from 'utils'

class CreateLessonForm extends Component {
  state = {
    error: null,
    body: "",
    courseId: "",
    title: "",
  }

  handleChangeBody = (body) => {
    this.setState({body})
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { body, courseId, title } = this.state

    CreateLessonMutation(
      this.props.study.id,
      title,
      body,
      courseId,
      (lesson, errors) => {
        if (!isNil(errors)) {
          this.setState({ error: errors[0].message })
        }
        this.props.history.push(lesson.resourcePath)
      }
    )
  }

  get classes() {
    const {className} = this.props
    return cls("CreateLessonForm", className)
  }

  render() {
    const { title, error } = this.state
    return (
      <form className={this.classes} onSubmit={this.handleSubmit}>
        <div className="mdc-layout-grid">
          <div className="mdc-layout-grid__inner">
            <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              <TextField className="w-100" outlined label="Title">
                <Input
                  name="title"
                  value={title}
                  onChange={(e) => this.setState({title: e.target.value})}
                />
              </TextField>
            </div>
            <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              <RichTextEditor
                id="lesson-body"
                onChange={this.handleChangeBody}
                study={get(this.props, "study", null)}
                outlined
                label="Begin your lesson"
              />
            </div>
            <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
            <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              <div className="mdc-typography--headline6">Add to existing course?</div>
              <div className="mdc-typography--subtitle1 mdc-theme--text-secondary-on-light pb3">
                Selecting a course will immediately add the lesson to the course.
              </div>
              <StudyCourseSelect
                study={get(this.props, "study", null)}
                onChange={(courseId) => this.setState({ courseId })}
              />
            </div>
            <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
            <div className="mdc-layout-grid__cell">
              <button className="mdc-button mdc-button--unelevated" type="submit">Create lesson</button>
            </div>
            <span>{error}</span>
          </div>
        </div>
      </form>
    )
  }
}

export default withRouter(createFragmentContainer(CreateLessonForm, graphql`
  fragment CreateLessonForm_study on Study {
    id
    ...RichTextEditor_study
    ...StudyCourseSelect_study
  }
`))
