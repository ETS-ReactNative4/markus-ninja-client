import * as React from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { get } from 'utils'
import StudyLink from './StudyLink'

class CreateableLink extends React.Component {
  render() {
    const createable = get(this.props, "createable", {})
    switch(createable.__typename) {
      case "Study":
        return <StudyLink study={createable} />
      default:
        return null
    }
  }
}

export default createFragmentContainer(CreateableLink, graphql`
  fragment CreateableLink_createable on Createable {
    __typename
    ...on Study {
      ...StudyLink_study
    }
  }
`)
