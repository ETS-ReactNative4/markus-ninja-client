import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import Icon from 'components/Icon'
import UserLink from 'components/UserLink'
import {get, timeDifferenceForDate} from 'utils'

class RenamedEvent extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("RenamedEvent rn-list-preview", className)
  }

  render() {
    const {event} = this.props
    const {renameable} = event

    if (!event) {
      return null
    }

    return (
      <li className={this.classes}>
        <span className="mdc-list-item">
          <Icon className="mdc-list-item__graphic" icon="edit" />
          <span className="mdc-list-item__text">
            <UserLink className="rn-link fw5 mr1" user={get(event, "user", null)} />
            {renameable.__typename === 'Lesson' ? 'retitled' : 'renamed'} this from
            <span className="mh1 fw5">
              {event.renamedFrom}
            </span>
            to
            <span className="mh1 fw5">
              {event.renamedTo}
            </span>
            {timeDifferenceForDate(event.createdAt)}
          </span>
        </span>
      </li>
    )
  }
}

export default createFragmentContainer(RenamedEvent, graphql`
  fragment RenamedEvent_event on RenamedEvent {
    createdAt
    id
    renameable {
      __typename
    }
    renamedFrom
    renamedTo
    user {
      ...UserLink_user
    }
  }
`)
