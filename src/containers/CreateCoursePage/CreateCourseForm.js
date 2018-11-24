import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { withRouter } from 'react-router-dom';
import getHistory from 'react-router-global-history'
import {HelperText} from '@material/react-text-field'
import ErrorText from 'components/ErrorText'
import TextField, {defaultTextFieldState} from 'components/TextField'
import CreateCourseMutation from 'mutations/CreateCourseMutation'
import {isEmpty, isNil} from 'utils'

class CreateCourseForm extends React.Component {
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
    CreateCourseMutation(
      this.props.study.id,
      name.value,
      description.value,
      (course, errors) => {
        if (!isNil(errors)) {
          this.setState({ error: errors[0].message })
          return
        }
        getHistory().push(course.resourcePath)
      },
    )
  }

  get classes() {
    const {className} = this.props
    return cls("CreateCourseForm mdc-layout-grid__inner", className)
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
            label="Course name"
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
            helperText={<HelperText>Give a brief description of the course.</HelperText>}
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
            Create course
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

export default withRouter(createFragmentContainer(CreateCourseForm, graphql`
  fragment CreateCourseForm_study on Study {
    id
  }
`))
