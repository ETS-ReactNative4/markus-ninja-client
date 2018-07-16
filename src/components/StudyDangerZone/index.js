import React, {Component} from 'react'
import { withRouter } from 'react-router'
import DeleteStudyMutation from 'mutations/DeleteStudyMutation'
import { isNil } from 'utils'

class StudyDangerZone extends Component {
  state = {
    error: null,
  }

  render() {
    const { error } = this.state
    return (
      <div className="StudyDangerZone">
        <form onSubmit={this.handleSubmit}>
          <h4 className="StudyDangerZone__delete-header">Delete this study</h4>
          <div className="StudyDangerZone__delete-description">
            Once you delete a study, there is no going back. Please be certain.
          </div>
          <button type="submit">Delete this study</button>
          <span>{error}</span>
        </form>
      </div>
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()
    DeleteStudyMutation(
      this.props.study.id,
      (response, error) => {
        if (!isNil(error)) {
          this.setState({ error: error.message })
        }
        this.props.history.push("/")
      },
    )
  }
}

export default withRouter(StudyDangerZone)
