import * as React from 'react'
import cls from 'classnames'
import { Link } from 'react-router-dom'

class WelcomePage extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("WelcomePage mdc-layout-grid", className)
  }

  render() {
    return (
      <div className={this.classes}>
        <div className="mdc-layout-grid__inner">
          <h4 className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            Welcome
          </h4>
          <Link to="/login">
            Already have an account?
          </Link>
          {` `}
          <Link to="/signup">
            Need to create an account?
          </Link>
        </div>
      </div>
    )
  }
}

export default WelcomePage
