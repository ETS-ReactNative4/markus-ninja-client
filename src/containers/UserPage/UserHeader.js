import * as React from 'react'
import cls from 'classnames'
import moment from 'moment'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import TextField, {Input} from '@material/react-text-field'
import HTML from 'components/HTML'
import EnrollmentSelect from 'components/EnrollmentSelect'
import UpdateViewerProfileMutation from 'mutations/UpdateViewerProfileMutation'
import {get, isEmpty, isNil} from 'utils'

class UserHeader extends React.Component {
  state = {
    error: null,
    open: false,
    bio: this.props.user.bio,
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { bio } = this.state
    UpdateViewerProfileMutation(
      bio,
      null,
      null,
      (error) => {
        if (!isNil(error)) {
          this.setState({ error: error.message })
        }
        this.handleToggleOpen()
      },
    )
  }

  handleToggleOpen = () => {
    this.setState({ open: !this.state.open })
  }

  get classes() {
    const {className} = this.props
    return cls("UserHeader mdc-layout-grid__inner", className)
  }

  render() {
    const user = get(this.props, "user", {})
    const {open} = this.state

    return (
      <div className={this.classes}>
        {open && user.isViewer
        ? this.renderForm()
        : this.renderDetails()}
      </div>
    )
  }

  renderForm() {
    const bio = get(this.props, "user.bio")

    return (
      <form
        className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12"
        onSubmit={this.handleSubmit}
      >
        <TextField
          className="w-100"
          label="Add a bio"
          textarea
          floatingLabelClassName={!isEmpty(bio) ? "mdc-floating-label--float-above" : ""}
        >
          <Input
            name="bio"
            value={bio}
            onChange={this.handleChange}
          />
        </TextField>
        <div className="inline-flex items-center mt2">
          <button
            className="mdc-button mdc-button--unelevated"
            type="submit"
            onClick={this.handleSubmit}
          >
            Save
          </button>
          <button
            className="mdc-button mdc-button--outlined ml2"
            type="button"
            onClick={this.handleToggleOpen}
          >
            Cancel
          </button>
        </div>
      </form>
    )
  }

  renderDetails() {
    const user = get(this.props, "user", {})
    const userProp = get(this.props, "user", null)
    const email = get(user, "email.value", null)

    return (
      <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
        <div className="flex">
          <div className="inline-flex flex-column flex-auto">
            <h4>
              {user.login}
              {!isEmpty(user.name) &&
              <span className="ml1 v-btm mdc-typography--subtitle1 mdc-theme--text-secondary-on-light">
                ({user.name})
              </span>}
            </h4>
            <div className="mdc-typography--subtitle2 mdc-theme--text-secondary-on-light">
              {email &&
              <div className="User__email">email</div>}
              Joined on {moment(user.createdAt).format("MMM D, YYYY")}
            </div>
          </div>
          {user.viewerCanEnroll && !user.isViewer &&
          <EnrollmentSelect enrollable={userProp} />}
        </div>
        <div className="flex items-center w-100">
          <HTML className="flex-auto mdc-theme--text-secondary-on-light" html={user.bioHTML} />
          {user.isViewer &&
          <button
            className="mdc-icon-button material-icons"
            type="button"
            onClick={this.handleToggleOpen}
          >
            edit
          </button>}
        </div>
      </div>
    )
  }
}

export default withRouter(createFragmentContainer(UserHeader, graphql`
  fragment UserHeader_user on User {
    ...EnrollmentSelect_enrollable

    bio
    bioHTML
    createdAt
    email {
      value
    }
    id
    isViewer
    login
    name
    viewerCanEnroll
  }
`))
