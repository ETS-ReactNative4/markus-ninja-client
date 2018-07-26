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
    return (
      <span className="AppleButton">
        {appleable.viewerHasAppled
        ? <button
            className="AppleButton__take"
            onClick={this.handleTake}
          >
            Take apple
          </button>
        : <button
            className="AppleButton__give"
            onClick={this.handleGive}
          >
            Give apple
          </button>}
        <span className="AppleButton__count">
          {get(appleable, "appleGivers.totalCount", 0)}
        </span>
      </span>
    )
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
    ...on Study {
      appleGivers(first: 0) {
        totalCount
      }
    }
  }
`)
