import * as React from 'react'
import ViewerStudiesPage from 'containers/ViewerStudiesPage'
import WelcomePage from 'containers/WelcomePage'
import { isAuthenticated } from 'auth'

class HomePage extends React.Component {
  render() {
    return (
      <div className="HomePage">
        {isAuthenticated()
        ? <ViewerStudiesPage />
        : <WelcomePage />}
      </div>
    )
  }
}

export default HomePage
