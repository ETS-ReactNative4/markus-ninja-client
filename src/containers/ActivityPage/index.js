import * as React from 'react'
import cls from 'classnames'
import {
  QueryRenderer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import {Route, Switch} from 'react-router-dom'
import environment from 'Environment'
import ActivityOverviewPage from 'containers/ActivityOverviewPage'
import NotFound from 'components/NotFound'
import ActivityHeader from './ActivityHeader'
import ActivityNav from './ActivityNav'
import { get, isNil } from 'utils'

import "./styles.css"

const ActivityPageQuery = graphql`
  query ActivityPageQuery(
    $owner: String!,
    $name: String!,
    $number: Int!,
  ) {
    study(owner: $owner, name: $name) {
      activity(number: $number) {
        id
        ...ActivityHeader_activity
        ...ActivityNav_activity
      }
    }
  }
`

class ActivityPage extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("ActivityPage rn-page mdc-layout-grid", className)
  }

  render() {
    const {match} = this.props

    return (
      <QueryRenderer
        environment={environment}
        query={ActivityPageQuery}
        variables={{
          owner: match.params.owner,
          name: match.params.name,
          number: parseInt(match.params.number, 10),
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const activity = get(props, "study.activity", null)
            if (isNil(activity)) {
              return <NotFound />
            }

            return (
              <div className={this.classes}>
                <div className="mdc-layout-grid__inner">
                  <ActivityHeader activity={activity} />
                  <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                    <ActivityNav activity={activity} />
                  </div>
                  <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                    <Switch>
                      <Route
                        exact
                        path="/u/:owner/:name/activity/:number"
                        render={(routeProps) => <ActivityOverviewPage {...routeProps} activity={activity} />}
                      />
                    </Switch>
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

export default ActivityPage
