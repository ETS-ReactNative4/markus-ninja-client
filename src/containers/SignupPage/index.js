import * as React from 'react'
import cls from 'classnames'
import SignupForm from 'components/SignupForm'

class SignupPage extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("SignupPage mdc-layout-grid mw8 center", className)
  }

  render() {
    return (
      <div className={this.classes}>
        <div className="mdc-layout-grid__inner">
          <header className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <h4>Join RkusNinja</h4>
            <p className="mdc-typography--subtitle1">Start learning/teaching today.</p>
          </header>
          <h5 className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            Create your account
          </h5>
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <div className="mw6">
              <SignupForm />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SignupPage
