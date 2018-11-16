import * as React from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import {Link} from 'react-router-dom'
import environment from 'Environment'
import LessonPreview from 'components/LessonPreview'
import IconLink from 'components/IconLink'
import Drawer from 'components/mdc/Drawer'
import SearchViewerStudies from './SearchViewerStudies'
import ViewerReceivedActivity from './ViewerReceivedActivity'
import {get} from 'utils'
import { EVENTS_PER_PAGE } from 'consts'

import "./styles.css"

const DashboardPageQuery = graphql`
  query DashboardPageQuery($count: Int!, $after: String) {
    viewer {
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
      login
      resourcePath
    }
  }
`

class DashboardPage extends React.Component {
  state = {
    drawerOpen: false,
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
                      <Link className="rn-link" to={props.viewer.resourcePath}>
                        {props.viewer.login}
                      </Link>
                    </Drawer.Title>
                    <Drawer.Subtitle>
                      <div className="flex relative items-center justify-start">
                        <h5 className="ma0">Studies</h5>
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
                <header className="DashboardPage__header rn-header rn-header--hero">
                  <div className="rn-header--hero__content">
                    <h3>
                      Welcome back
                      <Link className="rn-link rn-link--on-primary ml1" to={props.viewer.resourcePath}>
                        @{props.viewer.login}
                      </Link>
                    </h3>
                    <button
                      type="button"
                      className="mdc-button mdc-button--unelevated"
                      onClick={() => this.setState({drawerOpen: !drawerOpen})}
                    >
                      Search your studies
                    </button>
                  </div>
                </header>
                <div className="mdc-layout-grid rn-page">
                  <div className="mdc-layout-grid__inner">
                    <h5 className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                      Continue your lessons
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
