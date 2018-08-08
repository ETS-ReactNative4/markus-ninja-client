import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import StudyLink from 'components/StudyLink'
import UserLink from 'components/UserLink'
import { get } from 'utils'

class UserAsset extends Component {
  render() {
    const asset = get(this.props, "asset", {})
    return (
      <div>
        <div>
          <UserLink user={get(asset, "owner", null)} />
          <span>/</span>
          <StudyLink study={get(asset, "study", null)} />
        </div>
        <div>{asset.name}</div>
        <div>{asset.type}</div>
        <div>{asset.subtype}</div>
        <img src={asset.href} alt={asset.name} />
      </div>
    )
  }
}

export default createFragmentContainer(UserAsset, graphql`
  fragment UserAsset_asset on UserAsset {
    createdAt
    href
    name
    owner {
      ...UserLink_user
    }
    size
    study {
      ...StudyLink_study
    }
    subtype
    type
    viewerCanDelete
    viewerCanUpdate
  }
`)
