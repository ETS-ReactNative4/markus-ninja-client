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
  state = {
    detailsOpen: false,
    topicsOpen: false,
  }

  render() {
    const study = get(this.props, "study", null)
    const {detailsOpen, topicsOpen} = this.state
    return (
      <div className="StudyMeta">
        {!topicsOpen &&
        <StudyMetaDetails onOpen={(open) => this.setState({ detailsOpen: open })} study={study} />}
        {!detailsOpen &&
        <StudyMetaTopics onOpen={(open) => this.setState({ topicsOpen: open })} study={study} />}
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
