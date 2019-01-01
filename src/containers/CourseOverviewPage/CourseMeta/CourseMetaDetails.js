import * as React from 'react'
import cls from 'classnames'
import PropTypes from 'prop-types'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { withRouter } from 'react-router-dom';
import {HelperText} from '@material/react-text-field'
import TextField, {defaultTextFieldState} from 'components/TextField'
import UpdateCourseMutation from 'mutations/UpdateCourseMutation'
import {get, isEmpty, throttle} from 'utils'

class CourseMetaDetails extends React.Component {
  constructor(props) {
    super(props)

    const description = get(this.props, "course.description", "")

    this.state = {
      error: null,
      description: {
        ...defaultTextFieldState,
        initialValue: description,
        value: description,
      },
      loading: false,
      open: false,
    }
  }

  componentDidUpdate(prevProps) {
    const newDescription = get(this.props, "course.description", "")
    if (newDescription !== this.state.description.initialValue) {
      this.setState({
        description: {
          ...this.state.description,
          initialValue: newDescription,
          value: newDescription,
        }
      })
    }
  }

  handleCancel = () => {
    this.setState({open: false})
    this.props.onClose()
    this.reset_()
  }

  handleChange = (field) => {
    this.setState({
      [field.name]: field,
    })
  }

  handleSubmit = throttle((e) => {
    e.preventDefault()
    const { description } = this.state

    this.setState({loading: true})

    UpdateCourseMutation(
      this.props.course.id,
      description.value,
      null,
      (updateCourse, errors) => {
        this.setState({loading: false})
        if (errors) {
          this.setState({ error: errors[0].message })
          return
        }
        this.handleToggleOpen()
      },
    )
  }, 1000)

  handleToggleOpen = () => {
    const open = !this.state.open

    this.setState({ open })
    this.props.onOpen()
  }

  reset_ = () => {
    this.setState({
      error: null,
      description: {
        ...defaultTextFieldState,
        value: this.state.description.initialValue,
      },
    })
  }

  get classes() {
    const {className} = this.props
    return cls("mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  get isLoading() {
    return this.state.loading
  }

  render() {
    const course = get(this.props, "course", {})
    const {open} = this.state

    return (
      <div className={this.classes}>
        {open && course.viewerCanAdmin
        ? this.renderForm()
        : this.renderDetails()}
      </div>
    )
  }

  renderHelperText() {
    return (
      <HelperText>Give a brief description of the course.</HelperText>
    )
  }

  renderForm() {
    const {description} = this.state

    return (
      <form onSubmit={this.handleSubmit}>
        <TextField
          className="w-100"
          label="Description"
          textarea
          floatingLabelClassName={!isEmpty(description) ? "mdc-floating-label--float-above" : ""}
          helperText={this.renderHelperText()}
          inputProps={{
            name: "description",
            value: description.value,
            onChange: this.handleChange,
          }}
        />
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

  renderDetails() {
    const course = get(this.props, "course", {})

    return (
      <div className="rn-description">
        <span className={cls("mdc-theme--subtitle1 flex-auto", {
          "mdc-theme--text-secondary-on-light": !course.description,
        })}>
          {course.description || "No description provided"}
        </span>
        {course.viewerCanAdmin &&
        <div className="inline-flex">
          <button
            className="material-icons mdc-icon-button mdc-theme--text-icon-on-background"
            type="button"
            onClick={this.handleToggleOpen}
            aria-label="Edit description"
            title="Edit description"
          >
            edit
          </button>
        </div>}
      </div>
    )
  }
}

CourseMetaDetails.propTypes = {
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
}

CourseMetaDetails.defaulProps = {
  onClose: () => {},
  onOpen: () => {},
}

export default withRouter(createFragmentContainer(CourseMetaDetails, graphql`
  fragment CourseMetaDetails_course on Course {
    description
    id
    viewerCanAdmin
  }
`))
