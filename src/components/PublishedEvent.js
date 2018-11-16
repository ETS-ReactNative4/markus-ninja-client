import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import Icon from 'components/Icon'
import UserLink from 'components/UserLink'
import {get, timeDifferenceForDate} from 'utils'

class PublishedEvent extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("PublishedEvent rn-list-preview", className)
  }

  get publishableType() {
    switch (get(this.props, "event.publishable.__typename", "")) {
      case "Lesson":
        return "lesson"
      case "LessonComment":
        return "lesson comment"
      default:
        return ""
    }
  }

  get publishableLink() {
    const publishable = get(this.props, "event.publishable", {})
    switch (publishable.__typename) {
      case "Lesson":
        return publishable.title
      case "LessonComment":
        return "comment"
      default:
        return ""
    }
  }

  render() {
    const {event, twoLine} = this.props
    const publishable = get(this.props.event, "publishable")

    if (!event || !publishable) {
      return null
    }

    return (
      <li className={this.classes}>
        <span className="mdc-list-item">
          <Icon className="mdc-list-item__graphic" label="Published">publish</Icon>
          {this.renderText()}
          {twoLine &&
          <span className="mdc-list-item__meta">
            <Link
              className="mdc-icon-button"
              to={publishable.resourcePath}
            >
              <Icon className="rn-icon-link__icon" icon={this.publishableType} />
            </Link>
          </span>}
        </span>
      </li>
    )
  }

  renderText() {
    const {event, twoLine} = this.props
    const publishable = get(event, "publishable")

    return (
      <span className="mdc-list-item__text">
        {twoLine
        ? <React.Fragment>
            <span className="mdc-list-item__primary-text">
              <UserLink className="rn-link fw5" user={get(event, "user", null)} />
              <span className="ml1">
                published a {this.publishableType}
              </span>
              <Link className="rn-link fw5 ml1" to={publishable.resourcePath}>
                {this.publishableLink}
              </Link>
            </span>
            <span className="mdc-list-item__secondary-text">
              Published {timeDifferenceForDate(event.createdAt)}
            </span>
          </React.Fragment>
        : <React.Fragment>
            <UserLink className="rn-link fw5 mr1" user={get(event, "user", null)} />
            published this {timeDifferenceForDate(event.createdAt)}
          </React.Fragment>}
      </span>
    )
  }
}

PublishedEvent.propTypes = {
  twoLine: PropTypes.bool,
}

PublishedEvent.defaultProps = {
  twoLine: false,
}

export default createFragmentContainer(PublishedEvent, graphql`
  fragment PublishedEvent_event on PublishedEvent {
    createdAt
    id
    publishable {
      __typename
      ...on Lesson {
        resourcePath
        title
      }
      ...on LessonComment {
        resourcePath
      }
    }
    user {
      ...UserLink_user
    }
  }
`)
