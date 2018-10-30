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
          <div className="rn-card__header">
            <Icon as="span" className="rn-card__header__graphic" icon="topic" />
            <div className="rn-card__text">
              <h6 className="rn-card__title">
                {topic.name}
              </h6>
              <div className="rn-card__subtitle">
                First used on
                <span className="mh1">{moment(topic.createdAt).format("MMM D, YYYY")}</span>
              </div>
            </div>
          </div>
          <div className="rn-card__body">
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
              {get(topic, "topicables.courseCount", 0)}
            </Link>
            <Link
              className="rn-icon-link mdc-card__action mdc-card__action--icon"
              to={topic.resourcePath+"?t=study"}
            >
              <Icon className="rn-icon-link__icon" icon="study" />
              {get(topic, "topicables.studyCount", 0)}
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export default CardTopicPreview
