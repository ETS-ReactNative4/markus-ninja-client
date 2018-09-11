import * as React from 'react'
import cls from 'classnames'
import {
  QueryRenderer,
  createFragmentContainer,
  graphql,
} from 'react-relay'
import environment from 'Environment'
import UserPopularStudies from './UserPopularStudies'
import UserActivitySection from './UserActivitySection'
import { get } from 'utils'

const UserOverviewTabQuery = graphql`
  query UserOverviewTabQuery($within: ID!) {
    ...UserPopularStudies_query @arguments(
      within: $within,
    )
  }
`

class UserOverviewTab extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("UserOverviewTab mdc-layout-grid__inner", className)
  }

  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={UserOverviewTabQuery}
        variables={{
          within: get(this.props, "user.id", ""),
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return (
              <div className={this.classes}>
                <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                  <UserPopularStudies query={props} />
                </div>
                <UserActivitySection className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12"/>
              </div>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default createFragmentContainer(UserOverviewTab, graphql`
  fragment UserOverviewTab_user on User {
    id
  }
`)
