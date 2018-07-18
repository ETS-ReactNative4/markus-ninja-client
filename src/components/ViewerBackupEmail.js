import React, { Component } from 'react'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import UpdateEmailMutation from 'mutations/UpdateEmailMutation'
import { get, isNil } from 'utils'

import { EMAILS_PER_PAGE } from 'consts'

class ViewerBackupEmail extends Component {
  constructor(props) {
    super(props)

    const emailEdges = get(props, "user.backupEmailOptions.edges", [])

    let backupEmailId = ""
    for (let edge of emailEdges) {
      const type = get(edge, "node.type", "")
      if (type === 'BACKUP') {
        backupEmailId = get(edge, "node.id", "")
      }
    }

    this.state = {
      emailId: backupEmailId,
      error: null,
    }
  }

  render() {
    const emailEdges = get(this.props, "viewer.backupEmailOptions.edges", [])
    const { emailId, error } = this.state
    return (
      <div className="UserEmails__backup">
        <form>
          <label htmlFor="user_backup_email">Backup email address</label>
          <div>
            Your backup email address, in addition to authentication, can be used to reset your password.
          </div>
          <select
            id="user_backup_email"
            name="backupEmailId"
            value={emailId}
            onChange={this.handleChange}
          >
            <option value="">Only allow primary email</option>
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
          <span>{error}</span>
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
      'BACKUP',
      (error) => {
        if (!isNil(error)) {
          this.setState({ error: error.message })
        }
      },
    )
  }
}

export default createPaginationContainer(ViewerBackupEmail,
  {
    viewer: graphql`
      fragment ViewerBackupEmail_viewer on User {
        backupEmailOptions: emails(
          first: $count,
          after: $after,
          isVerified: true,
          type: [BACKUP, EXTRA]
        ) @connection(key: "ViewerBackupEmail_backupEmailOptions") {
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
      query ViewerBackupEmailForwardQuery(
        $count: Int!,
        $after: String
      ) {
        viewer {
          ...ViewerBackupEmail_viewer
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
