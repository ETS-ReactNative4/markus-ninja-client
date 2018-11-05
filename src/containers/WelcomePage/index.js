import * as React from 'react'
import cls from 'classnames'
import {Link} from 'react-router-dom'
import SignupForm from 'components/SignupForm'

import './styles.css'

class WelcomePage extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("WelcomePage", className)
  }

  render() {
    return (
      <div className={this.classes}>
        <header className="WelcomePage__section WelcomePage__welcome">
          <div className="WelcomePage__section-content">
            <h3>Welcome</h3>
            <Link className="mdc-button mdc-button--unelevated" to="/signin">
              Sign in
            </Link>
            <Link className="mdc-button mdc-button--unelevated ml2" to="/signup">
              Sign up
            </Link>
          </div>
        </header>
        <section className="WelcomePage__section WelcomePage__who">
          <div className="WelcomePage__section-content">
            <h3>
              Built for Students
            </h3>
            <h5>
              We provide tools that will assist you in teaching others about what you're learning,
              and at the same time strengthen your own knowledge.
            </h5>
          </div>
        </section>
        <section className="WelcomePage__section WelcomePage__what">
          <div className="WelcomePage__section-content">
            <h3>
              Learning Platform
            </h3>
            <h5>
              Inspired by an idea:
              <blockquote>
                "If you can't explain it simply, you really don't understand it yourself."
              </blockquote>
            </h5>
          </div>
        </section>
        <section className="WelcomePage__section WelcomePage__why">
          <div className="WelcomePage__section-content">
            <h3>
              Inspired by an idea:
            </h3>
            <h5>
              <blockquote>
                "If you can't explain it simply, you really don't understand it yourself."
              </blockquote>
            </h5>
          </div>
        </section>
        <section className="WelcomePage__section WelcomePage__get-started">
          <div className="WelcomePage__section-content">
            <h3>
              Get started.
            </h3>
            <div className="mdc-layout-grid">
              <SignupForm />
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default WelcomePage
