import * as React from 'react'
import cls from 'classnames'
import TextField, {Input, HelperText} from '@material/react-text-field'
import CreateUserMutation from 'mutations/CreateUserMutation'

class SignupForm extends React.Component {
  state = {
    error: null,
    email: "",
    username: "",
    password: "",
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { email, username, password } = this.state
    CreateUserMutation(email, username, password, (token, error) => {
      if (error !== null) {
        this.setState({ error: error.message })
      }
      window.sessionStorage.setItem("access_token", token.token)
      this.props.history.push("/")
    })
  }

  get classes() {
    const {className} = this.props
    return cls("SignupForm mdc-layout-grid__inner", className)
  }

  render() {
    const {email, username, password} = this.state
    return (
      <form
        className={this.classes}
        onSubmit={this.handleSubmit}
      >
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <TextField
            className="w-100"
            outlined
            label="Username"
            helperText={<HelperText persistent>This will be your username.</HelperText>}
          >
            <Input
              name="username"
              value={username}
              onChange={this.handleChange}
            />
          </TextField>
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <TextField
            className="w-100"
            outlined
            label="Email address"
            helperText={
              <HelperText persistent>
                We'll occasionally send updates about your account to this inbox.
                We'll never share your email address with anyone.
              </HelperText>
            }
          >
            <Input
              name="email"
              value={email}
              onChange={this.handleChange}
            />
          </TextField>
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <TextField
            className="w-100"
            outlined
            label="Password"
            helperText={
              <HelperText persistent>
                Use at least one lowercase letter, one numeral, and seven characters.
              </HelperText>
            }
          >
            <Input
              type="password"
              name="password"
              value={password}
              onChange={this.handleChange}
            />
          </TextField>
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <button
            className="mdc-button mdc-button--unelevated"
            type="submit"
          >
            Create an account
          </button>
        </div>
      </form>
    )
  }
}

export default SignupForm
