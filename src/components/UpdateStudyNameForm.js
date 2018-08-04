import React, {Component} from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import UpdateStudyMutation from 'mutations/UpdateStudyMutation'
import { isNil } from 'utils'

class UpdateStudyNameForm extends Component {
  state = {
    error: null,
    name: this.props.study.name,
    originalName: this.props.study.name,
  }

  render() {
    const { error, name } = this.state
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="UpdateStudyNameForm__name">Study name</label>
        <input
          id="UpdateStudyNameForm__name"
          type="text"
          name="name"
          value={name}
          onChange={this.handleChange}
        />
        <button
          disabled={!this.state.dirty}
          type="submit"
        >
          Rename
        </button>
        <span>{error}</span>
      </form>
    )
  }

  handleChange = (e) => {
    this.setState({
      name: e.target.value,
    })
    if (this.state.originalName !== e.target.value) {
      this.setState({
        dirty: true,
      })
    } else if (this.state.dirty) {
      this.setState({
        dirty: false,
      })
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { name } = this.state
    UpdateStudyMutation(
      this.props.study.id,
      null,
      name,
      (error) => {
        if (!isNil(error)) {
          this.setState({ error: error.message })
        }
        this.setState({ dirty: false })
      },
    )
  }
}

export default createFragmentContainer(UpdateStudyNameForm, graphql`
  fragment UpdateStudyNameForm_study on Study {
    id
    name
  }
`)
