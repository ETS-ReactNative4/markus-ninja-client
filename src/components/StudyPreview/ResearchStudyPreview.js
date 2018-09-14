import * as React from 'react'
import cls from 'classnames'
import {Link} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faApple } from '@fortawesome/free-brands-svg-icons'
import HTML from 'components/HTML'
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
        <Link
          className="rn-link mdc-typography--headline6"
          to={study.resourcePath}
        >
          {study.nameWithOwner}
        </Link>
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
