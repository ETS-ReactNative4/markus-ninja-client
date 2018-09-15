import * as React from 'react'
import cls from 'classnames'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import UserPreview from 'components/UserPreview'
import {get} from 'utils'

import { USERS_PER_PAGE } from 'consts'

class StudyEnrollees extends React.Component {
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
    return cls("StudyEnrollees mdc-layout-grid__inner", className)
  }

  render() {
    const study = get(this.props, "study", null)
    const enrolleeEdges = get(study, "enrollees.edges", [])
    return (
      <div className={this.classes}>
        {enrolleeEdges.map(({node}) => (
          node &&
          <div key={node.id} className="mdc-layout-grid__cell">
            <UserPreview.Study user={node} />
            <div className="rn-divider mt4" />
          </div>
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
      </div>
    )
  }
}

export default createPaginationContainer(StudyEnrollees,
  {
    study: graphql`
      fragment StudyEnrollees_study on Study @argumentDefinitions(
        count: {type: "Int!"},
        after: {type: "String"},
      ) {
        enrollees(
          first: $count,
          after: $after,
          orderBy:{direction: DESC field: ENROLLED_AT}
        ) @connection(key: "StudyEnrollees_enrollees", filters: []) {
          edges {
            node {
              id
              ...UserPreview_user
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
      query StudyEnrolleesForwardQuery(
        $owner: String!,
        $name: String!,
        $count: Int!,
        $after: String
      ) {
        study(owner: $owner, name: $name) {
          ...StudyEnrollees_study @arguments(
            count: $count,
            after: $after,
          )
        }
      }
    `,
    getConnectionFromProps(props) {
      return get(props, "study.enrollees")
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