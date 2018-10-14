import * as React from 'react'
import cls from 'classnames'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import IconLink from 'components/IconLink'
import UserLink from 'components/UserLink'
import SearchViewerStudies from './SearchViewerStudies'
import ViewerReceivedActivity from './ViewerReceivedActivity'
import { EVENTS_PER_PAGE } from 'consts'

import "./styles.css"

const DashboardPageQuery = graphql`
  query DashboardPageQuery($count: Int!, $after: String) {
    viewer {
      ...UserLink_user
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
    return cls("DashboardPage rn-page", className)
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
                <aside className="DashboardPage__nav mdc-drawer">
                  <div className="mdc-drawer__header">
                    <h4 className="mdc-drawer__title">
                      <UserLink className="rn-link" user={props.viewer} />
                    </h4>
                    <h6 className="mdc-drawer__subtitle">
                      <div className="flex relative items-center justify-start">
                        <span>
                          Studies
                        </span>
                        <span className="ml-auto mr0">
                          <IconLink
                            className="mdc-icon-button ml-auto mr0" to="/new"
                            aria-label="New study"
                            title="New study"
                          >
                            add
                          </IconLink>
                        </span>
                      </div>
                    </h6>
                  </div>
                  <div className="mdc-drawer__content">
                    <SearchViewerStudies />
                  </div>
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
