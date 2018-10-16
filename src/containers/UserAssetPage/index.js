import * as React from 'react'
import cls from 'classnames'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import NotFound from 'components/NotFound'
import UserAsset from './UserAsset'
import UserAssetHeader from './UserAssetHeader'
import UserAssetTimeline from './UserAssetTimeline'
import { get, isNil } from 'utils'

import { EVENTS_PER_PAGE } from 'consts'

const UserAssetPageQuery = graphql`
  query UserAssetPageQuery($owner: String!, $name: String!, $filename: String!, $count: Int!, $after: String) {
    study(owner: $owner, name: $name) {
      asset(name: $filename) {
        id
        ...UserAssetHeader_asset
        ...UserAsset_asset
        ...UserAssetTimeline_asset
      }
    }
  }
`

class UserAssetPage extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("UserAssetPage mdc-layout-grid", className)
  }

  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={UserAssetPageQuery}
        variables={{
          owner: this.props.match.params.owner,
          name: this.props.match.params.name,
          filename: this.props.match.params.filename,
          count: EVENTS_PER_PAGE,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const asset = get(props, "study.asset", null)
            if (isNil(asset)) {
              return <NotFound />
            }
            return (
              <div className={this.classes}>
                <div className="mdc-layout-grid__inner">
                  <UserAssetHeader asset={asset} />
                  <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                    <UserAsset asset={props.study.asset} />
                  </div>
                  <UserAssetTimeline asset={asset} />
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

export default UserAssetPage
