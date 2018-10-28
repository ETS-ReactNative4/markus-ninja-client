import * as React from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import cls from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faApple } from '@fortawesome/free-brands-svg-icons'
import { get, isNil } from 'utils'
import GiveAppleMutation from 'mutations/GiveAppleMutation'
import TakeAppleMutation from 'mutations/TakeAppleMutation'

import './styles.css'

export class ListAppleButton extends React.Component {
  state = {
    on: this.hasAppled,
  }

  handleClick = () => {
    const hasAppled = this.hasAppled
    if (hasAppled) {
      // optimistic update
      this.setState({on: false})

      TakeAppleMutation(
        this.props.appleable.id,
        (viewerHasAppled, errors) => {
          if (!isNil(errors)) {
            console.error(errors[0].message)
          }
          this.setState({on: viewerHasAppled})
        }
      )
    } else {
      // optimistic update
      this.setState({on: true})

      GiveAppleMutation(
        this.props.appleable.id,
        (viewerHasAppled, errors) => {
          if (!isNil(errors)) {
            console.errors(errors[0].message)
          }
          this.setState({on: viewerHasAppled})
        }
      )
    }
  }

  get classes() {
    const {className} = this.props;
    return cls("mdc-list-item", className)
  }

  get hasAppled() {
    return get(this.props, "appleable.viewerHasAppled", false)
  }

  render() {
    const {on} = this.state
    const appleable = get(this.props, "appleable", null)
    const viewerHasAppled = this.hasAppled
    if (isNil(appleable)) {
      return null
    }

    return (
      <li
        className={this.classes}
        role="button"
        onClick={this.handleClick}
      >
        <FontAwesomeIcon
          className={cls("mdc-list-item__graphic", {
            "mdc-theme--text-icon-on-background": !on,
          })}
          icon={faApple}
          style={{
            color: on ? "red" : null,
          }}
        />
        <span className="mdc-list-item__text">
          {viewerHasAppled ? "Take" : "Give"}
        </span>
      </li>
    )
  }
}

export default createFragmentContainer(ListAppleButton, graphql`
  fragment ListAppleButton_appleable on Appleable {
    id
    viewerCanApple
    viewerHasAppled
  }
`)
