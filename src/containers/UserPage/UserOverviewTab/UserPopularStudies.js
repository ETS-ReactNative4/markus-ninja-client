import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import StudyPreview from 'components/StudyPreview'
import { get, isEmpty } from 'utils'

class UserPopularStudies extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("UserPopularStudies mdc-layout-grid__inner", className)
  }

  render() {
    const studyEdges = get(this.props, "query.popularStudies.edges", [])

    return (
      <div className={this.classes}>
        <h5 className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          Popular studies
        </h5>
        {isEmpty(studyEdges)
        ? <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            This user has no created any studies yet.
          </div>
        : studyEdges.map(({node}) =>
          node &&
          <div key={get(node, "id", "")} className={cls(
            "mdc-layout-grid__cell",
            "mdc-layout-grid__cell--span-6-desktop",
            "mdc-layout-grid__cell--span-4-tablet",
            "mdc-layout-grid__cell--span-2-phone",
          )}>
            <StudyPreview.User
              className="mdc-card mdc-card--outlined pa3 h-100"
              study={node}
            />
          </div>)}
      </div>
    )
  }
}

export default createFragmentContainer(UserPopularStudies, graphql`
  fragment UserPopularStudies_query on Query @argumentDefinitions(
    within: {type: "ID!"}
  ) {
    popularStudies: search(first: 6, query: "*", type: STUDY, orderBy:{direction: DESC, field: APPLE_COUNT} within: $within)
      @connection(key: "UserPopularStudies_popularStudies", filters: []) {
      edges {
        node {
          id
          ...on Study {
            ...StudyPreview_study
          }
        }
      }
    }
  }
`)
