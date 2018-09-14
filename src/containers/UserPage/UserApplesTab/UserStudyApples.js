import * as React from 'react'
import cls from 'classnames'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import StudyPreview from 'components/StudyPreview'
import {get, isEmpty} from 'utils'

import { USERS_PER_PAGE } from 'consts'

class UserStudyApples extends React.Component {
  _loadMore = () => {
    const relay = get(this.props, "relay")
    if (!relay.hasMore()) {
      console.log("Nothing more to load")
      return
    } else if (relay.isLoading()){
      console.log("Request is already pending")
      return
    }

    relay.loadMore(USERS_PER_PAGE)
  }

  get classes() {
    const {className} = this.props
    return cls("UserStudyApples mdc-layout-grid__inner", className)
  }

  render() {
    const user = get(this.props, "user", null)
    const appledEdges = get(user, "appledStudies.edges", [])
    return (
      <div className={this.classes}>
        <h5 className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          Appled studies
        </h5>
        {isEmpty(appledEdges)
        ? (user.isViewer
          ? <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              You have not appled any studies yet.
              While you're researching different studies, you can give apples
              to those you like.
            </div>
          : <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              No apples found.
            </div>)
        : <React.Fragment>
            {appledEdges.map(({node}) => (
              node &&
              <React.Fragment key={node.id}>
                <StudyPreview.Apple
                  className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12"
                  study={node}
                />
                <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
              </React.Fragment>
            ))}
            {this.props.relay.hasMore() &&
            <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              <button
                className="mdc-button mdc-button--unelevated"
                onClick={this._loadMore}
              >
                More
              </button>
            </div>}
          </React.Fragment>}
      </div>
    )
  }
}

export default createPaginationContainer(UserStudyApples,
  {
    user: graphql`
      fragment UserStudyApples_user on User @argumentDefinitions(
        count: {type: "Int!"},
        after: {type: "String"},
      ) {
        appledStudies: appled(
          first: $count,
          after: $after,
          orderBy: {direction: DESC field: APPLED_AT}
          type: STUDY
        ) @connection(key: "UserStudyApples_appledStudies", filters: []) {
          edges {
            node {
              id
              ...on Study {
                ...StudyPreview_study
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
        isViewer
      }
    `,
  },
  {
    direction: 'forward',
    query: graphql`
      query UserStudyApplesForwardQuery(
        $login: String!,
        $count: Int!,
        $after: String
      ) {
        user(login: $login) {
          ...UserStudyApples_user @arguments(
            count: $count,
            after: $after,
          )
        }
      }
    `,
    getConnectionFromProps(props) {
      return get(props, "user.appled")
    },
    getFragmentVariables(previousVariables, totalCount) {
      return {
        ...previousVariables,
        count: totalCount,
      }
    },
    getVariables(props, paginationInfo, getFragmentVariables) {
      return {
        owner: props.match.params.owner,
        name: props.match.params.name,
        count: paginationInfo.count,
        after: paginationInfo.cursor,
      }
    },
  },
)
