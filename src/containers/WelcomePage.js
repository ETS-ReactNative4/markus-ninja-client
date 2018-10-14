import * as React from 'react'
import cls from 'classnames'

class WelcomePage extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("WelcomePage rn-page mdc-layout-grid", className)
  }

  render() {
    return (
      <div className={this.classes}>
        <div className="mdc-layout-grid__inner">
          <header className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <div className="flex flex-column items-center">
              <h4>
                Built for students
              </h4>
              <p className="mdc-typography--subtitle1">
                RkusNinja is a learning platform inspired by an idea:
              </p>
              <blockquote>
                "If you can't explain it simply, you really don't understand it yourself."
              </blockquote>
            </div>
          </header>
          <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
        </div>
      </div>
    )
  }
}

export default WelcomePage
