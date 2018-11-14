import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import Icon from 'components/Icon'
import Label from 'components/Label'
import UserLink from 'components/UserLink'
import {get, timeDifferenceForDate} from 'utils'

class UnlabeledEvent extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("UnlabeledEvent rn-list-preview", className)
  }

  render() {
    const {event} = this.props
    const label = get(event, "label")

    if (!event || !label) {
      return null
    }

    return (
      <li className={this.classes}>
        <span className="mdc-list-item">
          <Icon className="mdc-list-item__graphic" icon="label" />
          <span className="mdc-list-item__text">
            <UserLink className="rn-link fw5" user={get(event, "user", null)} />
            <span className="ml1">
              removed label
              <Label className="ml1" label={label} />
            </span>
            <span className="ml1">{timeDifferenceForDate(event.createdAt)}</span>
          </span>
        </span>
      </li>
    )
  }
}

export default createFragmentContainer(UnlabeledEvent, graphql`
  fragment UnlabeledEvent_event on UnlabeledEvent {
    createdAt
    id
    label {
      ...Label_label
    }
    user {
      ...UserLink_user
    }
  }
`)
