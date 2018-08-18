import * as React from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import cls from 'classnames'
import pluralize from 'pluralize'
import Edge from 'components/Edge'
import StudyLink from 'components/StudyLink'
import { get } from 'utils'

class UserPopularStudies extends React.Component {
  render() {
    const studyEdges = get(this.props, "query.search.edges", [])

    return (
      <div className="UserPopularStudies">
        <h3>Popular studies</h3>
        <div className="mdc-layout-grid__inner">
          {studyEdges.map((edge) =>
          <Edge key={get(edge, "node.id")} edge={edge} render={({node}) =>
            <div className={cls(
              "mdc-card",
              "mdc-layout-grid__cell",
              "mdc-layout-grid__cell--span-6-desktop",
              "mdc-layout-grid__cell--span-4-tablet",
              "mdc-layout-grid__cell--span-2-phone",
              "pa3",
            )}>
              <div className="flex flex-column">
                <StudyLink study={node} />
                <div>{node.description}</div>
                <div>{node.lessonCount} {pluralize('lesson', node.lessonCount)}</div>
              </div>
            </div>}
          />)}
        </div>
      </div>
    )
  }
}

export default createFragmentContainer(UserPopularStudies, graphql`
  fragment UserPopularStudies_query on Query {
    search(first: 6, query: "*", type: STUDY, orderBy:{direction: DESC, field: APPLE_COUNT} within: $within)
      @connection(key: "UserPopularStudies_search", filters: []) {
      edges {
        node {
          id
          ...on Study {
            ...StudyLink_study
            description
            lessonCount
            name
          }
        }
      }
    }
  }
`)
