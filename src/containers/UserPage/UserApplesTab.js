import * as React from 'react'
import cls from 'classnames'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import environment from 'Environment'
import AppleablePreview from 'components/AppleablePreview'
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
            ...on Course {
              ...CoursePreview_course
            }
            ...on Study {
              ...StudyPreview_study
            }
          }
        }
      }
    }
  }
`

class UserApplesTab extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("UserApplesTab mdc-layout-grid__inner", className)
  }

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

            return (
              <div className={this.classes}>
                <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
                {isEmpty(appleEdges)
                ? (props.user.isViewer
                  ? <p className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                      You have not appled any studies yet.
                      While you're researching different studies, you can give apples
                      to those you like.
                    </p>
                  : <p className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                      This user has not appled any studies yet.
                    </p>)
                : appleEdges.map(({node}) =>
                    node &&
                    <React.Fragment key={node.id}>
                      <AppleablePreview
                        className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12"
                        appleable={node}
                      />
                      <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
                    </React.Fragment>)}
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
