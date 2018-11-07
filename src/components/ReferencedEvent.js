import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import moment from 'moment'
import {Link} from 'react-router-dom'
import Icon from 'components/Icon'
import UserLink from 'components/UserLink'
import {get} from 'utils'

class ReferencedEvent extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("ReferencedEvent rn-list-preview", className)
  }

  render() {
    const {event} = this.props
    const source = get(event, "source")

    if (!event || !source) {
      return null
    }

    return (
      <div className={this.classes}>
        <span className="mdc-list-item">
          <Icon className="mdc-list-item__graphic" icon="reference" />
          <span className="mdc-list-item__text">
            <UserLink className="rn-link fw5" user={get(event, "user", null)} />
            <span className="ml1">
              {event.isCrossStudy && "cross-"}referenced this on {moment(event.createdAt).format("MMM D")} from
            </span>
            <Link
              className="rn-link fw5 ml1"
              to={source.resourcePath}
            >
              {source.title}
              <span className="mdc-theme--text-secondary-on-light ml1">
                #{source.number}
              </span>
            </Link>
          </span>
          <span className="mdc-list-item__meta">
            <Link
              className="mdc-icon-button"
              to={source.resourcePath}
            >
              <Icon className="rn-icon-link__icon" icon="lesson" />
            </Link>
          </span>
        </span>
      </div>
    )
  }
}

export default createFragmentContainer(ReferencedEvent, graphql`
  fragment ReferencedEvent_event on ReferencedEvent {
    createdAt
    id
    isCrossStudy
    source {
      number
      resourcePath
      title
    }
    user {
      ...UserLink_user
    }
  }
`)
