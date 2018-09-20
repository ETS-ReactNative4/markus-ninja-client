import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import DeleteUserAssetMutation from 'mutations/DeleteUserAssetMutation'
import { get, isNil } from 'utils'

class UserAsset extends React.Component {
  handleDelete = () => {
    DeleteUserAssetMutation(
      this.props.asset.id,
      (_, errors) => {
        if (!isNil(errors)) {
          this.setState({ error: errors[0].message })
        } else {
          this.props.history.push(
            get(this.props, "asset.study.resourcePath", "") + "/assets"
          )
        }
      },
    )
  }

  get classes() {
    const {className} = this.props
    return cls("UserAsset flex flex-column", className)
  }

  render() {
    const asset = get(this.props, "asset", {})
    return (
      <div className={this.classes}>
        <div>{asset.type}</div>
        <div>{asset.subtype}</div>
        <img className="w-100 h-auto" src={asset.href} alt={asset.name} />
        <button
          className="mdc-icon-button material-icons"
          type="button"
          onClick={this.handleDelete}
        >
          delete
        </button>
      </div>
    )
  }
}

export default withRouter(createFragmentContainer(UserAsset, graphql`
  fragment UserAsset_asset on UserAsset {
    id
    createdAt
    href
    name
    owner {
      ...UserLink_user
    }
    size
    study {
      resourcePath
      ...StudyLink_study
    }
    subtype
    type
    viewerCanDelete
    viewerCanUpdate
    ...UserAssetTimeline_asset
  }
`))
