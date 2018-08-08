import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import UserAsset from 'components/UserAsset'
import NotFound from 'components/NotFound'
import { get, isNil } from 'utils'

import { ASSETS_PER_PAGE } from 'consts'

const AssetPageQuery = graphql`
  query AssetPageQuery($owner: String!, $name: String!, $filename: String!) {
    study(owner: $owner, name: $name) {
      asset(name: $filename) {
        ...UserAsset_asset
      }
    }
  }
`

class AssetPage extends Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={AssetPageQuery}
        variables={{
          owner: this.props.match.params.owner,
          name: this.props.match.params.name,
          filename: this.props.match.params.filename,
          count: ASSETS_PER_PAGE,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            if (isNil(get(props, "study.asset", null))) {
              return <NotFound />
            }
            return <UserAsset asset={props.study.asset} />
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default AssetPage
