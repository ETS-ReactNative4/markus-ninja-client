import * as React from 'react'
import cls from 'classnames'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import LessonPreview from 'components/LessonPreview'
import IconLink from 'components/IconLink'
import UserLink from 'components/UserLink'
import Drawer from 'components/mdc/Drawer'
import SearchViewerStudies from './SearchViewerStudies'
import ViewerReceivedActivity from './ViewerReceivedActivity'
import {get} from 'utils'
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
      lessons(first: 3, orderBy:{direction: DESC, field: UPDATED_AT}) {
        nodes {
          id
          ...CardLessonPreview_lesson
        }
      }
    }
  }
`

class DashboardPage extends React.Component {
  state = {
    drawerOpen: false,
  }

  get classes() {
    const {className} = this.props
    return cls("DashboardPage rn-page mdc-layout-grid", className)
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
            const {drawerOpen} = this.state

            return (
              <React.Fragment>
                <Drawer
                  modal
                  open={drawerOpen}
                  onClose={() => this.setState({drawerOpen: false})}
                >
                  <Drawer.Header>
                    <Drawer.Title>
                      <UserLink className="rn-link" user={props.viewer} />
                    </Drawer.Title>
                    <Drawer.Subtitle>
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
                    </Drawer.Subtitle>
                  </Drawer.Header>
                  <Drawer.Content>
                    <SearchViewerStudies />
                  </Drawer.Content>
                </Drawer>
                <div className={this.classes}>
                  <div className="mdc-layout-grid__inner">
                    <h4 className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                      Welcome back @
                      <UserLink className="rn-link" user={props.viewer} />!
                      <button
                        type="button"
                        className="mdc-button ml2"
                        onClick={() => this.setState({drawerOpen: !drawerOpen})}
                      >
                        Search your studies
                      </button>
                    </h4>
                    <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
                    <h5 className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                      Continue working on your lessons
                    </h5>
                    {get(props, "viewer.lessons.nodes", []).map((node) =>
                      node &&
                      <div key={node.id} className="mdc-layout-grid__cell">
                        <LessonPreview.Card className="h-100" lesson={node} />
                      </div>)}
                    <ViewerReceivedActivity viewer={props.viewer} />
                  </div>
                </div>
              </React.Fragment>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default DashboardPage
