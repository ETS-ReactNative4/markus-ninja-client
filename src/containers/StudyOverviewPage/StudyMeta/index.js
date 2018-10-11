import * as React from 'react'
import {
  createFragmentContainer,
  graphql
} from 'react-relay'
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
        <StudyMetaDetails onOpen={(open) => this.setState({ detailsOpen: open })} study={study} />}
        {!detailsOpen &&
        <StudyMetaTopics onOpen={(open) => this.setState({ topicsOpen: open })} study={study} />}
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
