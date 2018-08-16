import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import environment from 'Environment'
import Edge from 'components/Edge'
import AppleablePreview from 'components/AppleablePreview.js'
import { get, isEmpty } from 'utils'
import { APPLES_PER_PAGE } from 'consts'

const UserApplesTabQuery = graphql`
  query UserApplesTabQuery($login: String!, $count: Int!) {
    user(login: $login) {
      id
      isViewer
      appled(first: $count, orderBy:{direction: DESC field:APPLED_AT}, type: STUDY)
        @connection(key: "UserApplesTab_appled", filters: []) {
        edges {
          node {
            id
            ...AppleablePreview_appleable
          }
        }
      }
    }
  }
`

class UserApplesTab extends Component {
  render() {
    const { match } = this.props
    return (
      <QueryRenderer
        environment={environment}
        query={UserApplesTabQuery}
        variables={{
          login: get(match.params, "login", ""),
          count: APPLES_PER_PAGE,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const appleEdges = get(props, "user.appled.edges", [])
            if (isEmpty(appleEdges)) {
              return (
                <div className="UserApplesTab">
                  {props.user.isViewer
                  ? <span>
                      You have not appled any studies yet.
                      While you're researching different studies, you can give apples
                      to those you like.
                    </span>
                  : <span>
                      This user has not appled any studies yet.
                    </span>}
                </div>
              )
            }
            return (
              <div className="UserApplesTab">
                {appleEdges.map((edge) =>
                  <Edge key={get(edge, "node.id", "")} edge={edge} render={({node = null}) =>
                    <AppleablePreview appleable={node} />}
                  />
                )}
              </div>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default withRouter(UserApplesTab)
