import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import moment from 'moment'
import Icon from 'components/Icon'
import Label from 'components/Label'
import UserLink from 'components/UserLink'
import {get} from 'utils'

class LabeledEvent extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("LabeledEvent rn-list-preview", className)
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
              added label
              <Label className="ml1" label={label} />
            </span>
            <span className="ml1">
              on {moment(event.createdAt).format("MMM D")}
            </span>
          </span>
        </span>
      </li>
    )
  }
}

export default createFragmentContainer(LabeledEvent, graphql`
  fragment LabeledEvent_event on LabeledEvent {
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
