import * as React from 'react'
import DashboardPage from 'containers/DashboardPage'
import WelcomePage from 'containers/WelcomePage'
import {get, isNil} from 'utils'

class HomePage extends React.Component {
  render() {
    const viewer = get(this.props, "viewer", null)

    return (
      <div className="HomePage">
        {isNil(viewer)
        ? <WelcomePage />
        : <DashboardPage />}
      </div>
    )
  }
}

export default HomePage
