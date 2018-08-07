import React, {Component} from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router-dom';
import { GithubPicker } from 'react-color'
import CreateLabelMutation from 'mutations/CreateLabelMutation'
import { isNil } from 'utils'

import './CreateLabelForm.css'

class CreateLabelForm extends Component {
  state = {
    error: null,
    color: "",
    description: "",
    name: "",
  }

  render() {
    const { color, description, name, error } = this.state
    return (
      <form
        className="CreateLabelForm"
        onSubmit={this.handleSubmit}
      >
        <label htmlFor="label-name">Label name</label>
        <input
          id="label-name"
          type="text"
          name="name"
          value={name}
          onChange={this.handleChange}
        />
        <label htmlFor="label-description">Description (optional)</label>
        <input
          id="label-description"
          type="text"
          name="description"
          value={description}
          onChange={this.handleChange}
        />
        <label htmlFor="label-description">Color</label>
        <input
          id="label-color"
          className="CreateLabelForm__color-input"
          type="text"
          name="color"
          value={color}
        />
        <GithubPicker
          className="CreateLabelForm__color-picker"
          onChangeComplete={this.handleChangeComplete}
        />
        <button type="submit">Create label</button>
        <span>{error}</span>
      </form>
    )
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleChangeComplete = (color, event) => {
    this.setState({ color: color.hex });
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { color, description, name } = this.state
    CreateLabelMutation(
      this.props.study.id,
      name,
      description,
      color,
      (response, error) => {
        console.error(error)
        if (!isNil(error)) {
          this.setState({ error: error[0].message })
        }
      },
    )
  }
}

export default withRouter(createFragmentContainer(CreateLabelForm, graphql`
  fragment CreateLabelForm_study on Study {
    id
  }
`))
