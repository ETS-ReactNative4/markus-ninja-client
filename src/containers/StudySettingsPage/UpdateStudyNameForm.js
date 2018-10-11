import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import TextField, {Input} from '@material/react-text-field'
import UpdateStudyMutation from 'mutations/UpdateStudyMutation'
import { isNil } from 'utils'

class UpdateStudyNameForm extends React.Component {
  state = {
    error: null,
    name: this.props.study.name,
    originalName: this.props.study.name,
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

  get classes() {
    const {className} = this.props
    const {open} = this.state
    return cls("UpdateStudyNameForm mdc-layout-grid__inner", className, {
      open,
    })
  }

  render() {
    const {name} = this.state
    return (
      <form className={this.classes} onSubmit={this.handleSubmit}>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <TextField
            outlined
            label="Study name"
            floatingLabelClassName="mdc-floating-label--float-above"
          >
            <Input
              name="name"
              value={name}
              onChange={this.handleChange}
            />
          </TextField>
          <button
            className="mdc-button mdc-button--unelevated ml2"
            disabled={!this.state.dirty}
            type="submit"
          >
            Rename
          </button>
        </div>
      </form>
    )
  }
}

export default createFragmentContainer(UpdateStudyNameForm, graphql`
  fragment UpdateStudyNameForm_study on Study {
    id
    name
  }
`)
