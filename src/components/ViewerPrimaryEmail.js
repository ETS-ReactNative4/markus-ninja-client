import React, { Component } from 'react'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import UpdateEmailMutation from 'mutations/UpdateEmailMutation'
import { get, isNil } from 'utils'

import { EMAILS_PER_PAGE } from 'consts'

class ViewerPrimaryEmail extends Component {
  state = {
    emailId: "",
    error: null,
  }

  render() {
    const emailEdges = get(this.props, "viewer.primaryEmailOptions.edges", [])
    const { emailId } = this.state
    return (
      <div className="ViewerPrimaryEmail">
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="user_primary_email">Primary email address</label>
          <div>
            Your primary email address, in addition to authentication, will be used for account-related notifications.
          </div>
          <select
            id="user_primary_email"
            name="primaryEmailId"
            value={emailId}
            onChange={this.handleChange}
          >
            {emailEdges.map(e => {
              const node = get(e, "node", {})
              return <option key={node.id} value={node.id}>{node.value}</option>
            })}
          </select>
          <button
            className="btn"
            type="submit"
            onClick={this.handleSubmit}
          >
            Save
          </button>
        </form>
      </div>
    )
  }

  _loadMore = () => {
    const relay = get(this.props, "relay")
    if (!relay.hasMore()) {
      console.log("Nothing more to load")
      return
    } else if (relay.isLoading()){
      console.log("Request is already pending")
      return
    }

    relay.loadMore(EMAILS_PER_PAGE)
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { emailId } = this.state
    UpdateEmailMutation(
      emailId,
      'PRIMARY',
      (error) => {
        if (!isNil(error)) {
          this.setState({ error: error.message })
        }
      },
    )
  }
}

export default createPaginationContainer(ViewerPrimaryEmail,
  {
    viewer: graphql`
      fragment ViewerPrimaryEmail_viewer on User {
        primaryEmailOptions: emails(
          first: $count,
          after: $after,
          isVerified: true,
        ) @connection(key: "ViewerPrimaryEmail_primaryEmailOptions") {
          edges {
            node {
              id
              value
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `,
  },
  {
    direction: 'forward',
    query: graphql`
      query ViewerPrimaryEmailForwardQuery(
        $count: Int!,
        $after: String
      ) {
        viewer {
          ...ViewerPrimaryEmail_viewer
        }
      }
    `,
    getConnectionFromProps(props) {
      return get(props, "viewer.emails")
    },
    getFragmentVariables(previousVariables, totalCount) {
      return {
        ...previousVariables,
        count: totalCount,
      }
    },
    getVariables(props, paginationInfo, getFragmentVariables) {
      return {
        count: paginationInfo.count,
        after: paginationInfo.cursor,
      }
    },
  },
)
