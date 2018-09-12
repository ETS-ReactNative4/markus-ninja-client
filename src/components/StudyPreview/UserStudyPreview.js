import * as React from 'react'
import cls from 'classnames'
import moment from 'moment'
import { Link } from 'react-router-dom'
import HTML from 'components/HTML'
import StudyLink from 'components/StudyLink'
import TopicLink from 'components/TopicLink'
import {get} from 'utils'

class UserStudyPreview extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("UserStudyPreview", className)
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
      <div className={this.classes}>
        <div className="flex">
          <div className="inline-flex flex-column flex-auto">
            <StudyLink className="rn-link mdc-typography--headline5 self-start" study={study} />
            <HTML html={study.descriptionHTML} />
            <div className="flex mv2">
              {topicNodes.map((node) => node
              ? <TopicLink
                  key={node.id}
                  className="mdc-button mdc-button--outlined mr1 mb1"
                />
              : null)}
            </div>
            <div className="mdc-typography--subtitle1 mdc-theme--text-secondary-on-light">
              {this.timestamp}
            </div>
          </div>
          <Link
            className="rn-link inline-flex items-center self-start"
            to={study.resourcePath+"/lessons"}
          >
            <i className="material-icons mr1">subject</i>
            <span className="mdc-typography--subtitle2">
              {study.lessonCount}
            </span>
          </Link>
        </div>
      </div>
    )
  }
}

export default UserStudyPreview
