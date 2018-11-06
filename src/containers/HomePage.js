import * as React from 'react'
import DashboardPage from 'containers/DashboardPage'
import WelcomePage from 'containers/WelcomePage'
import Context from 'containers/App/Context'

class HomePage extends React.Component {
  render() {
    return (
      <React.Fragment>
        {!this.context.isAuthenticated()
        ? <WelcomePage />
        : <DashboardPage />}
      </React.Fragment>
    )
  }
}

HomePage.contextType = Context

export default HomePage
