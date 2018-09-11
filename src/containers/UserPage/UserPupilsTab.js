import * as React from 'react'
import cls from 'classnames'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import environment from 'Environment'
import UserPreview from 'components/UserPreview'
import { get, isEmpty } from 'utils'
import { USERS_PER_PAGE } from 'consts'

const UserPupilsTabQuery = graphql`
  query UserPupilsTabQuery($login: String!, $count: Int!) {
    user(login: $login) {
      id
      isViewer
      enrollees(first: $count)
        @connection(key: "UserPupilsTab_enrollees", filters: []) {
        edges {
          node {
            id
            ...UserPreview_user
          }
        }
      }
    }
  }
`

class UserPupilsTab extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("UserPupilsTab mdc-layout-grid__inner", className)
  }

  render() {
    const { match } = this.props
    return (
      <QueryRenderer
        environment={environment}
        query={UserPupilsTabQuery}
        variables={{
          login: get(match.params, "login", ""),
          count: USERS_PER_PAGE,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const enrolleeEdges = get(props, "user.enrollees.edges", [])

            return (
              <div className={this.classes}>
                <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                  {isEmpty(enrolleeEdges)
                  ? (props.user.isViewer
                    ? <span>
                        You do not have any pupils yet.
                      </span>
                    : <span>
                        This user does have any pupils yet.
                      </span>)
                  : enrolleeEdges.map(({node}) => node
                    ? <UserPreview key={get(node, "id", "")} user={node} />
                    : null)}
                </div>
              </div>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default withRouter(UserPupilsTab)
