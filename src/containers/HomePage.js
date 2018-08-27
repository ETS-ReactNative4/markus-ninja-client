import * as React from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import DashboardPage from 'containers/DashboardPage'
import WelcomePage from 'containers/WelcomePage'
import { get } from 'utils'
import { isAuthenticated } from 'auth'

class HomePage extends React.Component {
  render() {
    const viewer = get(this.props, "viewer", null)

    return (
      <div className="HomePage">
        {isAuthenticated()
        ? <DashboardPage viewer={viewer}/>
        : <WelcomePage />}
      </div>
    )
  }
}

export default createFragmentContainer(HomePage, graphql`
  fragment HomePage_viewer on User {
    ...DashboardPage_viewer
  }
`)
