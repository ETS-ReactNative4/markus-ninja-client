import * as React from 'react'
import cls from 'classnames'
import PropTypes from 'prop-types'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router-dom';
import {HelperText} from '@material/react-text-field'
import TextField, {defaultTextFieldState} from 'components/TextField'
import UpdateCourseMutation from 'mutations/UpdateCourseMutation'
import {get, isEmpty} from 'utils'

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
      open: false,
      submitted: false,
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

  handleChange = (field) => {
    this.setState({
      [field.name]: field,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { description } = this.state

    this.setState({submitted: true})

    UpdateCourseMutation(
      this.props.course.id,
      description.value,
      null,
      (updateCourse, errors) => {
        if (errors) {
          this.setState({ error: errors[0].message })
        }
        this.handleToggleOpen()
      },
    )
  }

  handleToggleOpen = () => {
    const open = !this.state.open

    this.setState({ open })
    this.props.onOpen(open)

    if (!this.state.submitted) {
      this._reset()
    }
  }

  _reset = () => {
    this.setState({
      error: null,
      description: {
        ...defaultTextFieldState,
        value: this.state.description.initialValue,
      },
      submitted: false,
    })
  }

  get classes() {
    const {className} = this.props
    return cls("mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
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
            className="mdc-button mdc-button--unelevated"
            type="submit"
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

  renderDetails() {
    const course = get(this.props, "course", {})

    return (
      <div className="inline-flex items-center w-100">
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
  onOpen: PropTypes.func,
}

CourseMetaDetails.defaulProps = {
  onOpen: () => {}
}

export default withRouter(createFragmentContainer(CourseMetaDetails, graphql`
  fragment CourseMetaDetails_course on Course {
    description
    id
    viewerCanAdmin
  }
`))
