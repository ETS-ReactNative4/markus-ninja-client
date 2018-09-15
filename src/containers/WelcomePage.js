import * as React from 'react'
import cls from 'classnames'
import SignupForm from 'components/SignupForm'

class WelcomePage extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("WelcomePage mdc-layout-grid", className)
  }

  render() {
    return (
      <div className={this.classes}>
        <div className="mdc-layout-grid__inner">
          <header className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <div className="flex items-center mw8 center pv4">
              <div className="inline-flex flex-column mr4">
                <h4>
                  Built for students
                </h4>
                <p className="mdc-typography--subtitle1">
                  RkusNinja is a learning platform inspired by an idea:
                  <blockquote>
                    "If you can't explain it simply, you really don't understand it yourself."
                  </blockquote>
                  I used GitHub as my model, but I repurposed it into something else.
                </p>
              </div>
              <SignupForm />
            </div>
          </header>
          <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
        </div>
      </div>
    )
  }
}

export default WelcomePage
