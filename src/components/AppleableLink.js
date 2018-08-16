import * as React from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { get } from 'utils'
import StudyLink from './StudyLink'

class AppleableLink extends React.Component {
  render() {
    const appleable = get(this.props, "appleable", {})
    switch(appleable.__typename) {
      case "Study":
        return <StudyLink study={appleable} />
      default:
        return null
    }
  }
}

export default createFragmentContainer(AppleableLink, graphql`
  fragment AppleableLink_appleable on Appleable {
    __typename
    ...on Study {
      ...StudyLink_study
    }
  }
`)
