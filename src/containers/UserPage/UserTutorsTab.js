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

const UserTutorsTabQuery = graphql`
  query UserTutorsTabQuery($login: String!, $count: Int!) {
    user(login: $login) {
      id
      isViewer
      enrolled(first: $count, type: USER)
        @connection(key: "UserTutorsTab_enrolled", filters: []) {
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

class UserTutorsTab extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("UserTutorsTab mdc-layout-grid__inner", className)
  }

  render() {
    const { match } = this.props
    return (
      <QueryRenderer
        environment={environment}
        query={UserTutorsTabQuery}
        variables={{
          login: get(match.params, "login", ""),
          count: USERS_PER_PAGE,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const enrolledEdges = get(props, "user.enrolled.edges", [])

            return (
              <div className={this.classes}>
                <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                  {isEmpty(enrolledEdges)
                  ? (props.user.isViewer
                    ? <span>
                        You have not enrolled in any users yet.
                        If you would like to receive notifications when certain users
                        create new studies, then go to their profile page and change your
                        enrollment status to Enrolled.
                      </span>
                    : <span>
                        This user has not enrolled in any users yet.
                      </span>)
                  : enrolledEdges.map(({node}) => node
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

export default withRouter(UserTutorsTab)
