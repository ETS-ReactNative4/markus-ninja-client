import React, {Component} from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import cls from 'classnames'
import { withRouter } from 'react-router'
import DeleteStudyMutation from 'mutations/DeleteStudyMutation'
import { isNil } from 'utils'

import './StudyDangerZone.css'

class StudyDangerZone extends Component {
  state = {
    confirmation: "",
    error: null,
    open: false,
  }

  render() {
    const { confirmation, error, open } = this.state
    return (
      <div className={cls("StudyDangerZone", {open})}>
        <h6>Delete this study</h6>
        <div className="StudyDangerZone__info">
          <div className="info-description">
            Once you delete a study, there is no going back. Please be certain.
          </div>
          <button type="button" onClick={this.handleToggleOpen}>Delete this study</button>
        </div>
        <div className="StudyDangerZone__delete">
          <form onSubmit={this.handleSubmit}>
            <div>Please enter 'delete me' to confirm</div>
            <input
              type="text"
              name="confirmation"
              value={confirmation}
              onChange={(e) => this.setState({ confirmation: e.target.value })}
            />
            <button
              className="btn"
              type="submit"
              disabled={confirmation !== "delete me"}
            >
              Delete
            </button>
            <button
              className="btn"
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

  handleSubmit = (e) => {
    e.preventDefault()
    if (this.state.confirmation === 'delete me') {
      DeleteStudyMutation(
        this.props.study.id,
        (response, errors) => {
          if (!isNil(errors)) {
            this.setState({ error: errors[0].message })
          } else {
            this.props.history.push("/")
          }
        },
      )
    }
  }

  handleToggleOpen = () => {
    this.setState({
      open: !this.state.open,
    })
  }
}

export default withRouter(createFragmentContainer(StudyDangerZone, graphql`
  fragment StudyDangerZone_study on Study {
    id
  }
`))
