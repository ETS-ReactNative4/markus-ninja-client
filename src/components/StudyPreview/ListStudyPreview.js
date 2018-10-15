import * as React from 'react'
import cls from 'classnames'
import moment from 'moment'
import {Link} from 'react-router-dom'
import AppleIconButton from 'components/AppleIconButton'
import EnrollIconButton from 'components/EnrollIconButton'
import Icon from 'components/Icon'
import {get} from 'utils'

class ListStudyPreview extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("ListStudyPreview mdc-list-item", className)
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
            <Link
              className="rn-link rn-link--secondary ml1"
              to={get(study, "owner.resourcePath", "")}
            >
              {get(study, "owner.login", "")}
            </Link>
          </span>
        </span>
        <span className="mdc-list-item__tags">
          {topicNodes.map((node) =>
            node &&
            <Link
              key={node.id}
              className="mdc-button mdc-button--outlined"
              to={node.resourcePath}
            >
              {node.name}
            </Link>
          )}
        </span>
        <span className="mdc-list-item__meta">
          <div className="mdc-list-item__meta-actions">
            {study.viewerCanEnroll &&
            <EnrollIconButton enrollable={get(this.props, "study", null)} />}
            {study.viewerCanApple &&
            <AppleIconButton appleable={get(this.props, "study", null)} />}
            <Link
              className="rn-icon-link"
              to={study.resourcePath+"/lessons"}
            >
              <Icon className="rn-icon-link__icon" icon="lesson" />
              {get(study, "lessons.totalCount", 0)}
            </Link>
          </div>
        </span>
      </li>
    )
  }
}

export default ListStudyPreview
