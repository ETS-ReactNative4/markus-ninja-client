import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import Select from '@material/react-select'
import TextField, {defaultTextFieldState} from 'components/TextField'
import UpdateViewerProfileMutation from 'mutations/UpdateViewerProfileMutation'
import { get, isEmpty, isNil } from 'utils'

class UserProfileForm extends React.Component {
  constructor(props) {
    super(props)

    const bio = get(this.props, "user.bio", "")
    const name = get(this.props, "user.name", "")

    this.state = {
      bio: {
        ...defaultTextFieldState,
        initialValue: bio,
        valid: true,
        value: bio,
      },
      emailId: get(this.props, "user.email.id", ""),
      name: {
        ...defaultTextFieldState,
        initialValue: name,
        valid: true,
        value: name,
      },
      error: null,
    }
  }

  handleChange = (field) => {
    this.setState({
      error: null,
      [field.name]: field,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { bio, emailId, name } = this.state
    UpdateViewerProfileMutation(
      bio.value,
      emailId,
      name.value,
      (error) => {
        if (!isNil(error)) {
          this.setState({ error: error.message })
        }
      },
    )
  }

  get classes() {
    const {className} = this.props
    return cls("UserProfileForm mdc-layout-grid__inner", className)
  }

  get options() {
    const emailEdges = get(this.props, "user.emails.edges", [])
    const options = [{
      label: "",
      value: "",
    }]
    emailEdges.map(({node}) => node && options.push({
      label: node.value,
      value: node.id,
    }))

    return options
  }

  render() {
    const {bio, emailId, name} = this.state
    const emailEdges = get(this.props, "user.emails.edges", [])
    return (
      <form className={this.classes} onSubmit={this.handleSubmit}>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <TextField
            className="rn-form__input"
            label="Name"
            floatingLabelClassName={!isEmpty(name) ? "mdc-floating-label--float-above" : ""}
            inputProps={{
              name: "name",
              value: name.value,
              onChange: this.handleChange,
            }}
          />
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <Select
            className="rn-select"
            floatingLabelClassName={!isEmpty(emailId) ? "mdc-floating-label--float-above" : ""}
            label="Public email"
            name="emailId"
            value={emailId}
            onChange={this.handleChange}
            disabled={isEmpty(emailEdges)}
            options={this.options}
          />
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <TextField
            className="rn-form__input"
            label="Bio"
            textarea
            floatingLabelClassName={!isEmpty(bio) ? "mdc-floating-label--float-above" : ""}
            inputProps={{
              name: "bio",
              value: bio.value,
              onChange: this.handleChange,
            }}
          />
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <button
            className="mdc-button mdc-button--unelevated"
            type="submit"
          >
            Update profile
          </button>
        </div>
      </form>
    )
  }
}

export default createFragmentContainer(UserProfileForm, graphql`
  fragment UserProfileForm_user on User {
    id
    bio
    email {
      id
      value
    }
    emails(first: 5, filterBy:{isVerified: true}) {
      edges {
        node {
          id
          value
        }
      }
    }
    name
  }
`)
