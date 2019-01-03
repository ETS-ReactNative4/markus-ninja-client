import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import {Link} from 'react-router-dom';
import MaterialTextField, {Input} from '@material/react-text-field'
import ActivityLessonDialog from 'components/ActivityLessonDialog'
import UpdateActivityMutation from 'mutations/UpdateActivityMutation'
import {get, throttle} from 'utils'

class ActivityMetaLesson extends React.Component {
  constructor(props) {
    super(props)

    const lesson = get(props, "activity.lesson", null)

    this.state = {
      activityLessonDialogOpen: false,
      error: null,
      initialLesson: lesson,
      lesson,
      loading: false,
      open: false,
    }
  }

  handleCancel = () => {
    this.setState({open: false})
    this.props.onClose()
    this._reset()
  }

  handleSelectLesson = (lesson) => {
    this.setState({lesson})
  }

  handleSubmit = throttle((e) => {
    e.preventDefault()
    const {lesson} = this.state

    this.setState({loading: true})

    UpdateActivityMutation(
      this.props.activity.id,
      null,
      lesson.id,
      null,
      (updateActivity, errors) => {
        this.setState({loading: false})
        if (errors) {
          this.setState({ error: errors[0].message })
          return
        }
        this.handleToggleOpen()
      },
    )
  }, 1000)

  handleToggleActivityLessonDialog = () => {
    const {activityLessonDialogOpen} = this.state
    this.setState({
      activityLessonDialogOpen: !activityLessonDialogOpen,
    })
  }

  handleToggleOpen = () => {
    const open = !this.state.open

    this.setState({ open })
    this.props.onOpen()
  }

  _reset = () => {
    this.setState({
      error: null,
      lesson: this.state.initialLesson,
    })
  }

  get classes() {
    const {className} = this.props
    return cls("mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const activity = get(this.props, "activity", {})
    const {activityLessonDialogOpen, open} = this.state

    return (
      <div className={this.classes}>
        {open && activity.viewerCanAdmin
        ? this.renderForm()
        : this.renderLesson()}
        <ActivityLessonDialog
          open={activityLessonDialogOpen}
          onClose={this.handleToggleActivityLessonDialog}
          onSelect={this.handleSelectLesson}
        />
      </div>
    )
  }

  renderForm() {
    const {lesson} = this.state

    return (
      <form onSubmit={this.handleSubmit}>
        <div className="mb2">
          <button
            type="button"
            className="mdc-button mdc-button--unelevated mdc-theme--secondary-bg"
            onClick={this.handleToggleActivityLessonDialog}
          >
            Select Lesson
          </button>
        </div>
        <input
          type="hidden"
          required
          value={lesson ? lesson.id : ""}
        />
        <div>
          <MaterialTextField
            className="rn-form__input"
            label="Lesson"
            floatingLabelClassName="mdc-floating-label--float-above"
          >
            <Input
              onClick={this.handleToggleActivityLessonDialog}
              name="lesson"
              required
              value={lesson ? `${lesson.study.nameWithOwner}/${lesson.title}` : ""}
            />
          </MaterialTextField>
        </div>
        <div className="inline-flex items-center mt2">
          <button
            type="submit"
            className="mdc-button mdc-button--unelevated"
            disabled={this.isLoading}
          >
            Save
          </button>
          <button
            className="mdc-button ml2"
            type="button"
            onClick={this.handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    )
  }

  renderLesson() {
    const activity = get(this.props, "activity", {})

    return (
      <div className="rn-description">
        <span className="mdc-typography--headline6">
          Activity for lesson
          <Link
            className="rn-link ml1"
            to={activity.lesson.resourcePath}
          >
            {activity.lesson.study.nameWithOwner}/{activity.lesson.title}
          </Link>
        </span>
        {activity.viewerCanAdmin &&
        <div className="inline-flex">
          <button
            className="material-icons mdc-icon-button mdc-theme--text-icon-on-background"
            type="button"
            onClick={this.handleToggleOpen}
            aria-label="Edit lesson"
            title="Edit lesson"
          >
            edit
          </button>
        </div>}
      </div>
    )
  }
}

ActivityMetaLesson.propTypes = {
  activity: PropTypes.shape({
    lesson: PropTypes.shape({
      resourcePath: PropTypes.string.isRequired,
      study: PropTypes.shape({
        nameWithOwner: PropTypes.string.isRequired,
      }),
      title: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
}

ActivityMetaLesson.defaulProps = {
  onClose: () => {},
  onOpen: () => {},
}

export default createFragmentContainer(ActivityMetaLesson, graphql`
  fragment ActivityMetaLesson_activity on Activity {
    id
    lesson {
      resourcePath
      study {
        nameWithOwner
      }
      title
    }
    viewerCanAdmin
  }
`)
