import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import getHistory from 'react-router-global-history'
import {HelperText} from '@material/react-text-field'
import ErrorText from 'components/ErrorText'
import TextField, {defaultTextFieldState} from 'components/TextField'
import CreateActivityMutation from 'mutations/CreateActivityMutation'
import {isEmpty, isNil} from 'utils'

class CreateActivityForm extends React.Component {
  state = {
    error: null,
    description: defaultTextFieldState,
    name: defaultTextFieldState,
  }

  handleChange = (field) => {
    this.setState({
      [field.name]: field,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { description, name } = this.state
    CreateActivityMutation(
      this.props.study.id,
      name.value,
      description.value,
      (activity, errors) => {
        if (!isNil(errors)) {
          this.setState({ error: errors[0].message })
          return
        }
        getHistory().push(activity.resourcePath)
      },
    )
  }

  get classes() {
    const {className} = this.props
    return cls("CreateActivityForm mdc-layout-grid__inner", className)
  }

  get isFormValid() {
    const {description, name} = this.state
    return !isEmpty(name.value) && name.valid &&
      description.valid
  }

  render() {
    const {error} = this.state

    return (
      <form className={this.classes} onSubmit={this.handleSubmit}>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-8-desktop mdc-layout-grid__cell--span-8-tablet">
          <TextField
            className="rn-form__input"
            label="Activity name"
            inputProps={{
              name: "name",
              required: true,
              onChange: this.handleChange,
            }}
          />
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <TextField
            textarea
            label="Description (optional)"
            helperText={<HelperText>Give a brief description of the activity.</HelperText>}
            inputProps={{
              name: "description",
              onChange: this.handleChange,
            }}
          />
        </div>
        <div className="mdc-layout-grid__cell">
          <button
            type="submit"
            className="mdc-button mdc-button--unelevated"
          >
            Create activity
          </button>
        </div>
        <ErrorText
          className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12"
          error={error}
        />
      </form>
    )
  }
}

export default createFragmentContainer(CreateActivityForm, graphql`
  fragment CreateActivityForm_study on Study {
    id
  }
`)
