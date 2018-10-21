import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import {withRouter} from 'react-router-dom';
import TextField, {Input} from '@material/react-text-field'
import EnrollmentSelect from 'components/EnrollmentSelect'
import Icon from 'components/Icon'
import StudyLink from 'components/StudyLink'
import UserLink from 'components/UserLink'
import UpdateLessonMutation from 'mutations/UpdateLessonMutation'
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

  get classes() {
    const {className} = this.props
    return cls("mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const lesson = get(this.props, "lesson", {})
    const {open} = this.state

    return (
      <div className={this.classes}>
        {open && lesson.viewerCanUpdate
        ? this.renderForm()
        : this.renderHeader()}
      </div>
    )
  }

  renderForm() {
    const {title} = this.state

    return (
      <form onSubmit={this.handleSubmit}>
        <div className="inline-flex items-center w-100">
          <TextField
            className="flex-auto"
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
          <button
            className="mdc-button ml2"
            type="button"
            onClick={this.handleToggleOpen}
          >
            Cancel
          </button>
        </div>
      </form>
      )
    }

  renderHeader() {
    const lesson = get(this.props, "lesson", {})

    return (
      <header className="rn-header mdc-typography--headline5">
        <UserLink className="rn-link" user={get(lesson, "study.owner", null)} />
        <span>/</span>
        <StudyLink className="rn-link" study={get(lesson, "study", null)} />
        <span>/</span>
        <Icon className="v-mid mr1" icon="lesson" />
        <span className="fw5">{lesson.title}</span>
        <span className="mdc-theme--text-hint-on-light ml2">#{lesson.number}</span>
        <div className="rn-header__meta">
          {lesson.viewerCanUpdate &&
          <button
            className="material-icons mdc-icon-button mdc-theme--text-icon-on-background"
            type="button"
            onClick={this.handleToggleOpen}
            aria-label="Edit title"
            title="Edit title"
          >
            edit
          </button>}
          {lesson.viewerCanEnroll &&
          <EnrollmentSelect enrollable={lesson} />}
        </div>
      </header>
    )
  }
}

export default withRouter(createFragmentContainer(LessonHeader, graphql`
  fragment LessonHeader_lesson on Lesson {
    enrollmentStatus
    id
    number
    study {
      ...StudyLink_study
      owner {
        ...UserLink_user
      }
    }
    title
    viewerCanEnroll
    viewerCanUpdate
  }
`))
