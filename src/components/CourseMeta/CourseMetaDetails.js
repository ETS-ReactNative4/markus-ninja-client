import React, {Component} from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router-dom';
import UpdateCourseMutation from 'mutations/UpdateCourseMutation'
import { get, isNil } from 'utils'
import cls from 'classnames'

class CourseMetaDetails extends Component {
  state = {
    error: null,
    description: this.props.course.description,
    open: false,
  }

  render() {
    const course = get(this.props, "course", {})
    const { description, error, open } = this.state
    return (
      <div className={cls("CourseMetaDetails", {open})}>
        <div className="CourseMetaDetails__content">
          <span className="CourseMetaDetails__course-description">{course.description}</span>
        </div>
        <span className="CourseMetaDetails__edit-toggle">
          <button
            className="btn"
            type="button"
            onClick={this.handleToggleOpen}
          >
            Edit
          </button>
        </span>
        <div className="CourseMetaDetails__edit">
          <form onSubmit={this.handleSubmit}>
            <input
              id="course-description"
              className={cls("form-control", "edit-course-description")}
              type="text"
              name="description"
              placeholder="Enter text"
              value={description}
              onChange={this.handleChange}
            />
            <button
              className="btn"
              type="submit"
              onClick={this.handleSubmit}
            >
              Save
            </button>
            <button
              className="btn-link"
              type="button"
              onClick={this.handleToggleOpen}
            >
              Cancel
            </button>
            <span>{error}</span>
          </form>
        </div>
      </div>
    )
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { description } = this.state
    UpdateCourseMutation(
      this.props.course.id,
      description,
      null,
      (error) => {
        if (!isNil(error)) {
          this.setState({ error: error.message })
        }
        this.handleToggleOpen()
      },
    )
  }

  handleToggleOpen = () => {
    this.setState({ open: !this.state.open })
  }
}

export default withRouter(createFragmentContainer(CourseMetaDetails, graphql`
  fragment CourseMetaDetails_course on Course {
    description
    id
  }
`))
