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

const ARIA_PRESSED = "aria-pressed"
const BUTTON_ON = "mdc-button--on"

export class AppleButton extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      classList: new Set(),
      attrs: {
        [ARIA_PRESSED]: this.hasAppled(),
      }
    }
  }

  get classes() {
    const {classList} = this.state
    const {className} = this.props;
    return cls('mdc-button mdc-button--outlined', Array.from(classList), className, {
      [BUTTON_ON]: this.hasAppled(),
    })
  }

  get adapter() {
    return {
      addClass: (className) => {
        const classList = new Set(this.state.classList)
        classList.add(className)
        this.setState({classList})
      },
      removeClass: (className) => {
        const classList = new Set(this.state.classList)
        classList.delete(className)
        this.setState({classList})
      },
      hasClass: (className) => {
        this.classes.split(' ').includes(className)
      },
      setAttr: (attr, value) => {
        this.setState({[attr]: value})
      },
    }
  }

  handleClick = () => {
    const hasAppled = this.hasAppled()
    if (hasAppled) {
      // optimistic update
      this.adapter.removeClass(BUTTON_ON)

      TakeAppleMutation(
        this.props.appleable.id,
        (viewerHasAppled, errors) => {
          if (!isNil(errors)) {
            console.error(errors[0].message)
            this.adapter.addClass(BUTTON_ON)
            return
          } else if(viewerHasAppled) {
            this.adapter.addClass(BUTTON_ON)
          }
        }
      )
    } else {
      // optimistic update
      this.adapter.addClass(BUTTON_ON)

      GiveAppleMutation(
        this.props.appleable.id,
        (viewerHasAppled, errors) => {
          if (!isNil(errors)) {
            console.errors(errors[0].message)
            this.adapter.removeClass(BUTTON_ON)
            return
          } else if(viewerHasAppled) {
            this.adapter.removeClass(BUTTON_ON)
          }
        }
      )
    }
    this.adapter.setAttr(ARIA_PRESSED, `${hasAppled}`)
  }

  hasAppled = () => {
    return get(this.props, "appleable.viewerHasAppled", false)
  }

  render() {
    const appleable = get(this.props, "appleable", null)
    const viewerHasAppled = this.hasAppled()
    if (isNil(appleable)) {
      return null
    }

    const disabled = this.props.disabled || !appleable.viewerCanApple

    return (
      <button
        className={this.classes}
        aria-label={viewerHasAppled ? "Take apple" : "Give apple"}
        aria-hidden="true"
        aria-pressed={this.state.attrs[ARIA_PRESSED]}
        disabled={disabled}
        onClick={this.handleClick}
      >
        <FontAwesomeIcon
          className="mdc-button__icon"
          icon={faApple}
        />
        <FontAwesomeIcon
          className="mdc-button__icon mdc-button__icon--on"
          icon={faApple}
          color="red"
        />
        {viewerHasAppled ? "Take" : "Give"}
      </button>
    )
  }
}

export default createFragmentContainer(AppleButton, graphql`
  fragment AppleButton_appleable on Appleable {
    id
    viewerCanApple
    viewerHasAppled
  }
`)
