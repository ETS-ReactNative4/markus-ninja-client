import * as React from 'react'
import cls from 'classnames'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import StudyLink from 'components/StudyLink'
import EnrollButton from 'components/EnrollButton'
import Icon from 'components/Icon'
import { get, isEmpty } from 'utils'

import { STUDIES_PER_PAGE } from 'consts'

class ViewerEnrolledStudies extends React.Component {
  _loadMore = () => {
    const relay = get(this.props, "relay")
    if (!relay.hasMore()) {
      console.log("Nothing more to load")
      return
    } else if (relay.isLoading()){
      console.log("Request is already pending")
      return
    }

    relay.loadMore(STUDIES_PER_PAGE)
  }

  get classes() {
    const {className} = this.props
    return cls("ViewerEnrolledStudies mdc-layout-grid__inner", className)
  }

  render() {
    const enrolledEdges = get(this.props, "viewer.enrolled.edges", [])

    return (
      <div className="ViewerEnrolledStudies">
        {isEmpty(enrolledEdges)
        ? <div>You are not enrolled in any studies.</div>
        : <div className="mdc-card mdc-card--outlined">
            <div className="mdc-typography--headline5 pa3">
              Enrolled studies
            </div>
            <div className="mdc-list">
              <li role="separator" className="mdc-list-divider" />
              {enrolledEdges.map(({node}) => (
                <li key={node.id} className="mdc-list-item">
                  <Icon as="span" className="mdc-list-item__graphic" icon="study" />
                  <StudyLink study={node} />
                  <span className="mdc-list-item__meta">
                    <EnrollButton enrollable={node} />
                  </span>
                </li>
              ))}
            </div>
            {this.props.relay.hasMore() &&
            <button
              className="mdc-button mdc-button--unelevated"
              onClick={this._loadMore}
            >
              More
            </button>}
          </div>}
      </div>
    )
  }
}

export default createPaginationContainer(ViewerEnrolledStudies,
  {
    viewer: graphql`
      fragment ViewerEnrolledStudies_viewer on User {
        enrolled(
          first: $count,
          after: $after,
          type: STUDY,
          orderBy:{direction: ASC field:ENROLLED_AT}
        ) @connection(key: "ViewerEnrolledStudies_enrolled") {
          edges {
            node {
              id
              ...on Study {
                ...StudyLink_study
                ...EnrollButton_enrollable
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `,
  },
  {
    direction: 'forward',
    query: graphql`
      query ViewerEnrolledStudiesForwardQuery(
        $count: Int!,
        $after: String
      ) {
        viewer {
          ...ViewerEnrolledStudies_viewer
        }
      }
    `,
    getConnectionFromProps(props) {
      return get(props, "viewer.enrolled")
    },
    getFragmentVariables(previousVariables, totalCount) {
      return {
        ...previousVariables,
        count: totalCount,
      }
    },
    getVariables(props, paginationInfo, getFragmentVariables) {
      return {
        count: paginationInfo.count,
        after: paginationInfo.cursor,
      }
    },
  },
)
