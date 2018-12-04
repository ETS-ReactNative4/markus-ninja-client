import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { Link, withRouter } from 'react-router-dom'
import TextField, {defaultTextFieldState} from 'components/TextField'
import Icon from 'components/Icon'
import AppleButton from 'components/AppleButton'
import Dialog from 'components/Dialog'
import Snackbar from 'components/mdc/Snackbar'
import StudyLink from 'components/StudyLink'
import UserLink from 'components/UserLink'
import PublishCourseMutation from 'mutations/PublishCourseMutation'
import UpdateCourseMutation from 'mutations/UpdateCourseMutation'
import {get, isEmpty, throttle} from 'utils'

class CourseHeader extends React.Component {
  state = {
    error: null,
    open: false,
    name: {
      ...defaultTextFieldState,
      value: get(this.props, "course.name", ""),
      valid: true,
    },
    confirmPublishDialogOpen: false,
    showSnackbar: false,
    snackbarMessage: "",
  }

  handleChange = (field) => {
    this.setState({
      [field.name]: field,
    })
  }

  handlePublish = () => {
    PublishCourseMutation(
      this.props.course.id,
      (course, errors) => {
        if (errors) {
          this.setState({
            error: errors[0].message,
            showSnackbar: true,
            snackbarMessage: "Something went wrong",
          })
          return
        }
        this.setState({
          showSnackbar: true,
          snackbarMessage: "Course published",
        })
      },
    )
  }

  handleSubmit = throttle((e) => {
    e.preventDefault()
    const { name } = this.state
    UpdateCourseMutation(
      this.props.course.id,
      null,
      name.value,
      (updatedCourse, errors) => {
        if (errors) {
          this.setState({
            error: errors[0].message,
            showSnackbar: true,
            snackbarMessage: "Something went wrong",
          })
          return
        }
        this.setState({
          name: get(updatedCourse, "name", ""),
          showSnackbar: true,
          snackbarMessage: "Name updated",
        })
        this.handleToggleEditName()
      },
    )
  }, 2000)

  handleCancelEditName = () => {
    this.handleToggleEditName()
    this.reset_()
  }

  handleToggleEditName = () => {
    this.setState({ open: !this.state.open })
  }

  handleTogglePublishConfirmation = () => {
    const isPublishable = get(this.props, "course.isPublishable", false)
    if (!isPublishable) {
      this.setState({
        showSnackbar: true,
        snackbarMessage: "All lessons must be published",
      })
      return
    }
    const {confirmPublishDialogOpen} = this.state
    this.setState({
      confirmPublishDialogOpen: !confirmPublishDialogOpen,
    })
  }

  reset_ = () => {
    const course = get(this.props, "course", {})
    this.setState({
      error: null,
      name: {
        ...defaultTextFieldState,
        value: course.name,
        valid: true,
      },
    })
  }

  get classes() {
    const {className} = this.props
    return cls("mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const course = get(this.props, "course", {})
    const {open, showSnackbar, snackbarMessage} = this.state

    return (
      <div className={this.classes}>
        {open && course.viewerCanAdmin
        ? this.renderForm()
        : this.renderHeader()}
        <Snackbar
          show={showSnackbar}
          message={snackbarMessage}
          actionHandler={() => this.setState({showSnackbar: false})}
          actionText="ok"
          handleHide={() => this.setState({showSnackbar: false})}
        />
        {course.viewerCanAdmin && this.renderConfirmPublishDialog()}
      </div>
    )
  }

  renderForm() {
    const {name} = this.state

    return (
      <form onSubmit={this.handleSubmit}>
        <div className="rn-text-field">
          <TextField
            className="flex-auto"
            label="Name"
            floatingLabelClassName={!isEmpty(name) ? "mdc-floating-label--float-above" : ""}
            inputProps={{
              name: "name",
              value: name.value,
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
              onClick={this.handleCancelEditName}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    )
  }

  renderHeader() {
    const {open} = this.state
    const course = get(this.props, "course", null)

    return (
      <header className="rn-header rn-header--title">
        <h4 className="rn-header__text rn-file-path">
          <UserLink className="rn-link rn-file-path__directory" user={get(course, "study.owner", null)} />
          <span className="rn-file-path__separator">/</span>
          <StudyLink className="rn-link rn-file-path__directory" study={get(course, "study", null)} />
          <span className="rn-file-path__separator">/</span>
          <span className="rn-file-path__file">
            <span className="rn-file-path__file__text">
              <Icon className="v-mid mr1" icon="course" />
              <span className="fw5">{get(course, "name", "")}</span>
              <span className="mdc-theme--text-hint-on-light ml2">#{get(course, "number", 0)}</span>
            </span>
            {course.viewerCanAdmin &&
              (!open
              ? <button
                  className="material-icons mdc-icon-button rn-file-path__file__icon"
                  type="button"
                  onClick={this.handleToggleEditName}
                  aria-label="Edit name"
                  title="Edit name"
                >
                  edit
                </button>
              : <button
                  className="material-icons mdc-icon-button rn-file-path__file__icon"
                  type="button"
                  onClick={this.handleCancelEditName}
                  aria-label="Edit name"
                  title="Edit name"
                >
                  cancel
                </button>
              : null)
            }
          </span>
        </h4>
        <div className="rn-header__actions">
          {!course.isPublished &&
          <button
            type="button"
            className="mdc-button mdc-button--unelevated mdc-theme--secondary-bg rn-header__action rn-header__action--button"
            onClick={this.handleTogglePublishConfirmation}
          >
            Publish
          </button>}
          <div className="rn-combo-button rn-header__action rn-header__action--button">
            <AppleButton appleable={course} />
            <Link
              className="rn-combo-button__count"
              to={course.resourcePath+"/applegivers"}
            >
              {get(course, "appleGivers.totalCount", 0)}
            </Link>
          </div>
        </div>
      </header>
    )
  }

  renderConfirmPublishDialog() {
    const {confirmPublishDialogOpen} = this.state

    return (
      <Dialog
        open={confirmPublishDialogOpen}
        onClose={() => this.setState({confirmPublishDialogOpen: false})}
        title={<Dialog.Title>Publish course</Dialog.Title>}
        content={
          <Dialog.Content>
            <div className="flex flex-column mw5">
              <p>Are you sure?</p>
            </div>
          </Dialog.Content>
        }
        actions={
          <Dialog.Actions>
            <button
              type="button"
              className="mdc-button"
              data-mdc-dialog-action="no"
            >
              No
            </button>
            <button
              type="button"
              className="mdc-button"
              onClick={this.handlePublish}
              data-mdc-dialog-action="yes"
            >
              Yes
            </button>
          </Dialog.Actions>}
        />
    )
  }
}

export default withRouter(createFragmentContainer(CourseHeader, graphql`
  fragment CourseHeader_course on Course {
    ...AppleButton_appleable
    advancedAt
    appleGivers(first: 0) {
      totalCount
    }
    createdAt
    id
    isPublished
    isPublishable
    name
    number
    resourcePath
    study {
      ...StudyLink_study
      owner {
        ...UserLink_user
      }
    }
    updatedAt
    viewerCanAdmin
  }
`))
