import React, {Component} from 'react'
import { get } from 'utils'
import StudyMetaDetails from './StudyMetaDetails'
import StudyMetaTopics from './StudyMetaTopics'

import './StudyMeta.css'

class StudyMeta extends Component {
  render() {
    const study = get(this.props, "study", {})
    return (
      <div className="StudyMeta">
        <StudyMetaDetails study={study} />
        <StudyMetaTopics study={study} />
      </div>
    )
  }
}

export default StudyMeta
