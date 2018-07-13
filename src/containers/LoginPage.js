import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import LoginForm from 'components/LoginForm'

class LoginPage extends Component {
  render() {
    return (
      <div className="LoginPage">
        <LoginForm />
        <Link
          className="LoginPage__signup"
          to="/signup"
        >
          need to create an account?
        </Link>
      </div>
    )
  }
}

export default LoginPage
