import React, {Component} from 'react'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import cls from 'classnames'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import environment from 'Environment'
import UserStudyPreview from 'components/UserStudyPreview'
import { get, isEmpty } from 'utils'
import { STUDIES_PER_PAGE } from 'consts'

const UserStudiesTabQuery = graphql`
  query UserStudiesTabQuery($login: String!, $count: Int!) {
    user(login: $login) {
      id
      isViewer
      studies(first: $count, orderBy:{direction: DESC field:CREATED_AT})
        @connection(key: "UserStudiesTab_studies", filters: []) {
        edges {
          node {
            id
            ...UserStudyPreview_study
          }
        }
      }
    }
  }
`

class UserStudiesTab extends Component {
  get classes() {
    const {className} = this.props
    return cls("UserStudiesTab", className)
  }

  render() {
    const { match } = this.props
    return (
      <QueryRenderer
        environment={environment}
        query={UserStudiesTabQuery}
        variables={{
          login: get(match.params, "login", ""),
          count: STUDIES_PER_PAGE,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const studyEdges = get(props, "user.studies.edges", [])
            if (isEmpty(studyEdges)) {
              return (
                <div className={this.classes}>
                  {props.user.isViewer
                  ? <Link to="/new">Create a study to get started</Link>
                  : <span>This user has not created and studies yet.</span>}
                </div>
              )
            }
            return (
              <div className={this.classes}>
                {studyEdges.map(({node}) => (
                  <UserStudyPreview className="bb pv2" key={node.id} study={node} />
                ))}
              </div>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default withRouter(UserStudiesTab)
