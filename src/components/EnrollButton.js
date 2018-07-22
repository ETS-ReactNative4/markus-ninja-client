import * as React from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { get, isNil } from 'utils'
import DismissMutation from 'mutations/DismissMutation'
import EnrollMutation from 'mutations/EnrollMutation'

class EnrollButton extends React.Component {
  render() {
    const enrollable = get(this.props, "enrollable", {})
    return (
      <div className="EnrollButton">
        {enrollable.viewerCanEnroll &&
        <button className="btn" onClick={this.handleEnroll}>Enroll</button>}
        {enrollable.viewerIsEnrolled &&
        <button className="btn" onClick={this.handleDismiss}>Dismiss</button>}
        <button className="btn" onClick={this.handleIgnore}>Ignore</button>
      </div>
    )
  }

  handleDismiss = () => {
    DismissMutation(
      this.props.enrollable.id,
      (error) => {
        if (!isNil(error)) {
          console.error(error.message)
        }
      }
    )
  }

  handleEnroll = () => {
    EnrollMutation(
      this.props.enrollable.id,
      (error) => {
        if (!isNil(error)) {
          console.error(error.message)
        }
      }
    )
  }
}

export default createFragmentContainer(EnrollButton, graphql`
  fragment EnrollButton_enrollable on Enrollable {
    id
    viewerCanEnroll
    viewerIsEnrolled
  }
`)
