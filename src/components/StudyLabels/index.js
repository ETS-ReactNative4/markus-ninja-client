import * as React from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import environment from 'Environment'
import StudyLabelsContainer, {StudyLabelsProp, StudyLabelsPropDefaults} from './StudyLabelsContainer'

import { LABELS_PER_PAGE } from 'consts'

const StudyLabelsQuery = graphql`
  query StudyLabelsQuery(
    $owner: String!,
    $name: String!,
    $count: Int!,
    $after: String,
  ) {
    study(owner: $owner, name: $name) {
      ...StudyLabelsContainer_study @arguments(
        count: $count,
        after: $after,
      )
    }
  }
`

class StudyLabels extends React.Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={StudyLabelsQuery}
        variables={{
          owner: this.props.match.params.owner,
          name: this.props.match.params.name,
          count: LABELS_PER_PAGE,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return (
              <StudyLabelsContainer study={props.study}>
                {this.props.children}
              </StudyLabelsContainer>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export {StudyLabelsProp, StudyLabelsPropDefaults}
export default withRouter(StudyLabels)
