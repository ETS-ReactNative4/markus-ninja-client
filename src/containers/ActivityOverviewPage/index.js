import * as React from 'react'
import cls from 'classnames'
import {
  QueryRenderer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'Environment'
import { withRouter } from 'react-router'
import { get } from 'utils'
import ActivityAssets from './ActivityAssets'
import ActivityMeta from './ActivityMeta'
import {isNil} from 'utils'

import {ASSETS_PER_PAGE} from 'consts'

import "./styles.css"

const ActivityOverviewPageQuery = graphql`
  query ActivityOverviewPageQuery(
    $owner: String!,
    $name: String!,
    $number: Int!,
    $assetCount: Int!,
    $afterAsset: String,
  ) {
    study(owner: $owner, name: $name) {
      activity(number: $number) {
        ...ActivityAssets_activity @arguments(
          after: $afterAsset,
          count: $assetCount,
        )
        ...ActivityMeta_activity
      }
    }
  }
`

class ActivityOverviewPage extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("ActivityOverviewPage mdc-layout-grid__inner", className)
  }

  render() {
    const activity = get(this.props, "activity", null)
    if (isNil(activity)) {
      return null
    }
    return (
      <QueryRenderer
        environment={environment}
        query={ActivityOverviewPageQuery}
        variables={{
          owner: this.props.match.params.owner,
          name: this.props.match.params.name,
          number: parseInt(this.props.match.params.number, 10),
          assetCount: ASSETS_PER_PAGE,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const activity = get(props, "study.activity", null)
            if (!activity) {
              return null
            }

            return (
              <div className={this.classes}>
                <ActivityMeta activity={activity} />
                <ActivityAssets activity={activity} />
              </div>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default withRouter(ActivityOverviewPage)
