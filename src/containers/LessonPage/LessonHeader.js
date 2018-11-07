import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import {withRouter} from 'react-router-dom';
import TextField, {defaultTextFieldState} from 'components/TextField'
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
    title: {
      ...defaultTextFieldState,
      value: get(this.props, "lesson.title", ""),
      valid: true,
    }
  }

  handleChange = (field) => {
    this.setState({
      [field.name]: field,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { title } = this.state
    UpdateLessonMutation(
      this.props.lesson.id,
      title.value,
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

  reset_ = () => {
    const lesson = get(this.props, "lesson", {})
    this.setState({
      error: null,
      title: {
        ...defaultTextFieldState,
        value: lesson.title,
        valid: true,
      },
    })
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
        <div className="rn-text-field">
          <TextField
            label="Title"
            floatingLabelClassName={!isEmpty(title) ? "mdc-floating-label--float-above" : ""}
            inputProps={{
              name: "title",
              value: title.value,
              required: true,
              onChange: this.handleChange,
            }}
          />
          <div className="rn-text-field__actions">
            <button
              type="submit"
              className="mdc-button mdc-button--unelevated rn-text-field__action rn-text-field__action--button"
            >
              Save
            </button>
            <button
              className="mdc-button rn-text-field__action rn-text-field__action--button"
              type="button"
              onClick={this.handleToggleOpen}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
      )
    }

  renderHeader() {
    const lesson = get(this.props, "lesson", {})

    return (
      <header className="rn-header">
        <h4 className="rn-header__title rn-file-path">
          <UserLink className="rn-link rn-file-path__directory" user={get(lesson, "study.owner", null)} />
          <span className="rn-file-path__separator">/</span>
          <StudyLink className="rn-link rn-file-path__directory" study={get(lesson, "study", null)} />
          <span className="rn-file-path__separator">/</span>
          <span className="rn-file-path__file">
            <Icon className="rn-file-path__file__icon" icon="lesson" />
            <span className="rn-file-path__file__text">
              <span className="fw5">{lesson.title}</span>
              <span className="mdc-theme--text-hint-on-light ml2">#{lesson.number}</span>
            </span>
            {lesson.viewerCanUpdate &&
            <button
              className="material-icons mdc-icon-button rn-file-path__file__icon"
              type="button"
              onClick={this.handleToggleOpen}
              aria-label="Edit title"
              title="Edit title"
            >
              edit
            </button>}
          </span>
        </h4>
        <div className="rn-header__actions">
          {!lesson.isPublished &&
          <span className="mdc-button mdc-button--unelevated mdc-theme--secondary-bg rn-header__action rn-header__action--button">
            Unpublished
          </span>}
          {lesson.viewerCanEnroll &&
          <EnrollmentSelect
            className="rn-header__action rn-header__action--button"
            enrollable={lesson}
          />}
        </div>
      </header>
    )
  }
}

export default withRouter(createFragmentContainer(LessonHeader, graphql`
  fragment LessonHeader_lesson on Lesson {
    enrollmentStatus
    id
    isPublished
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
