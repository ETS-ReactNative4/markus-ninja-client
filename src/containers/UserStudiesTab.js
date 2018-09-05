import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  QueryRenderer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import environment from 'Environment'
import SearchUserStudiesInput from 'components/SearchUserStudiesInput'
import UserStudyPreview from 'components/UserStudyPreview'
import { get, isEmpty } from 'utils'
import { STUDIES_PER_PAGE } from 'consts'

const UserStudiesTabQuery = graphql`
  query UserStudiesTabQuery($login: String!, $count: Int!, $after: String, $query: String!, $within: ID!) {
    ...SearchUserStudiesInput_query @arguments(count: $count, after: $after, query: $query, within: $within)
    user(login: $login) {
      ...SearchUserStudiesInput_user
      id
      isViewer
    }
  }
`

class UserStudiesTab extends React.Component {
  state = {
    studyEdges: []
  }

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
          query: "*",
          within: get(this.props, "user.id", ""),
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            const { studyEdges } = this.state
            return (
              <div className={this.classes}>
                <div className="inline-flex w-100 items-center bb bt pv3 b--black-20">
                  <SearchUserStudiesInput
                    className="flex-auto pr4"
                    query={props}
                    user={props.user}
                    onQueryComplete={(studyEdges) => this.setState({ studyEdges })}
                  />
                  <Link className="mdc-button mdc-button--unelevated ml3" to="/new">New</Link>
                </div>
                {isEmpty(studyEdges)
                ? (props.user.isViewer &&
                  <span>No studies found</span>)
                : studyEdges.map(({node}) => (
                    <UserStudyPreview className="bb pv4 b--black-20" key={node.id} study={node} />
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

export default withRouter(createFragmentContainer(UserStudiesTab, graphql`
  fragment UserStudiesTab_user on User {
    id
  }
`))
