import React, {Component} from 'react'
import { withRouter } from 'react-router-dom';
import CreateStudyMutation from 'mutations/CreateStudyMutation'

class CreateStudyForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      description: "",
      name: "",
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    const { description, name } = this.state
    CreateStudyMutation(
      name,
      description,
      (response, error) => this.props.history.push(response.createStudy.resourcePath),
    )
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="CreateStudyForm__name">Study name</label>
        <input
          id="CreateStudyForm__name"
          type="text"
          name="name"
          value={this.state.name}
          onChange={this.handleChange}
        />
        <label htmlFor="CreateStudyForm__description">Description (optional)</label>
        <input
          id="CreateStudyForm__description"
          type="description"
          name="description"
          value={this.state.description}
          onChange={this.handleChange}
        />
        <button type="submit">Create study</button>
        <span>{this.state.error}</span>
      </form>
    )
  }
}

export default withRouter(CreateStudyForm)
