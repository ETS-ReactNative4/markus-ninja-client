import React, {Component} from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router-dom';
import CreateCourseMutation from 'mutations/CreateCourseMutation'

class CreateCourseForm extends Component {
  state = {
    error: null,
    description: "",
    name: "",
  }

  render() {
    const { name, description, error } = this.state
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="CreateCourseForm__name">Course name</label>
        <input
          id="CreateCourseForm__name"
          type="text"
          name="name"
          value={name}
          onChange={this.handleChange}
        />
        <label htmlFor="CreateCourseForm__description">Description (optional)</label>
        <input
          id="CreateCourseForm__description"
          type="description"
          name="description"
          value={description}
          onChange={this.handleChange}
        />
        <button type="submit">Create course</button>
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
    CreateCourseMutation(
      this.props.study.id,
      name,
      description,
      (response, error) => this.props.history.push(response.createCourse.resourcePath),
    )
  }
}

export default withRouter(createFragmentContainer(CreateCourseForm, graphql`
  fragment CreateCourseForm_study on Study {
    id
  }
`))
