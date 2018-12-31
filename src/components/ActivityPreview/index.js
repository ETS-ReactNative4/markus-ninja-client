import * as React from 'react'
import cls from 'classnames'
import Relay from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import hoistNonReactStatic from 'hoist-non-react-statics'
import { Link } from 'react-router-dom'
import pluralize from 'pluralize'
import { get, isNil, timeDifferenceForDate } from 'utils'
import CardActivityPreview from './CardActivityPreview'
import ListActivityPreview from './ListActivityPreview'

const FRAGMENT =  graphql`
  fragment ActivityPreview_activity on Activity {
    advancedAt
    assets(first: 0) {
      totalCount
    }
    createdAt
    description
    descriptionHTML
    id
    name
    number
    owner {
      login
      resourcePath
    }
    resourcePath
    study {
      name
      resourcePath
    }
    viewerCanAdmin
  }
`

class ActivityPreview extends React.Component {
  static Card = Relay.createFragmentContainer(CardActivityPreview, FRAGMENT)
  static List = Relay.createFragmentContainer(ListActivityPreview, FRAGMENT)

  get classes() {
    const {className} = this.props
    return cls("ActivityPreview", className)
  }

  render() {
    const activity = get(this.props, "activity", {})
    const assetCount = get(activity, "assets.totalCount", 0)
    return (
      <div className={this.classes}>
        <div className="ActivityPreview__info">
          <Link to={activity.resourcePath}>
            {activity.name}
          </Link>
          <span className="ml1">
            ({assetCount} {pluralize("asset", assetCount)})
          </span>
          {!isNil(activity.advancedAt) &&
          <span className="ml1">Advanced {timeDifferenceForDate(activity.advancedAt)}</span>}
        </div>
        <div className="ActivityPreview__description">{activity.description}</div>
      </div>
    )
  }
}

export default hoistNonReactStatic(
  Relay.createFragmentContainer(ActivityPreview, FRAGMENT),
  ActivityPreview,
)
