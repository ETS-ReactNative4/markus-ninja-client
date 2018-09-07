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
    return cls("UserStudiesTab mdc-layout-grid__inner", className)
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
                <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                  <div className="inline-flex items-center w-100">
                    <SearchUserStudiesInput
                      className="flex-auto mr4"
                      query={props}
                      user={props.user}
                      onQueryComplete={(studyEdges) => this.setState({ studyEdges })}
                    />
                    <Link className="mdc-button mdc-button--unelevated ml3" to="/new">New</Link>
                  </div>
                </div>
                <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
                {isEmpty(studyEdges)
                ? <span className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                    No studies found
                  </span>
                : studyEdges.map(({node}) => (
                    <React.Fragment key={get(node, "id", "")}>
                      <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                        <UserStudyPreview className="" key={node.id} study={node} />
                      </div>
                      <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
                    </React.Fragment>
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
