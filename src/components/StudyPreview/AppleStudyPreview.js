import * as React from 'react'
import cls from 'classnames'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faApple } from '@fortawesome/free-brands-svg-icons'
import { Link } from 'react-router-dom'
import HTML from 'components/HTML'
import AppleButton from 'components/AppleButton'
import StudyLink from 'components/StudyLink'
import TopicLink from 'components/TopicLink'
import {get} from 'utils'

class AppleStudyPreview extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("AppleStudyPreview", className)
  }

  get timestamp() {
    const advancedAt = get(this.props, "study.advancedAt", null)
    const createdAt = get(this.props, "study.createdAt")

    if (advancedAt) {
      return `Advanced on ${moment(advancedAt).format("MMM D")}`
    } else {
      return `Created on ${moment(createdAt).format("MMM D")}`
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
            <div className="inline-flex items-center">
              <Link
                className="rn-link inline-flex items-center self-start"
                to={study.resourcePath}
              >
                <FontAwesomeIcon className="material-icons" icon={faApple} />
                <span className="mdc-typography--subtitle1 ml1">
                  {get(study, "appleGivers.totalCount")}
                </span>
              </Link>
              <span className="mdc-typography--subtitle1 mdc-theme--text-secondary-on-light ml3">
                {this.timestamp}
              </span>
            </div>
          </div>
          <AppleButton className="self-center" appleable={study} />
        </div>
      </div>
    )
  }
}

export default AppleStudyPreview
