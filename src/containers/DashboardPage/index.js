import React, {Component} from 'react'
import {
  createFragmentContainer,
  QueryRenderer,
  graphql,
} from 'react-relay'
import cls from 'classnames'
import environment from 'Environment'
import UserLink from 'components/UserLink'
import SearchViewerStudies from './SearchViewerStudies'
import { get } from 'utils'

import { SEARCH_BAR_RESULTS_PER_PAGE } from 'consts'

const DashboardPageQuery = graphql`
  query DashboardPageQuery($count: Int!, $after: String, $query: String!, $within: ID!) {
    ...SearchUserStudiesInput_query @arguments(count: $count, after: $after, query: $query, within: $within)
  }
`

class DashboardPage extends Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={DashboardPageQuery}
        variables={{
          count: SEARCH_BAR_RESULTS_PER_PAGE,
          query: "*",
          within: get(this.props, "viewer.id"),
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return (
              <div className="DashboardPage inline-flex">
                <aside className="mdc-drawer mdc-drawer--permanent">
                  <nav className="mdc-drawer__drawer">
                    <nav className="mdc-drawer__content">
                      <div className="mdc-list mdc-list--non-interactive">
                        <div className="mdc-list-item">
                          <UserLink className="mdc-typography--headline5" user={this.props.viewer} />
                        </div>
                        <SearchViewerStudies query={props} viewer={this.props.viewer} />
                      </div>
                    </nav>
                  </nav>
                </aside>
                <div className="mdc-layout-grid">
                  <div className="mdc-layout-grid__inner">
                    <div
                      className={cls(
                        "mdc-layout-grid__inner",
                        "mdc-layout-grid__cell--span-8-desktop",
                        "mdc-layout-grid__cell--span-5-tablet",
                        "mdc-layout-grid__cell--span-4-phone",
                      )}
                    >
                      Activity
                    </div>
                    <div
                      className={cls(
                        "mdc-layout-grid__inner",
                        "mdc-layout-grid__cell--span-4-desktop",
                        "mdc-layout-grid__cell--span-3-tablet",
                        "mdc-layout-grid__cell--span-4-phone",
                      )}
                    >
                      Research studies
                    </div>
                  </div>
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

export default createFragmentContainer(DashboardPage, graphql`
  fragment DashboardPage_viewer on User {
    id
    ...UserLink_user
    ...SearchViewerStudies_viewer
  }
`)
