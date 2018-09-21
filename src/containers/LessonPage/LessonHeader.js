import * as React from 'react'
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
import LabelSet from 'components/LabelSet'
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

  render() {
    const lesson = get(this.props, "lesson", {})
    const {open} = this.state

    return (
      <React.Fragment>
        {open && lesson.viewerCanUpdate
        ? this.renderForm()
        : this.renderHeader()}
        {lesson.isCourseLesson && this.renderCourse()}
        {this.renderLabels()}
      </React.Fragment>
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

  renderHeader() {
    const lesson = get(this.props, "lesson", {})

    return (
      <header className="rn-header mdc-typography--headline5 mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
        <UserLink className="rn-link" user={get(lesson, "study.owner", null)} />
        <span>/</span>
        <StudyLink className="rn-link" study={get(lesson, "study", null)} />
        <span>/</span>
        <span className="fw5">{lesson.title}</span>
        <span className="mdc-theme--text-hint-on-light ml2">#{lesson.number}</span>
        <div className="rn-header__meta">
          {lesson.viewerCanUpdate &&
          <button
            className="material-icons mdc-icon-button"
            type="button"
            onClick={this.handleToggleOpen}
          >
            edit
          </button>}
        </div>
      </header>
    )
  }

  renderCourse() {
    const lesson = get(this.props, "lesson", {})
    const {previousLesson, nextLesson} = lesson

    return (
      <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
        <span>
          <CourseLink className="rn-link mdc-typography--headline6" course={get(lesson, "course", null)} />
          <span className="mdc-theme--text-hint-on-light ml2">#{lesson.courseNumber}</span>
        </span>
        {previousLesson &&
        <Link className="mdc-button mdc-button--outlined ml2" to={previousLesson.resourcePath}>Previous</Link>}
        {nextLesson &&
        <Link className="mdc-button mdc-button--unelevated ml2" to={nextLesson.resourcePath}>Next</Link>}
      </div>
    )
  }

  renderLabels() {
    const lessonId = get(this.props, "lesson.id", "")
    const viewerCanUpdate = get(this.props, "lesson.viewerCanUpdate", false)
    const lessonLabelEdges = get(this.props, "lesson.labels.edges", [])
    const studyLabelEdges = get(this.props, "lesson.study.labels.edges", [])
    const labelEdges =
      viewerCanUpdate
      ? studyLabelEdges
      : lessonLabelEdges

    if (isEmpty(labelEdges)) { return null }

    const selectedLabelIds = lessonLabelEdges.map(({node}) => node.id)

    return (
      <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
        <LabelSet selectedLabelIds={selectedLabelIds}>
          {labelEdges.map(({node}) =>
            node &&
            <Label
              key={node.id}
              id={node.id}
              label={node}
              labelableId={lessonId}
              disabled={!viewerCanUpdate}
            />)}
        </LabelSet>
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
      labels(first: 10) {
        edges {
          node {
            id
            ...Label_label
          }
        }
      }
      owner {
        ...UserLink_user
      }
    }
    title
    viewerCanUpdate
  }
`))
