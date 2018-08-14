import * as React from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faApple } from '@fortawesome/free-brands-svg-icons'
import { get, isNil } from 'utils'
import GiveAppleMutation from 'mutations/GiveAppleMutation'
import TakeAppleMutation from 'mutations/TakeAppleMutation'

import './styles.css'

class AppleButton extends React.Component {
  render() {
    const appleable = get(this.props, "appleable", null)
    if (isNil(appleable)) {
      return null
    } else if (appleable.viewerHasAppled) {
      return (
        <button
          className="mdc-icon-button"
          aria-label="Take apple"
          aria-hidden="true"
          aria-pressed="true"
          onClick={this.handleTake}
        >
          <FontAwesomeIcon
            className="mdc-icon-button__icon"
            icon={faApple}
          />
        </button>
      )
    } else {
      return (
        <button
          className="mdc-icon-button"
          aria-label="Give apple"
          aria-hidden="true"
          aria-pressed="true"
          onClick={this.handleGive}
        >
          <FontAwesomeIcon
            className="mdc-icon-button__icon"
            icon={faApple}
            border
          />
        </button>
      )
    }
  }

  handleGive = (e) => {
    GiveAppleMutation(
      this.props.appleable.id,
      (error) => {
        if (!isNil(error)) {
          console.error(error[0].message)
        }
      }
    )
  }

  handleTake = (e) => {
    TakeAppleMutation(
      this.props.appleable.id,
      (error) => {
        if (!isNil(error)) {
          console.error(error[0].message)
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
