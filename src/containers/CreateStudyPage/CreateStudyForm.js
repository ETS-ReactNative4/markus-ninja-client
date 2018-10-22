import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router-dom';
import {HelperText} from '@material/react-text-field'
import ErrorText from 'components/ErrorText'
import TextField, {defaultTextFieldState} from 'components/TextField'
import CreateStudyMutation from 'mutations/CreateStudyMutation'
import {get, isEmpty, replaceAll} from 'utils'

class CreateStudyForm extends React.Component {
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
    CreateStudyMutation(
      replaceAll(name.value, " ", "_"),
      description.value,
      (study, errors) => {
        if (!isEmpty(errors)) {
          this.setState({ error: errors[0].message })
          return
        }
        this.props.history.push(get(study, "resourcePath", ""))
      }
    )
  }

  get classes() {
    const {className} = this.props
    return cls("CreateStudyForm", className)
  }

  get formIsValid() {
    const {description, name} = this.state
    return !isEmpty(description.value) && description.valid &&
      !isEmpty(name.value) && name.valid
  }

  render() {
    const owner = get(this.props, "user.login", "")
    const {error, name} = this.state

    return (
      <form className={this.classes} onSubmit={this.handleSubmit}>
        <div className="mdc-layout-grid__inner">
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <TextField
              label="Owner"
              floatingLabelClassName="mdc-floating-label--float-above"
              inputProps={{
                value: owner,
                disabled: true,
              }}
            />
          </div>
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <TextField
              fullWidth
              label="Study name"
              helperText={
                <HelperText persistent>
                  {!isEmpty(name.value)
                  ? `Name will be ${replaceAll(name.value, " ", "_")}`
                  : ""}
                </HelperText>
              }
              inputProps={{
                name: "name",
                placeholder: "Study name*",
                required: true,
                maxLength: 39,
                onChange: this.handleChange,
              }}
            />
          </div>
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <TextField
              textarea
              label="Description (optional)"
              helperText={<HelperText>Give a brief description of the study.</HelperText>}
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
              Create study
            </button>
          </div>
          <ErrorText
            className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12"
            error={error}
          />
        </div>
      </form>
    )
  }
}

export default withRouter(createFragmentContainer(CreateStudyForm, graphql`
  fragment CreateStudyForm_user on User {
    login
  }
`))
