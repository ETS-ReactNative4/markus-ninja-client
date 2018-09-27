import * as React from 'react'
import DashboardPage from 'containers/DashboardPage'
import WelcomePage from 'containers/WelcomePage'
import {isAuthenticated} from 'auth'

class HomePage extends React.Component {
  render() {
    return (
      <div className="HomePage">
        {isAuthenticated()
        ? <DashboardPage />
        : <WelcomePage />}
      </div>
    )
  }
}

export default HomePage
