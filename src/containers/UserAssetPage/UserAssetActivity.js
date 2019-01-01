import * as React from 'react'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import {Link} from 'react-router-dom';
import Icon from 'components/Icon'
import {get} from 'utils'
import {mediaQueryPhone} from 'styles/helpers'

class UserAssetActivity extends React.Component {
  render() {
    const asset = get(this.props, "asset", {})
    const activity = get(asset, "activity", {})
    const {previousAsset, nextAsset} = asset
    const mq = mediaQueryPhone()

    return (
      <div className="mdc-list-item">
        <Icon className="mdc-list-item__graphic" icon="activity" />
        <span className="mdc-list-item__text">
          <Link
            className="rn-link mdc-typography--headline6"
            to={activity.resourcePath}
          >
            {activity.name}
          </Link>
          <span className="mdc-theme--text-hint-on-light ml2">#{asset.activityNumber}</span>
        </span>
        <span className="mdc-list-item__meta">
          <span className="flex items-center justify-end hidden">
            {previousAsset &&
              (mq.matches
              ? <Link
                  className="material-icons mdc-icon-button"
                  to={previousAsset.resourcePath}
                  aria-label="Previous asset"
                  title="Previous asset"
                >
                  arrow_back
                </Link>
              : <Link
                  className="mdc-button mr2"
                  to={previousAsset.resourcePath}
                >
                  <i className="material-icons mdc-button__icon" aria-hidden="true">arrow_back</i>
                  Previous
                </Link>)
            }
            {nextAsset &&
              (mq.matches
              ? <Link
                  className="material-icons mdc-icon-button mdc-theme--text-primary-on-light"
                  to={nextAsset.resourcePath}
                  aria-label="Next asset"
                  title="Next asset"
                >
                  arrow_forward
                </Link>
              : <Link
                  className="mdc-button mdc-button--unelevated"
                  to={nextAsset.resourcePath}
                >
                  <i className="material-icons mdc-button__icon" aria-hidden="true">arrow_forward</i>
                  Next
                </Link>)
            }
          </span>
        </span>
      </div>
    )
  }
}

export default createFragmentContainer(UserAssetActivity, graphql`
  fragment UserAssetActivity_asset on UserAsset {
    activity {
      name
      resourcePath
    }
    activityNumber
    nextAsset {
      resourcePath
    }
    previousAsset {
      resourcePath
    }
  }
`)
