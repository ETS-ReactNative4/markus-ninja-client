import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import CreateLessonMutation from 'mutations/CreateLessonMutation'
import TextField, {defaultTextFieldState} from 'components/TextField'
import RichTextEditor from 'components/RichTextEditor'
import StudyCourseSelect from 'components/StudyCourseSelect'
import {get, isEmpty, isNil} from 'utils'

class CreateLessonForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      error: null,
      body: "",
      courseId: "",
      title: defaultTextFieldState,
    }
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
          return
        }
        this.props.history.push(lesson.resourcePath)
      }
    )
  }

  get classes() {
    const {className} = this.props
    return cls("CreateLessonForm mdc-layout-grid__inner", className)
  }

  get isFormValid() {
    const {body, title} = this.state
    return !isEmpty(body) &&
      !isEmpty(title.value) && title.valid
  }

  render() {
    return (
      <form className={this.classes} onSubmit={this.handleSubmit}>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <TextField
            fullWidth
            label="Title"
            inputProps={{
              name: "title",
              placeholder: "Title*",
              required: true,
              onChange: (title) => this.setState({title}),
            }}
          />
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <RichTextEditor
            study={get(this.props, "study", null)}
            placeholder="Begin your lesson"
            onChange={(body) => this.setState({body})}
          />
        </div>
        <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
        {this.renderCourseSelect()}
        <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
        <div className="mdc-layout-grid__cell">
          <button
            type="submit"
            className="mdc-button mdc-button--unelevated"
          >
            Create lesson
          </button>
        </div>
      </form>
    )
  }

  renderCourseSelect() {
    return (
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
