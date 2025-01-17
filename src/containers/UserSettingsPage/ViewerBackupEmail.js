import * as React from 'react'
import cls from 'classnames'
import {
  createPaginationContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import Select from '@material/react-select'
import Snackbar from 'components/mdc/Snackbar'
import UpdateEmailMutation from 'mutations/UpdateEmailMutation'
import {get} from 'utils'

import { EMAILS_PER_PAGE } from 'consts'

class ViewerBackupEmail extends React.Component {
  constructor(props) {
    super(props)

    const emailEdges = get(props, "viewer.backupEmailOptions.edges", [])

    let backupEmailId = ""
    for (let edge of emailEdges) {
      const type = get(edge, "node.type", "")
      if (type === 'BACKUP') {
        backupEmailId = get(edge, "node.id", "")
      }
    }

    this.state = {
      initialValue: backupEmailId,
      value: backupEmailId,
      error: null,
      showSnackbar: false,
      snackbarMessage: "",
    }
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
    const {initialValue, value} = this.state
    let emailId = value
    let type = 'BACKUP'
    if (value === "Only allow primary email") {
      emailId = initialValue
      type = 'EXTRA'
    }
    UpdateEmailMutation(
      emailId,
      type,
      (email, errors) => {
        if (errors) {
          this.setState({
            error: errors[0].message,
            value: initialValue,
            showSnackbar: true,
            snackbarMessage: "Something went wrong",
          })
          return
        }
        this.setState({
          showSnackbar: true,
          snackbarMessage: "Backup email updated",
        })
      },
    )
  }

  get classes() {
    const {className} = this.props
    return cls("ViewerBackupEmail", className)
  }

  get options() {
    const emailEdges = get(this.props, "viewer.backupEmailOptions.edges", [])
    const options = [{
      label: "Only allow primary email",
      value: "Only allow primary email",
    }]
    emailEdges.map(({node}) => node && options.push({
      label: node.value,
      value: node.id,
    }))

    return options
  }

  render() {
    const {showSnackbar, snackbarMessage, value} = this.state

    return (
      <div className={this.classes}>
        <p className="mb2">
          Your backup email address, in addition to authentication, can be used to reset your password.
        </p>
        <form onSubmit={this.handleSubmit}>
          <div>
            <Select
              className="rn-select"
              floatingLabelClassName="mdc-floating-label--float-above"
              label="Backup email address"
              value={value}
              onChange={(e) => this.setState({value: e.target.value})}
              options={this.options}
            />
          </div>
          <button
            className="mdc-button mdc-button--unelevated mt2"
            type="submit"
          >
            Save
          </button>
        </form>
        <Snackbar
          show={showSnackbar}
          message={snackbarMessage}
          actionHandler={() => this.setState({showSnackbar: false})}
          actionText="ok"
          handleHide={() => this.setState({showSnackbar: false})}
        />
      </div>
    )
  }
}

export default createPaginationContainer(ViewerBackupEmail,
  {
    viewer: graphql`
      fragment ViewerBackupEmail_viewer on User {
        backupEmailOptions: emails(
          after: $after,
          first: $count,
          filterBy:{isVerified: true, types: [BACKUP, EXTRA]},
        ) @connection(key: "ViewerBackupEmail_backupEmailOptions") {
          edges {
            node {
              id
              type
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
