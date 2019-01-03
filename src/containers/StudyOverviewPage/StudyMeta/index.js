import * as React from 'react'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { get } from 'utils'
import StudyMetaDetails from './StudyMetaDetails'
import StudyMetaTopics from './StudyMetaTopics'

import './styles.css'

class StudyMeta extends React.Component {
  state = {
    detailsOpen: false,
    topicsOpen: false,
  }

  render() {
    const study = get(this.props, "study", null)
    const {detailsOpen, topicsOpen} = this.state
    return (
      <React.Fragment>
        {!topicsOpen &&
        <StudyMetaDetails
          onClose={() => this.setState({ detailsOpen: false })}
          onOpen={() => this.setState({ detailsOpen: true })}
          study={study}
        />}
        {!detailsOpen &&
        <StudyMetaTopics
          onClose={() => this.setState({ topicsOpen: false })}
          onOpen={() => this.setState({ topicsOpen: true })}
          study={study}
        />}
      </React.Fragment>
    )
  }
}

export default createFragmentContainer(StudyMeta, graphql`
  fragment StudyMeta_study on Study @argumentDefinitions(
    after: {type: "String"},
    count: {type: "Int!"},
  ) {
    ...StudyMetaDetails_study
    ...StudyMetaTopics_study @arguments(
      after: $after,
      count: $count,
    )
  }
`)
