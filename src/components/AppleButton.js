import * as React from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { get, isNil } from 'utils'
import GiveAppleMutation from 'mutations/GiveAppleMutation'
import TakeAppleMutation from 'mutations/TakeAppleMutation'

class AppleButton extends React.Component {
  render() {
    const appleable = get(this.props, "appleable", {})
    if (appleable.viewerHasAppled) {
      return (
        <button
          className="AppleButton__take"
          onClick={this.handleTake}
        >
          Take
        </button>
      )
    } else {
      return (
        <button
          className="AppleButton__give"
          onClick={this.handleGive}
        >
          Give
        </button>
      )
    }
  }

  handleGive = (e) => {
    GiveAppleMutation(
      this.props.appleable.id,
      (error) => {
        if (!isNil(error)) {
          console.error(error.message)
        }
      }
    )
  }

  handleTake = (e) => {
    TakeAppleMutation(
      this.props.appleable.id,
      (error) => {
        if (!isNil(error)) {
          console.error(error.message)
        }
      }
    )
  }
}

export default createFragmentContainer(AppleButton, graphql`
  fragment AppleButton_appleable on Appleable {
    id
    viewerHasAppled
  }
`)
