import React, {Component} from 'react'
import { withRouter } from 'react-router-dom';
import CreateStudyMutation from 'mutations/CreateStudyMutation'
import { get, isEmpty } from 'utils'

class CreateStudyForm extends Component {
  state = {
    error: null,
    description: "",
    name: "",
  }

  render() {
    const { name, description, error } = this.state
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="study-name">Study name</label>
        <input
          id="study-name"
          type="text"
          name="name"
          value={name}
          onChange={this.handleChange}
        />
        <label htmlFor="study-description">Description (optional)</label>
        <input
          id="study-description"
          type="text"
          name="description"
          value={description}
          onChange={this.handleChange}
        />
        <button type="submit">Create study</button>
        <span>{error}</span>
      </form>
    )
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { description, name } = this.state
    CreateStudyMutation(
      name,
      description,
      (study, errors) => {
        if (!isEmpty(errors)) {
          this.setState({ error: errors[0].message })
        }
        this.props.history.push(get(study, "resourcePath", ""))
      }
    )
  }
}

export default withRouter(CreateStudyForm)
