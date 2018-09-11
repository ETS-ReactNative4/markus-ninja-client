import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link, withRouter } from 'react-router-dom';
import TextField, {Input} from '@material/react-text-field'
import CourseLink from 'components/CourseLink'
import StudyLink from 'components/StudyLink'
import UserLink from 'components/UserLink'
import UpdateLessonMutation from 'mutations/UpdateLessonMutation'
import AddLabelMutation from 'mutations/AddLabelMutation'
import RemoveLabelMutation from 'mutations/RemoveLabelMutation'
import Label from 'components/Label'
import {get, isEmpty, isNil} from 'utils'

class LessonHeader extends React.Component {
  state = {
    error: null,
    open: false,
    title: this.props.lesson.title,
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

  get classes() {
    const {className} = this.props
    return cls("LessonHeader mdc-layout-grid__inner", className)
  }

  render() {
    const lesson = get(this.props, "lesson", {})
    const {open} = this.state

    return (
      <div className={this.classes}>
        {open
        ? lesson.viewerCanUpdate && this.renderForm()
        : this.renderDetails()}
        {lesson.isCourseLesson && this.renderCourse()}
        {this.renderLabels()}
      </div>
    )
  }

  renderForm() {
    const {title} = this.state

    return (
      <form
        className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12"
        onSubmit={this.handleSubmit}
      >
        <div className="inline-flex items-center w-100">
          <TextField
            className="flex-auto"
            outlined
            label="Title"
            floatingLabelClassName={!isEmpty(title) ? "mdc-floating-label--float-above" : ""}
          >
            <Input
              name="title"
              value={title}
              onChange={this.handleChange}
            />
          </TextField>
          <button
            className="mdc-button mdc-button--unelevated ml2"
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
      </form>
      )
    }

  renderDetails() {
    const lesson = get(this.props, "lesson", {})

    return (
      <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
        <div className="inline-flex w-100">
          <h5 className="flex-auto">
            <UserLink className="rn-link" user={get(lesson, "study.owner", null)} />
            <span>/</span>
            <StudyLink className="rn-link" study={get(lesson, "study", null)} />
            <span>/</span>
            <span>{lesson.title}</span>
            <span className="mdc-theme--text-hint-on-light ml2">#{lesson.number}</span>
          </h5>
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
    )
  }

  renderCourse() {
    const lesson = get(this.props, "lesson", {})
    const {previousLesson, nextLesson} = lesson

    return (
      <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
        <span>
          This lesson is part of course
          <CourseLink className="rn-link ml1" course={get(lesson, "course", null)} />
        </span>
        {previousLesson &&
        <Link className="rn-link ml1" to={previousLesson.resourcePath}>Previous</Link>}
        {nextLesson &&
        <Link className="rn-link ml1" to={nextLesson.resourcePath}>Next</Link>}
      </div>
    )
  }

  renderLabels() {
    const labelEdges = get(this.props, "lesson.labels.edges", [])

    if (isEmpty(labelEdges)) { return null }

    return (
      <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
        <div className="inline-flex items-center">
          {labelEdges.map(({node}) =>
            <Label key={get(node, "id", "")} label={node} />)}
        </div>
      </div>
    )
  }
}

export default withRouter(createFragmentContainer(LessonHeader, graphql`
  fragment LessonHeader_lesson on Lesson {
    course {
      ...CourseLink_course
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
      ...StudyLink_study
      owner {
        ...UserLink_user
      }
    }
    title
    viewerCanUpdate
  }
`))
