import React, {Component} from 'react'
import { withRouter } from 'react-router-dom';
import UpdateStudyMutation from 'mutations/UpdateStudyMutation'
import { isNil, isEmpty } from 'utils'

class UpdateStudyForm extends Component {
  state = {
    edit: false,
    error: null,
    description: this.props.study.description,
  }

  render() {
    const description = !isEmpty(this.state.description) ?
      this.state.description :
      "No description provided."
    if (!this.state.edit) {
      return (
        <div className="UpdateStudyForm">
          <span className="UpdateStudyForm__description">{description}</span>
          <button onClick={this.handleToggleEdit}>Edit</button>
        </div>
      )
    } else {
      return (
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="UpdateStudyForm__description">Description (optional)</label>
          <input
            id="UpdateStudyForm__description"
            type="description"
            name="description"
            placeholder="Short description of this study"
            value={this.state.description}
            onChange={this.handleChange}
          />
          <button type="submit">Save</button>
          <button onClick={this.handleToggleEdit}>Cancel</button>
          <span>{this.state.error}</span>
        </form>
      )
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
    UpdateStudyMutation(
      this.props.study.__id,
      description,
      null,
      (error) => {
        if (!isNil(error)) {
          this.setState({ error: error.message })
        }
        this.handleToggleEdit()
      },
    )
  }

  handleToggleEdit = () => {
    this.setState({ edit: !this.state.edit })
  }
}

export default withRouter(UpdateStudyForm)
