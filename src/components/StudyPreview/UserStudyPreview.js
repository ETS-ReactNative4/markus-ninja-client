import * as React from 'react'
import cls from 'classnames'
import pluralize from 'pluralize'
import HTML from 'components/HTML'
import StudyLink from 'components/StudyLink'
import TopicLink from 'components/TopicLink'
import { get, timeDifferenceForDate } from 'utils'

class UserStudyPreview extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("UserStudyPreview", className)
  }

  get timestamp() {
    const advancedAt = get(this.props, "study.advancedAt", null)
    const createdAt = get(this.props, "study.createdAt")

    if (advancedAt) {
      return `Advanced ${timeDifferenceForDate(advancedAt)}`
    } else {
      return `Created ${timeDifferenceForDate(createdAt)}`
    }
  }

  render() {
    const study = get(this.props, "study", {})
    const topicNodes = get(study, "topics.nodes", [])
    return (
      <div className={this.classes}>
        <StudyLink className="rn-link mdc-typography--headline5" study={study} />
        <HTML html={study.descriptionHTML} />
        <div className="flex mv2">
          {topicNodes.map((node) => node
          ? <TopicLink
              key={node.id}
              className="mdc-button mdc-button--outlined mr1 mb1"
            />
          : null)}
        </div>
        <div className="inline-flex">
          <span>{study.lessonCount} {pluralize('lesson', study.lessonCount)}</span>
          <span className="ml2">{this.timestamp}</span>
        </div>
      </div>
    )
  }
}

export default UserStudyPreview
