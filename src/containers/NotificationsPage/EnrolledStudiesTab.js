import * as React from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import ViewerEnrolledStudies from './ViewerEnrolledStudies'

import { STUDIES_PER_PAGE } from 'consts'

import "./styles.css"

const EnrolledStudiesTabQuery = graphql`
  query EnrolledStudiesTabQuery(
    $count: Int!,
    $after: String
  ) {
    viewer {
      id
      ...ViewerEnrolledStudies_viewer
    }
  }
`

class EnrolledStudiesTab extends React.Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={EnrolledStudiesTabQuery}
        variables={{
          count: STUDIES_PER_PAGE,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return <ViewerEnrolledStudies viewer={props.viewer} />
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default EnrolledStudiesTab
