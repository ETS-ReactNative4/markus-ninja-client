import * as React from 'react'
import cls from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faApple } from '@fortawesome/free-brands-svg-icons'
import HTML from 'components/HTML'
import StudyLink from 'components/StudyLink'
import { get } from 'utils'

class ResearchStudyPreview extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("ResearchStudyPreview flex flex-column", className)
  }

  render() {
    const study = get(this.props, "study", {})

    return (
      <div className={this.classes}>
        <StudyLink
          withOwner
          className="rn-link mdc-typography--headline6"
          study={study}
        />
        <HTML html={study.descriptionHTML} />
        <div className="inline-flex items-center">
          <FontAwesomeIcon className="material-icons mr2" icon={faApple} />
          <span>{get(study, "appleGivers.totalCount", 0)}</span>
        </div>
      </div>
    )
  }
}

export default ResearchStudyPreview
