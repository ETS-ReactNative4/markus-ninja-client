import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import TextField, {Input} from '@material/react-text-field'
import Select from '@material/react-select'
import UpdateViewerProfileMutation from 'mutations/UpdateViewerProfileMutation'
import { get, isEmpty, isNil } from 'utils'

class UserProfileForm extends React.Component {
  state = {
    bio: this.props.user.bio,
    emailId: get(this.props, "user.email.id", ""),
    name: this.props.user.name,
    error: null,
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { bio, emailId, name } = this.state
    UpdateViewerProfileMutation(
      bio,
      emailId,
      name,
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
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <Select
            className="rn-select"
            floatingLabelClassName={!isEmpty(emailId) ? "mdc-floating-label--float-above" : ""}
            outlined
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
          >
            <Input
              name="bio"
              value={bio}
              onChange={this.handleChange}
            />
          </TextField>
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
