import * as React from 'react'
import cls from 'classnames'
import {
  QueryRenderer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router'
import environment from 'Environment'
import StudyAppleGivers from './StudyAppleGivers'
import {USERS_PER_PAGE} from 'consts'

const StudyAppleGiversPageQuery = graphql`
  query StudyAppleGiversPageQuery(
    $owner: String!,
    $name: String!,
    $count: Int!,
    $after: String,
  ) {
    study(owner: $owner, name: $name) {
      ...StudyAppleGivers_study @arguments(
        count: $count,
        after: $after,
      )
    }
  }
`

class StudyAppleGiversPage extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("StudyAppleGiversPage mdc-layout-grid__inner", className)
  }

  render() {
    const { match } = this.props

    return (
      <QueryRenderer
        environment={environment}
        query={StudyAppleGiversPageQuery}
        variables={{
          owner: match.params.owner,
          name: match.params.name,
          count: USERS_PER_PAGE,
        }}
        render={({error,  props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return (
              <div className={this.classes}>
                <StudyAppleGivers study={props.study} />
              </div>
            )
          }
          return <div>Loading</div>
        }}
      />
    )
  }
}

export default withRouter(StudyAppleGiversPage)
