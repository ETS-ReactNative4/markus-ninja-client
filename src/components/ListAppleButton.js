import * as React from 'react'
import cls from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faApple } from '@fortawesome/free-brands-svg-icons'
import List from 'components/mdc/List'
import { get, isNil } from 'utils'
import GiveAppleMutation from 'mutations/GiveAppleMutation'
import TakeAppleMutation from 'mutations/TakeAppleMutation'

class ListAppleButton extends React.Component {
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
      <List.Item
        className={this.classes}
        role="button"
        onClick={this.handleClick}
      >
        <List.Item.Graphic
          className={cls({"mdc-theme--text-icon-on-background": !on})}
          graphic={
            <FontAwesomeIcon
              icon={faApple}
              style={{
                color: on ? "red" : null,
              }}
            />
          }
        />
        <List.Item.Text primaryText={viewerHasAppled ? "Take" : "Give"} />
      </List.Item>
    )
  }
}

export default ListAppleButton
