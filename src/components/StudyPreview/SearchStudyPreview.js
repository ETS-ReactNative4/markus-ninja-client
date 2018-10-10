import * as React from 'react'
import cls from 'classnames'
import moment from 'moment'
import {Link} from 'react-router-dom'
import Icon from 'components/Icon'
import UserLink from 'components/UserLink'
import TopicLink from 'components/TopicLink'
import {get} from 'utils'

class SearchStudyPreview extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("SearchStudyPreview mdc-list-item", className)
  }

  get timestamp() {
    const advancedAt = get(this.props, "study.advancedAt", null)
    const createdAt = get(this.props, "study.createdAt")

    if (advancedAt) {
      return `Advanced ${moment(advancedAt).format("MMM D")}`
    } else {
      return `Created ${moment(createdAt).format("MMM D")}`
    }
  }

  render() {
    const study = get(this.props, "study", {})
    const topicNodes = get(study, "topics.nodes", [])

    return (
      <li className={this.classes}>
        <Icon as="span" className="mdc-list-item__graphic" icon="study" />
        <span className="mdc-list-item__text">
          <Link className="mdc-list-item__primary-text" to={study.resourcePath}>
            {study.name}
          </Link>
          <span className="mdc-list-item__secondary-text">
            <span className="mr1">{this.timestamp}</span>
            by
            <UserLink className="rn-link rn-link--secondary ml1" user={get(study, "owner", null)} />
          </span>
        </span>
        <span className="mdc-list-item__tags">
          {topicNodes.map((node) =>
            node &&
            <TopicLink
              key={node.id}
              className="mdc-button mdc-button--outlined"
              topic={node}
            />)}
        </span>
        <span className="mdc-list-item__meta">
          <Link
            className="rn-icon-link"
            to={study.resourcePath+"/lessons"}
          >
            <Icon className="rn-icon-link__icon" icon="lesson" />
            {get(study, "lessonCount", 0)}
          </Link>
        </span>
      </li>
    )
  }
}

export default SearchStudyPreview
