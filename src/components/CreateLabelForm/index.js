import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router-dom';
import TextField, {Input} from '@material/react-text-field'
import { GithubPicker } from 'react-color'
import CreateLabelMutation from 'mutations/CreateLabelMutation'
import { isNil } from 'utils'

import "./styles.css"

class CreateLabelForm extends React.Component {
  state = {
    error: null,
    color: "",
    description: "",
    name: "",
  }

  get classes() {
    const {className} = this.props
    return cls("CreateLabelForm", className)
  }

  render() {
    const {color, description, name} = this.state
    return (
      <form
        className="CreateLabelForm"
        onSubmit={this.handleSubmit}
      >
        <TextField
          outlined
          label="Label name"
        >
          <Input
            name="name"
            value={name}
            onChange={this.handleChange}
          />
        </TextField>
        <TextField
          outlined
          label="Description (optional)"
        >
          <Input
            name="description"
            value={description}
            onChange={this.handleChange}
          />
        </TextField>
        <div className="CreateLabelForm__color-input">
          <TextField
            outlined
            label="Color"
          >
            <Input
              name="color"
              value={color}
              onChange={this.handleChange}
            />
          </TextField>
          <div className="CreateLabelForm__color-picker">
            <GithubPicker onChangeComplete={this.handleChangeComplete} />
          </div>
        </div>
        <button
          className="mdc-button mdc-button--unelevated"
          type="submit"
        >
          Create label
        </button>
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
