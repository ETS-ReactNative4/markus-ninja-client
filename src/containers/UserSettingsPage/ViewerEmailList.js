import * as React from 'react'
import cls from 'classnames'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import ViewerEmail from './ViewerEmail'
import AddEmailDialog from './AddEmailDialog'
import {get} from 'utils'

import { EMAILS_PER_PAGE } from 'consts'

class ViewerEmailList extends React.Component {
  state = {
    error: null,
    open: false,
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

  get classes() {
    const {className} = this.props
    return cls("ViewerEmailList", className)
  }

  render() {
    const {open} = this.state
    const {relay} = this.props
    const emailEdges = get(this.props, "viewer.allEmails.edges", [])

    return (
      <div className={this.classes}>
        <div className="mdc-card mdc-card--outlined ph2">
          <ul className="mdc-list">
            {emailEdges.map(({node}) => (
              <ViewerEmail key={node.id} email={node} />
            ))}
          </ul>
          <div className="mdc-card__actions">
            <div className="mdc-card__action-buttons">
              {relay.hasMore() &&
              <button
                className="mdc-button mdc-button--unelevated mdc-card__action mdc-card__action--button"
                type="button"
                onClick={this._loadMore}
              >
                More
              </button>}
            </div>
            <div className="mdc-card__action-icons">
              <button
                className="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon"
                aria-label="Add email"
                title="Add email"
                onClick={() => this.setState({open: true})}
              >
                add
              </button>
            </div>
          </div>
        </div>
        <AddEmailDialog
          open={open}
          onClose={() => this.setState({open: false})}
        />
      </div>
    )
  }
}

export default createPaginationContainer(ViewerEmailList,
  {
    viewer: graphql`
      fragment ViewerEmailList_viewer on User {
        allEmails: emails(
          first: $count,
          after: $after
        ) @connection(key: "ViewerEmailList_allEmails") {
          edges {
            node {
              id
              ...ViewerEmail_email
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
      query ViewerEmailListForwardQuery(
        $count: Int!,
        $after: String
      ) {
        viewer {
          ...ViewerEmailList_viewer
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
