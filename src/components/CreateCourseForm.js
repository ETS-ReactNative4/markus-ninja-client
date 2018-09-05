import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router-dom';
import TextField, {Input, HelperText} from '@material/react-text-field'
import Textarea from 'components/mdc/Textarea'
import CreateCourseMutation from 'mutations/CreateCourseMutation'
import { isNil } from 'utils'

class CreateCourseForm extends React.Component {
  state = {
    error: null,
    description: "",
    name: "",
  }

  get classes() {
    const {className} = this.props
    return cls("CreateCourseForm", className)
  }

  render() {
    const { name, description, error } = this.state
    return (
      <form className={this.classes} onSubmit={this.handleSubmit}>
        <div className="mdc-layout-grid__inner">
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-8-desktop mdc-layout-grid__cell--span-8-tablet">
            <TextField
              className="w-100"
              outlined
              label="Course name"
            >
              <Input
                name="name"
                value={name}
                onChange={this.handleChange}
              />
            </TextField>
          </div>
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <TextField
              textarea
              label="Description (optional)"
              helperText={<HelperText>Give a brief description of the course.</HelperText>}
            >
              <Textarea
                name="description"
                value={description}
                onChange={this.handleChange}
              />
            </TextField>
          </div>
          <div className="mdc-layout-grid__cell">
            <button className="mdc-button mdc-button--unelevated" type="submit">Create course</button>
          </div>
          <span>{error}</span>
        </div>
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
      (course, errors) => {
        if (!isNil(errors)) {
          this.setState({ error: errors[0].message })
          return
        }
        this.props.history.push(course.resourcePath)
      },
    )
  }
}

export default withRouter(createFragmentContainer(CreateCourseForm, graphql`
  fragment CreateCourseForm_study on Study {
    id
  }
`))
