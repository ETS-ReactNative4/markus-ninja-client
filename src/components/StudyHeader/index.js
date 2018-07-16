import React, {Component} from 'react'
import { withRouter } from 'react-router-dom';
import UpdateStudyMutation from 'mutations/UpdateStudyMutation'
import { get, isNil } from 'utils'
import cls from 'classnames'

import './StudyHeader.css'

class StudyHeader extends Component {
  state = {
    error: null,
    description: this.props.study.description,
    open: false,
  }

  render() {
    const study = get(this.props, "study", {})
    const { description, error, open } = this.state
    return (
      <div className={cls("StudyHeader", {open})}>
        <div className="StudyHeader__show">
          <div className="StudyHeader__actions">
            <button
              className="btn"
              type="button"
              onClick={this.handleToggleOpen}
            >
              Edit
            </button>
          </div>
          <div className="StudyHeader__meta">
            <span className="StudyHeader__study-description">{study.description}</span>
          </div>
        </div>
        <div className="StudyHeader__edit">
          <form onSubmit={this.handleSubmit}>
            <input
              id="study-description"
              className={cls("form-control", "edit-study-description")}
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
    UpdateStudyMutation(
      this.props.study.id,
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

export default withRouter(StudyHeader)
