import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import environment from 'Environment'
import StudyLabels from 'components/StudyLabels'
import { isNil } from 'utils'

import { LESSONS_PER_PAGE } from 'consts'

const AllStudyLabelsPageQuery = graphql`
  query AllStudyLabelsPageQuery(
    $owner: String!,
    $name: String!,
    $count: Int!,
    $after: String
  ) {
    study(owner: $owner, name: $name) {
      id
      ...StudyLabels_study
    }
  }
`

class AllStudyLabelsPage extends Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={AllStudyLabelsPageQuery}
        variables={{
          owner: this.props.match.params.owner,
          name: this.props.match.params.name,
          count: LESSONS_PER_PAGE,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            if (isNil(props.study)) {
              return null
            }
            return (
              <div className="AllStudyLabelsPage">
                <StudyLabels study={props.study} />
              </div>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default withRouter(AllStudyLabelsPage)
