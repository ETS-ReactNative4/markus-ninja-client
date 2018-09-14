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
import StudyPreview from 'components/StudyPreview'
import {get} from 'utils'
import { EVENTS_PER_PAGE } from 'consts'

import "./styles.css"

const DashboardPageQuery = graphql`
  query DashboardPageQuery($count: Int!, $after: String) {
    researchStudies: search(first: 3, query: "*", type: STUDY, orderBy:{direction:DESC, field:APPLE_COUNT}) {
      edges {
        node {
          id
          ...on Study {
            ...StudyPreview_study
          }
        }
      }
    }
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
            const researchStudyEdges = get(props, "researchStudies.edges", [])

            return (
              <div className={this.classes}>
                <aside className="DashboardPage__nav mdc-drawer mdc-drawer--permanent">
                  <nav className="mdc-drawer__drawer">
                    <nav className="mdc-drawer__content">
                      <div className="mdc-list mdc-list--non-interactive">
                        <div className="mdc-list-item">
                          <UserLink className="mdc-typography--headline5" user={props.viewer} />
                        </div>
                        <SearchViewerStudies viewer={props.viewer} />
                      </div>
                    </nav>
                  </nav>
                </aside>
                <div className="flex-auto">
                  <div className="mdc-layout-grid">
                    <div className="mdc-layout-grid__inner">
                      <div
                        className={cls(
                          "mdc-layout-grid__cell",
                          "mdc-layout-grid__cell--span-8-desktop",
                          "mdc-layout-grid__cell--span-8-tablet",
                          "mdc-layout-grid__cell--span-4-phone",
                        )}
                      >
                        <ViewerReceivedActivity viewer={props.viewer} />
                      </div>
                      <div
                        className={cls(
                          "mdc-layout-grid__cell",
                          "mdc-layout-grid__cell--span-4-desktop",
                          "mdc-layout-grid__cell--span-8-tablet",
                          "mdc-layout-grid__cell--span-4-phone",
                        )}
                      >
                        <div className="mdc-layout-grid__inner">
                          <h5 className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                            Research studies
                          </h5>
                          {researchStudyEdges.map(({node}) => (
                            <React.Fragment key={node.id}>
                              <StudyPreview.User
                                className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12"
                                study={node}
                              />
                              <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12"/>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
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
