import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import TextField, {Input} from '@material/react-text-field'
import UpdateCourseMutation from 'mutations/UpdateCourseMutation'
import {get, isNil} from 'utils'

class UpdateCourseNameForm extends React.Component {
  state = {
    error: null,
    name: get(this.props, "course.name", ""),
    originalName: get(this.props, "course.name", ""),
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
    UpdateCourseMutation(
      this.props.course.id,
      null,
      name,
      (updatedCourse, errors) => {
        if (!isNil(errors)) {
          this.setState({ error: errors[0].message })
        }
        this.setState({
          dirty: false,
          name: get(updatedCourse, "name", ""),
        })
      },
    )
  }

  get classes() {
    const {className} = this.props
    return cls("UpdateCourseNameForm mdc-layout-grid__inner", className)
  }

  render() {
    const {name} = this.state

    return (
      <form className={this.classes} onSubmit={this.handleSubmit}>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <TextField
            outlined
            label="Course name"
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

export default createFragmentContainer(UpdateCourseNameForm, graphql`
  fragment UpdateCourseNameForm_course on Course {
    id
    name
  }
`)
