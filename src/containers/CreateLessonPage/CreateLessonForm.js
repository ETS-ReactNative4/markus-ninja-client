import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { withRouter } from 'react-router'
import getHistory from 'react-router-global-history'
import CreateLessonMutation from 'mutations/CreateLessonMutation'
import ErrorText from 'components/ErrorText'
import TextField, {defaultTextFieldState} from 'components/TextField'
import StudyBodyEditor from 'components/StudyBodyEditor'
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
      title.value,
      body,
      courseId,
      (lesson, errors) => {
        if (!isNil(errors)) {
          this.setState({ error: errors[0].message })
          return
        }
        getHistory().push(lesson.resourcePath)
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
    const {error} = this.state
    const study = get(this.props, "study", null)

    return (
      <StudyBodyEditor study={study}>
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
            <StudyBodyEditor.Main
              placeholder="Begin your lesson"
              onChange={(body) => this.setState({body})}
              study={study}
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
          <ErrorText
            className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12"
            error={error}
          />
        </form>
      </StudyBodyEditor>
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
    ...StudyBodyEditor_study
    ...StudyCourseSelect_study
    id
  }
`))
