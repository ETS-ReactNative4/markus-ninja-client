import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import StudyLabels from 'components/StudyLabels'
import CreateLabelForm from 'components/CreateLabelForm'
import { isNil } from 'utils'

import { LESSONS_PER_PAGE } from 'consts'

const StudyLabelsPageQuery = graphql`
  query StudyLabelsPageQuery(
    $owner: String!,
    $name: String!,
    $count: Int!,
    $after: String
  ) {
    study(owner: $owner, name: $name) {
      id
      ...StudyLabels_study
      ...CreateLabelForm_study
    }
  }
`

class StudyLabelsPage extends Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={StudyLabelsPageQuery}
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
              <div className="StudyLabelsPage">
                <CreateLabelForm study={props.study} />
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

export default StudyLabelsPage
