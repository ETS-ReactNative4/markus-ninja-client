import * as React from 'react'
import cls from 'classnames'
import moment from 'moment'
import {Link} from 'react-router-dom'
import Icon from 'components/Icon'
import { get } from 'utils'

class ListTopicPreview extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("ListTopicPreview mdc-list-item", className)
  }

  render() {
    const topic = get(this.props, "topic", {})

    return (
      <li className={this.classes}>
        <Icon as="span" className="mdc-list-item__graphic" icon="topic" />
        <span className="mdc-list-item__text">
          <Link className="mdc-list-item__primary-text" to={topic.resourcePath}>
            {topic.name}
          </Link>
          <span className="mdc-list-item__secondary-text">
            First used on
            <span className="ml1">{moment(topic.createdAt).format("MMM D, YYYY")}</span>
          </span>
        </span>
        <span className="mdc-list-item__meta">
          <Link
            className="rn-icon-link"
            to={topic.resourcePath+"?t=course"}
          >
            <Icon className="rn-icon-link__icon" icon="course" />
            {get(topic, "courseCount", 0)}
          </Link>
          <Link
            className="rn-icon-link"
            to={topic.resourcePath+"?t=study"}
          >
            <Icon className="rn-icon-link__icon" icon="study" />
            {get(topic, "studyCount", 0)}
          </Link>
        </span>
      </li>
    )
  }
}

export default ListTopicPreview
