import * as React from 'react'
import cls from 'classnames'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import TextField, {Input} from '@material/react-text-field'
import ViewerEmail from './ViewerEmail.js'
import AddEmailMutation from 'mutations/AddEmailMutation'
import { get, isNil } from 'utils'

import { EMAILS_PER_PAGE } from 'consts'

class ViewerEmailList extends React.Component {
  state = {
    email: "",
    error: null,
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
    const { email } = this.state
    AddEmailMutation(
      email,
      (error) => {
        if (!isNil(error)) {
          this.setState({ error: error.message })
        }
      },
    )
  }

  get classes() {
    const {className} = this.props
    return cls("ViewerEmailList mdc-layout-grid__inner", className)
  }

  render() {
    const {relay} = this.props
    const emailEdges = get(this.props, "viewer.allEmails.edges", [])
    const {email} = this.state

    return (
      <div className={this.classes}>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <div className="mdc-card mdc-card--outlined ph2">
            <ul className="mdc-list">
              {emailEdges.map(({node}) => (
                <ViewerEmail key={node.__id} email={node} />
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
            </div>
          </div>
        </div>
        <form
          className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12"
          onSubmit={this.handleSubmit}
        >
          <div className="flex items-center">
            <TextField label="Add email address">
              <Input
                type="email"
                name="email"
                value={email}
                onChange={this.handleChange}
              />
            </TextField>
            <button
              className="mdc-button mdc-button--unelevated ml2"
              type="submit"
            >
              Add
            </button>
          </div>
        </form>
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
