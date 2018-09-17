import * as React from 'react'
import cls from 'classnames'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faApple } from '@fortawesome/free-brands-svg-icons'
import { Link } from 'react-router-dom'
import HTML from 'components/HTML'
import {AppleButton} from 'components/AppleButton'
import TopicLink from 'components/TopicLink'
import {get} from 'utils'

class AppleCoursePreview extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("AppleCoursePreview", className)
  }

  get timestamp() {
    const advancedAt = get(this.props, "course.advancedAt", null)
    const createdAt = get(this.props, "course.createdAt")

    if (advancedAt) {
      return `Advanced on ${moment(advancedAt).format("MMM D")}`
    } else {
      return `Created on ${moment(createdAt).format("MMM D")}`
    }
  }

  render() {
    const course = get(this.props, "course", {})
    const topicNodes = get(course, "topics.nodes", [])
    return (
      <div className={this.classes}>
        <div className="flex">
          <div className="inline-flex flex-column flex-auto">
            <span className="mdc-typography--headline5 self-start">
              <Link
                className="rn-link"
                to={get(course, "study.resourcePath")}
              >
                {get(course, "study.name")}
              </Link>
              /
              <Link
                className="rn-link"
                to={course.resourcePath}
              >
                {course.name}
              </Link>
            </span>
            <HTML html={course.descriptionHTML} />
            <div className="flex mv2">
              {topicNodes.map((node) =>
                node &&
                <TopicLink
                  key={node.id}
                  className="mdc-button mdc-button--outlined mr1 mb1"
                  topic={node}
                />)}
            </div>
            <div className="inline-flex items-center">
              <Link
                className="rn-link inline-flex items-center self-start"
                to={course.resourcePath}
              >
                <FontAwesomeIcon className="material-icons" icon={faApple} />
                <span className="mdc-typography--subtitle1 ml1">
                  {get(course, "appleGivers.totalCount", 0)}
                </span>
              </Link>
              <span className="mdc-typography--subtitle1 mdc-theme--text-secondary-on-light ml3">
                {this.timestamp}
              </span>
            </div>
          </div>
          {course.viewerCanApple &&
          <AppleButton className="self-center" appleable={course} />}
        </div>
      </div>
    )
  }
}

export default AppleCoursePreview
