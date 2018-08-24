import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import cls from 'classnames'
import pluralize from 'pluralize'
import { Link } from 'react-router-dom'
import HTML from 'components/HTML'
import StudyLink from 'components/StudyLink'
import { get, timeDifferenceForDate } from 'utils'

class UserStudyPreview extends Component {
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
        <StudyLink className="mdc-typography--headline5" study={study} />
        <HTML html={study.descriptionHTML} />
        <div className="flex">
          {topicNodes.map((node = {}) =>
          <Link
            className="mdc-button mdc-button--outlined mr1 mb1"
            key={node.id}
            to={node.resourcePath}
          >
            {node.name}
          </Link>)}
        </div>
        <div className="inline-flex">
          <span>{study.lessonCount} {pluralize('lesson', study.lessonCount)}</span>
          <span className="ml2">{this.timestamp}</span>
        </div>
      </div>
    )
  }
}

export default createFragmentContainer(UserStudyPreview, graphql`
  fragment UserStudyPreview_study on Study {
    advancedAt
    createdAt
    descriptionHTML
    isPrivate
    lessonCount
    ...StudyLink_study
    topics(first: 5) {
      nodes {
        id
        name
        resourcePath
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`)
