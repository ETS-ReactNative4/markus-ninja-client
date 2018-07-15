import React, {Component} from 'react'
import { withRouter } from 'react-router'
import DeleteStudyMutation from 'mutations/DeleteStudyMutation'
import { isNil } from 'utils'

class StudyDangerZoneForm extends Component {
  state = {
    error: null,
  }

  render() {
    const { error } = this.state
    return (
      <form onSubmit={this.handleSubmit}>
        <h4 className="StudyDangerZoneForm__delete-header">Delete this study</h4>
        <div className="StudyDangerZoneForm__delete-description">
          Once you delete a study, there is no going back. Please be certain.
        </div>
        <button type="submit">Delete this study</button>
        <span>{error}</span>
      </form>
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

export default withRouter(StudyDangerZoneForm)
