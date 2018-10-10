import * as React from 'react'
import cls from 'classnames'
import moment from 'moment'
import { Link } from 'react-router-dom'
import Icon from 'components/Icon'
import { get } from 'utils'

class CardTopicPreview extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("CardTopicPreview mdc-card", className)
  }

  render() {
    const topic = get(this.props, "topic", {})
    return (
      <div className={this.classes}>
        <Link className="mdc-card__primary-action" to={topic.resourcePath}>
          <div className="pa3">
            <h6>{topic.name}</h6>
            <div className="mdc-typography--subtitle2 mdc-theme--text-secondary-on-light">
              First used on
              <span className="mh1">{moment(topic.createdAt).format("MMM D, YYYY")}</span>
            </div>
          </div>
          <div className="mdc-typography--body2 ph3 pb2">
            {topic.description}
          </div>
        </Link>
        <div className="mdc-card__actions bottom">
          <div className="mdc-card__action-buttons">
            <Link
              className="mdc-button mdc-card__action mdc-card__action--button"
              to={topic.resourcePath}
            >
              Explore
            </Link>
          </div>
          <div className="mdc-card__action-icons">
            <Link
              className="rn-icon-link mdc-card__action mdc-card__action--icon"
              to={topic.resourcePath+"?t=course"}
            >
              <Icon className="rn-icon-link__icon" icon="course" />
              {get(topic, "courseCount", 0)}
            </Link>
            <Link
              className="rn-icon-link mdc-card__action mdc-card__action--icon"
              to={topic.resourcePath+"?t=study"}
            >
              <Icon className="rn-icon-link__icon" icon="study" />
              {get(topic, "studyCount", 0)}
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export default CardTopicPreview
