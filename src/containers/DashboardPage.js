import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import cls from 'classnames'
import environment from 'Environment'
import { isNil } from 'utils'
import UserLink from 'components/UserLink'
import NotFound from 'components/NotFound'
import SearchViewerStudies from 'components/SearchViewerStudies'

import { SEARCH_BAR_RESULTS_PER_PAGE } from 'consts'

const DashboardPageQuery = graphql`
  query DashboardPageQuery($count: Int!, $after: String, $query: String!) {
    ...SearchViewerStudies_query @arguments(count: $count, after: $after, query: $query)
    viewer {
      id
      ...UserLink_user
    }
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
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            if (isNil(props.viewer)) {
              return <NotFound />
            }
            return (
              <div className="DashboardPage inline-flex">
                <aside className="mdc-drawer mdc-drawer--permanent">
                  <nav className="mdc-drawer__drawer">
                    <nav className="mdc-drawer__content">
                      <div className="mdc-list mdc-list--non-interactive">
                        <UserLink className="mdc-list-item" user={props.viewer} />
                        <SearchViewerStudies query={props} />
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

export default DashboardPage
