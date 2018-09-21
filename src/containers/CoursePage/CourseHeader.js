import * as React from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import TextField, {Input} from '@material/react-text-field'
import AppleButton from 'components/AppleButton'
import StudyLink from 'components/StudyLink'
import UpdateCourseMutation from 'mutations/UpdateCourseMutation'
import UserLink from 'components/UserLink'
import {get, isEmpty, isNil} from 'utils'

class CourseHeader extends React.Component {
  state = {
    edit: false,
    error: null,
    name: this.props.course.name,
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const {name} = this.state
    UpdateCourseMutation(
      get(this.props, "course.id", ""),
      null,
      name,
      (updatedCourse, errors) => {
        if (!isNil(errors)) {
          this.setState({ error: errors[0].message })
        }
        this.handleToggleEdit()
        this.setState({
          name: get(updatedCourse, "name", ""),
        })
      },
    )
  }

  handleToggleEdit = () => {
    this.setState({ edit: !this.state.edit })
  }

  render() {
    const course = get(this.props, "course", {})
    const {edit} = this.state

    return (
      <React.Fragment>
        {edit && course.viewerCanAdmin
        ? this.renderForm()
        : this.renderDetails()}
      </React.Fragment>
    )
  }

  renderDetails() {
    const course = get(this.props, "course", null)

    return (
      <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
        <h5 className="rn-header">
          <UserLink className="rn-link" user={get(course, "study.owner", null)} />
          <span>/</span>
          <StudyLink className="rn-link" study={get(course, "study", null)} />
          <span>/</span>
          <span>
            <span className="fw5">{get(course, "name", "")}</span>
            <span className="mdc-theme--text-hint-on-light ml2">#{get(course, "number", 0)}</span>
          </span>
          <div className="rn-header__meta">
            <div className="rn-combo-button">
              <AppleButton appleable={course} />
              <button className="rn-combo-button__count">
                {get(course, "appleGivers.totalCount", 0)}
              </button>
            </div>
            {course.viewerCanAdmin &&
            <button
              className="material-icons mdc-icon-button"
              type="button"
              onClick={this.handleToggleEdit}
            >
              edit
            </button>}
          </div>
        </h5>
      </div>
    )
  }

  renderForm() {
    const {name} = this.state

    return (
      <form
        className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12"
        onSubmit={this.handleSubmit}
      >
        <div className="inline-flex items-center w-100">
          <TextField
            className="flex-auto"
            outlined
            label="Name"
            floatingLabelClassName={!isEmpty(name) ? "mdc-floating-label--float-above" : ""}
          >
            <Input
              name="name"
              value={name}
              onChange={this.handleChange}
            />
          </TextField>
          <button
            className="mdc-button mdc-button--unelevated ml2"
            type="submit"
            onClick={this.handleSubmit}
          >
            Save
          </button>
          <span
            className="pointer pa2"
            role="button"
            onClick={this.handleToggleEdit}
          >
            Cancel
          </span>
        </div>
      </form>
      )
    }
}

export default withRouter(createFragmentContainer(CourseHeader, graphql`
  fragment CourseHeader_course on Course {
    ...AppleButton_appleable
    id
    advancedAt
    appleGivers(first: 0) {
      totalCount
    }
    createdAt
    name
    number
    study {
      ...StudyLink_study
      resourcePath
      owner {
        ...UserLink_user
      }
    }
    updatedAt
    viewerCanAdmin
  }
`))
