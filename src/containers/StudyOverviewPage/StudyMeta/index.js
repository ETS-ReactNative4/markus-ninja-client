import * as React from 'react'
import cls from 'classnames'
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

  get classes() {
    const {className} = this.props
    return cls("StudyMeta mdc-layout-inner", className)
  }

  render() {
    const study = get(this.props, "study", null)
    const {detailsOpen, topicsOpen} = this.state
    return (
      <div className="StudyMeta">
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          {!topicsOpen &&
          <StudyMetaDetails onOpen={(open) => this.setState({ detailsOpen: open })} study={study} />}
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          {!detailsOpen &&
          <StudyMetaTopics onOpen={(open) => this.setState({ topicsOpen: open })} study={study} />}
        </div>
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
