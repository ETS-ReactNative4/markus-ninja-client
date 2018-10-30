import * as React from 'react'
import cls from 'classnames'
import moment from 'moment'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import TextField, {defaultTextFieldState} from 'components/TextField'
import HTML from 'components/HTML'
import EnrollmentSelect from 'components/EnrollmentSelect'
import UpdateViewerProfileMutation from 'mutations/UpdateViewerProfileMutation'
import {get, isEmpty, isNil} from 'utils'

class UserHeader extends React.Component {
  state = {
    error: null,
    open: false,
    bio: {
      ...defaultTextFieldState,
      value: this.props.user.bio,
      valid: true,
    },
  }

  handleChange = (field) => {
    this.setState({
      [field.name]: field,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { bio } = this.state
    UpdateViewerProfileMutation(
      bio.value,
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
    this.reset_()
  }

  reset_ = () => {
    const user = get(this.props, "user", {})
    this.setState({
      error: null,
      bio: {
        ...defaultTextFieldState,
        value: user.bio,
        valid: true,
      },
    })
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
    const {bio} = this.state

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
          inputProps={{
            name: "bio",
            value: bio.value,
            onChange: this.handleChange,
          }}
        />
        <div className="inline-flex items-center mt2">
          <button
            type="submit"
            className="mdc-button mdc-button--unelevated"
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
              <div className="User__email">{email}</div>}
              Joined on {moment(user.createdAt).format("MMM D, YYYY")}
            </div>
          </div>
          {user.viewerCanEnroll && !user.isViewer &&
          <EnrollmentSelect enrollable={userProp} />}
        </div>
        <div className="flex items-center w-100">
          <div className="truncate">
            {isEmpty(user.bio)
            ? <div className="mdc-theme--text-secondary-on-light">No bio provided</div>
            : <HTML html={user.bioHTML} />}
          </div>
          <div className="ml-auto">
            {user.isViewer &&
            <button
              className="mdc-icon-button material-icons mdc-theme--text-icon-on-background"
              type="button"
              onClick={this.handleToggleOpen}
              aria-label="Edit bio"
              title="Edit bio"
            >
              edit
            </button>}
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(createFragmentContainer(UserHeader, graphql`
  fragment UserHeader_user on User {
    bio
    bioHTML
    createdAt
    email {
      value
    }
    enrollmentStatus
    id
    isViewer
    login
    name
    viewerCanEnroll
  }
`))
