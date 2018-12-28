import * as React from 'react'
import PropTypes from 'prop-types'
import {
  QueryRenderer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'Environment'
import {get, isEmpty, timeDifferenceForDate} from 'utils'

const CommentDraftBackupQuery = graphql`
  query CommentDraftBackupQuery($commentId: ID!, $backupId: ID!) {
    node(id: $commentId) {
      ...on Comment {
        draftBackup(id: $backupId) {
          draft
          id
          updatedAt
        }
      }
    }
  }
`

class Input extends React.Component {
  componentDidMount() {
    const {onChange, value} = this.props
    onChange(value)
  }

  render() {
    const {value} = this.props

    return (
      <input
        type="hidden"
        name="draftBackup"
        value={value}
      />
    )
  }
}

class CommentDraftBackup extends React.Component {
  render() {
    const {backupId, commentId, onChange} = this.props

    if (isEmpty(backupId)) {
      return (
        <div className="mdc-card mt3">
          <div className="rn-card__body">
            Please select a backup
          </div>
        </div>
      )
    }

    return (
      <QueryRenderer
        environment={environment}
        query={CommentDraftBackupQuery}
        variables={{
          backupId,
          commentId,
        }}
        render={({error, props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const draftBackup = get(props, "node.draftBackup", {})

            return (
              <div className="mdc-card mv3">
                <Input onChange={onChange} value={draftBackup.draft} />
                <div className="rn-card__header">
                  <span className="rn-card__overline">
                    Updated {timeDifferenceForDate(draftBackup.updatedAt)}
                  </span>
                </div>
                <div className="rn-card__body" style={{whiteSpace: "pre-wrap"}}>
                  {draftBackup.draft}
                </div>
              </div>
            )
          } else {
            return (
              <div className="mdc-card mt3">
                <div className="rn-card__body">
                  Loading
                </div>
              </div>
            )
          }
        }}
      />
    )
  }
}

CommentDraftBackup.propTypes = {
  backupId: PropTypes.oneOf(["", "1", "2", "3", "4", "5"]).isRequired,
  commentId: PropTypes.string.isRequired,
  onChange: PropTypes.func,
}

CommentDraftBackup.defaultProps = {
  backupId: "",
  commentId: "",
  onChange: () => {},
}

export default CommentDraftBackup
