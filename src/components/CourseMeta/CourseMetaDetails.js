import * as React from 'react'
import cls from 'classnames'
import PropTypes from 'prop-types'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router-dom';
import TextField, {Input, HelperText} from '@material/react-text-field'
import UpdateCourseMutation from 'mutations/UpdateCourseMutation'
import { get, isEmpty, isNil } from 'utils'

class CourseMetaDetails extends React.Component {
  constructor(props) {
    super(props)

    const description = get(this.props, "course.description", "")

    this.state = {
      error: null,
      description,
      initialValues: {
        description,
      },
      open: false,
      submitted: false,
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { description } = this.state

    this.setState({submitted: true})

    UpdateCourseMutation(
      this.props.course.id,
      description,
      null,
      (errors) => {
        if (!isNil(errors)) {
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
      this.reset_()
    }
  }

  reset_ = () => {
    this.setState({
      error: null,
      submitted: false,
      ...this.state.initialValues,
    })
  }

  get classes() {
    const {className} = this.props
    return cls("CourseMetaDetails mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const course = get(this.props, "course", {})
    const { description, error, open } = this.state
    return (
      <div className={this.classes}>
        {open
        ? course.viewerCanAdmin &&
          <form className="CourseMeta__form inline-flex w-100" onSubmit={this.handleSubmit}>
            <div className="flex-auto">
              <TextField
                className="w-100"
                label="Description"
                outlined
                floatingLabelClassName={!isEmpty(description) ? "mdc-floating-label--float-above" : ""}
                helperText={this.renderHelperText()}
              >
                <Input
                  name="description"
                  value={description}
                  onChange={this.handleChange}
                />
              </TextField>
            </div>
            <div className="inline-flex items-center pa2 mb4">
              <button
                className="mdc-button mdc-button--unelevated"
                type="submit"
                onClick={this.handleSubmit}
              >
                Save
              </button>
              <span
                className="pointer pa2 underline-hover"
                role="button"
                onClick={this.handleToggleOpen}
              >
                Cancel
              </span>
            </div>
            <span>{error}</span>
          </form>
        : <div className="inline-flex items-center w-100">
            <span className={cls("mdc-theme--subtitle1 flex-auto", {
              "mdc-theme--text-secondary-on-light": !course.description,
            })}>
              {course.description || "No description provided"}
            </span>
            {course.viewerCanAdmin &&
            <div className="inline-flex">
              <button
                className="material-icons mdc-icon-button"
                type="button"
                onClick={this.handleToggleOpen}
                aria-label="Edit description"
                title="Edit description"
              >
                edit
              </button>
            </div>}
          </div>}
      </div>
    )
  }

  renderHelperText() {
    return (
      <HelperText>Give a brief description of the course.</HelperText>
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
