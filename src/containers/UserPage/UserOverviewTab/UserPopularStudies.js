import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import pluralize from 'pluralize'
import StudyLink from 'components/StudyLink'
import { get, isEmpty } from 'utils'

class UserPopularStudies extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("UserPopularStudies mdc-layout-grid__inner", className)
  }

  render() {
    const studyEdges = get(this.props, "query.search.edges", [])

    return (
      <div className={this.classes}>
        <h5 className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          Popular studies
        </h5>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          {isEmpty(studyEdges)
          ? <div>This user has no created any studies yet.</div>
          : studyEdges.map(({node}) => node
            ? <div key={get(node, "id", "")} className={cls(
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
              </div>
            : null)}
        </div>
      </div>
    )
  }
}

export default createFragmentContainer(UserPopularStudies, graphql`
  fragment UserPopularStudies_query on Query @argumentDefinitions(
    within: {type: "ID!"}
  ) {
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
