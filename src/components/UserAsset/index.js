import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import cls from 'classnames'
import StudyLink from 'components/StudyLink'
import UserLink from 'components/UserLink'
import UserAssetTimeline from 'components/UserAssetTimeline'
import UpdateUserAssetMutation from 'mutations/UpdateUserAssetMutation'
import DeleteUserAssetMutation from 'mutations/DeleteUserAssetMutation'
import { get, isNil } from 'utils'

import './UserAsset.css'

class UserAsset extends Component {
  state = {
    error: null,
    open: false,
    name: get(this.props, "asset.name", ""),
  }

  render() {
    const asset = get(this.props, "asset", {})
    const { error, name, open } = this.state
    return (
      <div className={cls("UserAsset", {open})}>
        <div className="UserAsset__show">
          <h1>{asset.name}</h1>
          <div className="UserAsset__actions">
            {asset.viewerCanUpdate &&
            <button
              className="btn"
              type="button"
              onClick={this.handleToggleOpen}
            >
              Edit
            </button>}
          </div>
        </div>
          {asset.viewerCanUpdate &&
        <div className="UserAsset__edit">
          <form onSubmit={this.handleSubmit}>
            <input
              id="asset-name"
              className={cls("form-control", "edit-asset-name")}
              type="text"
              name="name"
              placeholder="Enter text"
              value={name}
              onChange={this.handleChange}
            />
            <button
              className="btn"
              type="submit"
              onClick={this.handleSubmit}
            >
              Save
            </button>
            <button
              className="btn-link"
              type="button"
              onClick={this.handleToggleOpen}
            >
              Cancel
            </button>
            <span>{error}</span>
          </form>
        </div>}
        <ul>
          {asset.viewerCanDelete &&
          <li>
            <button className="btn" type="button" onClick={this.handleDelete}>
              Delete
            </button>
          </li>}
        </ul>
        <div>
          <UserLink user={get(asset, "owner", null)} />
          <span>/</span>
          <StudyLink study={get(asset, "study", null)} />
        </div>
        <div>{asset.type}</div>
        <div>{asset.subtype}</div>
        <img src={asset.href} alt={asset.name} />
        <UserAssetTimeline asset={asset} />
      </div>
    )
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

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

  handleSubmit = (e) => {
    e.preventDefault()
    const { name } = this.state
    UpdateUserAssetMutation(
      this.props.asset.id,
      name,
      (updatedUserAsset, errors) => {
        if (!isNil(errors)) {
          this.setState({ error: errors[0].message })
        }
        this.handleToggleOpen()
        this.setState({
          name: get(updatedUserAsset, "name", ""),
        })
      },
    )
  }

  handleToggleOpen = () => {
    this.setState({ open: !this.state.open })
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
