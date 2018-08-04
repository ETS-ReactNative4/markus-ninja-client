import React, {Component} from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router-dom';
import UpdateLessonMutation from 'mutations/UpdateLessonMutation'
import { get, isNil } from 'utils'
import cls from 'classnames'

import './LessonHeader.css'

class LessonHeader extends Component {
  state = {
    error: null,
    open: false,
    title: this.props.lesson.title,
  }

  render() {
    const lesson = get(this.props, "lesson", {})
    const { error, open, title } = this.state
    return (
      <div className={cls("LessonHeader", {open})}>
        <div className="LessonHeader__show">
          <div className="LessonHeader__actions">
            {lesson.viewerCanUpdate &&
            <button
              className="btn"
              type="button"
              onClick={this.handleToggleOpen}
            >
              Edit
            </button>}
          </div>
          <h1 className="LessonHeader__title">
            <span className="LessonHeader__lesson-title">{lesson.title}</span>
            <span className="LessonHeader__number">#{lesson.number}</span>
          </h1>
        </div>
        {lesson.viewerCanUpdate &&
        <div className="LessonHeader__edit">
          <form onSubmit={this.handleSubmit}>
            <input
              id="lesson-title"
              className={cls("form-control", "edit-lesson-title")}
              type="text"
              name="title"
              placeholder="Enter text"
              value={title}
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
        </div>}
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
    const { title } = this.state
    UpdateLessonMutation(
      this.props.lesson.id,
      title,
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

export default withRouter(createFragmentContainer(LessonHeader, graphql`
  fragment LessonHeader_lesson on Lesson {
    id
    number
    title
    viewerCanUpdate
  }
`))
