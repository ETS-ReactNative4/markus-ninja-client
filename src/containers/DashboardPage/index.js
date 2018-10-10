import * as React from 'react'
import cls from 'classnames'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import UserLink from 'components/UserLink'
import SearchViewerStudies from './SearchViewerStudies'
import ViewerReceivedActivity from './ViewerReceivedActivity'
import { EVENTS_PER_PAGE } from 'consts'

import "./styles.css"

const DashboardPageQuery = graphql`
  query DashboardPageQuery($count: Int!, $after: String) {
    viewer {
      ...UserLink_user
      ...SearchViewerStudies_viewer
      ...ViewerReceivedActivity_viewer @arguments(
        count: $count,
        after: $after
      )
    }
  }
`

class DashboardPage extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("DashboardPage flex", className)
  }

  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={DashboardPageQuery}
        variables={{
          count: EVENTS_PER_PAGE,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return (
              <div className={this.classes}>
                <aside className="DashboardPage__nav mdc-drawer mdc-drawer--permanent">
                  <nav className="mdc-drawer__drawer">
                    <nav className="mdc-drawer__content">
                      <div className="mdc-list mdc-list--non-interactive">
                        <div className="mdc-list-item">
                          <UserLink className="rn-link mdc-typography--headline5" user={props.viewer} />
                        </div>
                        <SearchViewerStudies viewer={props.viewer} />
                      </div>
                    </nav>
                  </nav>
                </aside>
                <div className="flex-auto">
                  <ViewerReceivedActivity viewer={props.viewer} />
                </div>
              </div>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default DashboardPage
