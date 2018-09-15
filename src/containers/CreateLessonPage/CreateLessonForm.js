import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import TextField, {Input} from '@material/react-text-field'
import Tab from 'components/Tab'
import TabBar from 'components/TabBar'
import CreateLessonMutation from 'mutations/CreateLessonMutation'
import RichTextEditor from 'components/RichTextEditor'
import Preview from 'components/RichTextEditor/Preview'
import StudyCourseSelect from 'components/StudyCourseSelect'
import { get, isNil } from 'utils'

class CreateLessonForm extends React.Component {
  state = {
    error: null,
    body: "",
    courseId: "",
    title: "",
    preview: false,
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
    const {preview} = this.state
    return cls("CreateLessonForm mdc-layout-grid__inner", className, {
      "CreateLessonForm__preview--selected": preview,
    })
  }

  render() {
    const { body, title, error, preview } = this.state
    return (
      <form className={this.classes} onSubmit={this.handleSubmit}>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <div className="mdc-layout-grid__inner mdc-card mdc-card--outlined pa2">
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
              <div className="CreateLessonForm__tabs">
                <TabBar>
                  <Tab
                    active={!preview}
                    as="button"
                    type="button"
                    onClick={() => this.setState({preview: false})}
                  >
                    <span className="mdc-tab__content">
                      <span className="mdc-tab__text-label">
                        Write
                      </span>
                    </span>
                  </Tab>
                  <Tab
                    active={preview}
                    as="button"
                    type="button"
                    onClick={() => this.setState({preview: true})}
                  >
                    <span className="mdc-tab__content">
                      <span className="mdc-tab__text-label">
                        Preview
                      </span>
                    </span>
                  </Tab>
                </TabBar>
              </div>
              <div className="CreateLessonForm__input">
                <RichTextEditor
                  study={get(this.props, "study", null)}
                  placeholder="Begin your lesson"
                  onChange={(body) => this.setState({body})}
                />
              </div>
              <div className="CreateLessonForm__preview">
                <Preview open={preview} text={body} />
              </div>
            </div>
          </div>
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
