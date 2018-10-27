import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link, withRouter } from 'react-router-dom'
import TextField, {Input} from '@material/react-text-field'
import Icon from 'components/Icon'
import AppleButton from 'components/AppleButton'
import StudyLink from 'components/StudyLink'
import UserLink from 'components/UserLink'
import UpdateCourseMutation from 'mutations/UpdateCourseMutation'
import {get, isEmpty} from 'utils'

class CourseHeader extends React.Component {
  state = {
    error: null,
    open: false,
    name: this.props.course.name,
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { name } = this.state
    UpdateCourseMutation(
      this.props.course.id,
      null,
      name,
      (updatedCourse, errors) => {
        if (errors) {
          this.setState({ error: errors[0].message })
        }
        this.handleToggleOpen()
        this.setState({
          name: get(updatedCourse, "name", ""),
        })
      },
    )
  }

  handleToggleOpen = () => {
    this.setState({ open: !this.state.open })
  }

  get classes() {
    const {className} = this.props
    return cls("mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const course = get(this.props, "course", {})
    const {open} = this.state

    return (
      <div className={this.classes}>
        {open && course.viewerCanAdmin
        ? this.renderForm()
        : this.renderHeader()}
      </div>
    )
  }

  renderForm() {
    const {name} = this.state

    return (
      <form onSubmit={this.handleSubmit}>
        <div className="inline-flex items-center flex-wrap w-100">
          <TextField
            className="flex-auto"
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
          <button
            className="mdc-button ml2"
            type="button"
            onClick={this.handleToggleOpen}
          >
            Cancel
          </button>
        </div>
      </form>
    )
  }

  renderHeader() {
    const course = get(this.props, "course", null)

    return (
      <header className="rn-header">
        <h5 className="rn-file-path">
          <UserLink className="rn-link rn-file-path__directory" user={get(course, "study.owner", null)} />
          <span className="rn-file-path__separator">/</span>
          <StudyLink className="rn-link rn-file-path__directory" study={get(course, "study", null)} />
          <span className="rn-file-path__separator">/</span>
          <span className="rn-file-path__file">
            <span className="rn-file-path__file__text">
              <Icon className="v-mid mr1" icon="course" />
              <span className="fw5">{get(course, "name", "")}</span>
              <span className="mdc-theme--text-hint-on-light ml2">#{get(course, "number", 0)}</span>
            </span>
            {course.viewerCanAdmin &&
            <button
              className="material-icons mdc-icon-button rn-file-path__file__icon"
              type="button"
              onClick={this.handleToggleOpen}
              aria-label="Edit name"
              title="Edit name"
            >
              edit
            </button>}
          </span>
        </h5>
        <div className="rn-header__actions">
          <div className="rn-combo-button rn-header__action rn-header__action--button">
            <AppleButton appleable={course} />
            <Link
              className="rn-combo-button__count"
              to={course.resourcePath+"/applegivers"}
            >
              {get(course, "appleGivers.totalCount", 0)}
            </Link>
          </div>
        </div>
      </header>
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
    resourcePath
    study {
      ...StudyLink_study
      owner {
        ...UserLink_user
      }
    }
    updatedAt
    viewerCanAdmin
  }
`))
