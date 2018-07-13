import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import SignupForm from 'components/SignupForm'

class SignupPage extends Component {
  render() {
    return (
      <div className="SignupPage">
        <SignupForm />
        <Link
          className="SignupPage__login"
          to="/login"
        >
          already have an account?
        </Link>
      </div>
    )
  }
}

export default SignupPage
