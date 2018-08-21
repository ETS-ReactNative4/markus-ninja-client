import * as React from 'react'
import { Link } from 'react-router-dom'

class WelcomePage extends React.Component {
  render() {
    return (
      <div className="WelcomePage">
        <h2>Welcome</h2>
        <Link to="/login">
          Already have an account?
        </Link>
        {` `}
        <Link to="/signup">
          Need to create an account?
        </Link>
      </div>
    )
  }
}

export default WelcomePage
