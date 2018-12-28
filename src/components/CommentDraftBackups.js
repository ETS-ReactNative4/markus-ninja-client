import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {
  QueryRenderer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import Select from '@material/react-select'
import environment from 'Environment'
import {get, timeDifferenceForDate} from 'utils'

const CommentDraftBackupsQuery = graphql`
  query CommentDraftBackupsQuery($commentId: ID!) {
    node(id: $commentId) {
      ...on Comment {
        draftBackups {
          id
          updatedAt
        }
      }
    }
  }
`

class CommentDraftBackups extends React.Component {
  state = {
    value: this.props.value,
  }

  handleChange = (e) => {
    const value = e.target.value
    this.setState({
      value,
    })
    this.props.onChange(value)
  }

  render() {
    const {className, commentId} = this.props
    const {value} = this.state

    return (
      <QueryRenderer
        environment={environment}
        query={CommentDraftBackupsQuery}
        variables={{
          commentId,
        }}
        render={({error, props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const draftBackups = get(props, "node.draftBackups", [])
            const options = [{
              label: "Select a backup",
              value: "",
            }]
            draftBackups.map((backup) => options.push({
              label: `${backup.id}: Backed up ${timeDifferenceForDate(backup.updatedAt)}`,
              value: backup.id,
            }))

            return (
              <Select
                className={cls("rn-select", className)}
                floatingLabelClassName="mdc-floating-label--float-above"
                label="Draft backup"
                value={value}
                onChange={this.handleChange}
                options={options}
              />
            )
          } else {
            return <div>Loading</div>
          }
        }}
      />
    )
  }
}

CommentDraftBackups.propTypes = {
  commentId: PropTypes.string.isRequired,
  onChange: PropTypes.func,
}

CommentDraftBackups.defaultProps = {
  commentId: "",
  onChange: () => {},
}

export default CommentDraftBackups
