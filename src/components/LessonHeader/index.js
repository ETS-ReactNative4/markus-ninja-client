import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link, withRouter } from 'react-router-dom';
import TextField, {Input} from '@material/react-text-field'
import UpdateLessonMutation from 'mutations/UpdateLessonMutation'
import AddLabelMutation from 'mutations/AddLabelMutation'
import RemoveLabelMutation from 'mutations/RemoveLabelMutation'
import StudyLabelChecklist from 'components/StudyLabelChecklist'
import Edge from 'components/Edge'
import Label from 'components/Label'
import { get, isNil } from 'utils'

import './LessonHeader.css'

class LessonHeader extends React.Component {
  state = {
    error: null,
    open: false,
    title: this.props.lesson.title,
  }

  get classes() {
    const {className} = this.props
    const {open} = this.state

    return cls("LessonHeader", className, {
      "LessonHeader__open": open,
    })
  }

  render() {
    const lesson = get(this.props, "lesson", {})
    const { error, title } = this.state
    return (
      <div className={this.classes}>
        <div className="LessonHeader__show">
          <div className="mdc-typography--headline5 flex-auto">
            <span>{lesson.title}</span>
            <span className="mdc-theme--text-hint-on-light ml2">#{lesson.number}</span>
          </div>
          <div className="inline-flex">
            {lesson.viewerCanUpdate &&
            <button
              className="material-icons mdc-icon-button"
              type="button"
              onClick={this.handleToggleOpen}
            >
              edit
            </button>}
          </div>
        </div>
        {lesson.viewerCanUpdate &&
        <form className="LessonHeader__edit" onSubmit={this.handleSubmit}>
          <TextField className="flex-auto" label="Title">
            <Input
              name="title"
              value={title}
              onChange={this.handleChange}
            />
          </TextField>
          <div className="inline-flex items-center pa2">
            <button
              className="mdc-button mdc-button--unelevated"
              type="submit"
              onClick={this.handleSubmit}
            >
              Save
            </button>
            <span
              className="pointer pa2"
              role="button"
              onClick={this.handleToggleOpen}
            >
              Cancel
            </span>
          </div>
          <span>{error}</span>
        </form>}
        {lesson.isCourseLesson &&
        <div className="LessonHeader__course">
          <span>
            This lesson is part of course
            <Link to={get(lesson, "course.resourcePath", "")}>
              {get(lesson, "course.name", "")}
            </Link>
          </span>
          {!isNil(get(lesson, "previousLesson.resourcePath", null)) &&
          <Link to={get(lesson, "previousLesson.resourcePath", null)}>Previous</Link>}
          {!isNil(get(lesson, "nextLesson.resourcePath", null)) &&
          <Link to={get(lesson, "nextLesson.resourcePath", null)}>Next</Link>}
        </div>}
        <div className="LessonHeader_labels">
          {get(lesson, "labels.edges", []).map(edge =>
          <Edge key={get(edge, "node.id", "")} edge={edge} render={({node}) =>
              <Label label={node} />}
          />)}
        </div>
        <StudyLabelChecklist
          study={get(this.props, "lesson.study", null)}
          labelable={lesson}
          onChange={this.handleLabelChecklist}
        />
      </div>
    )
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleLabelChecklist = (labelId, checked) => {
    if (checked) {
      AddLabelMutation(
        labelId,
        this.props.lesson.id,
        (response, error) => {
          if (!isNil(error)) {
            this.setState({ error: error[0].message })
          }
        },
      )
    } else {
      RemoveLabelMutation(
        labelId,
        this.props.lesson.id,
        (response, error) => {
          if (!isNil(error)) {
            this.setState({ error: error[0].message })
          }
        },
      )
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { title } = this.state
    UpdateLessonMutation(
      this.props.lesson.id,
      title,
      null,
      (updatedLesson, errors) => {
        if (!isNil(errors)) {
          this.setState({ error: errors[0].message })
        }
        this.handleToggleOpen()
        this.setState({
          title: get(updatedLesson, "title", ""),
        })
      },
    )
  }

  handleToggleOpen = () => {
    this.setState({ open: !this.state.open })
  }
}

export default withRouter(createFragmentContainer(LessonHeader, graphql`
  fragment LessonHeader_lesson on Lesson {
    course {
      name
      resourcePath
    }
    courseNumber
    id
    isCourseLesson
    labels(first: 10) @connection(key: "LessonHeader_labels", filters: []) {
      edges {
        node {
          id
          ...Label_label
        }
      }
    }
    nextLesson {
      resourcePath
    }
    number
    previousLesson {
      resourcePath
    }
    study {
      ...StudyLabelChecklist_study
    }
    title
    viewerCanUpdate
  }
`))
