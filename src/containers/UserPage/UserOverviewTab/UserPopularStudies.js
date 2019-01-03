import * as React from 'react'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import StudyPreview from 'components/StudyPreview'
import { get, isEmpty } from 'utils'

class UserPopularStudies extends React.Component {
  render() {
    const studyEdges = get(this.props, "user.studies.edges", [])

    return (
      <React.Fragment>
        <h5 className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          Popular studies
        </h5>
        {isEmpty(studyEdges)
        ? <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            This user has no created any studies yet.
          </div>
        : studyEdges.map(({node}) =>
          node &&
          <div
            key={get(node, "id", "")}
            className="mdc-layout-grid__cell mdc-layout-grid__cell--span-4"
          >
            <StudyPreview.Card className="h-100" study={node} />
          </div>)}
      </React.Fragment>
    )
  }
}

export default createFragmentContainer(UserPopularStudies, graphql`
  fragment UserPopularStudies_user on User {
    studies(first: 4, orderBy:{direction: DESC, field: APPLE_COUNT})
      @connection(key: "UserPopularStudies_studies", filters: []) {
      edges {
        node {
          id
          ...on Study {
            ...CardStudyPreview_study
          }
        }
      }
    }
  }
`)
