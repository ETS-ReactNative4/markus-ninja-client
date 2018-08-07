import React, {Component} from 'react'
import {
  createFragmentContainer,
  graphql
} from 'react-relay'
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

export default createFragmentContainer(StudyMeta, graphql`
  fragment StudyMeta_study on Study {
    ...StudyMetaDetails_study
    ...StudyMetaTopics_study
  }
`)
