import * as React from 'react'
import cls from 'classnames'
import Relay, {
  graphql,
} from 'react-relay'
import hoistNonReactStatic from 'hoist-non-react-statics'
import { Link } from 'react-router-dom'
import { get } from 'utils'
import StudyUserPreview from './StudyUserPreview'
import TutorUserPreview from './TutorUserPreview'

const FRAGMENT = graphql`
  fragment UserPreview_user on User {
    ...EnrollmentSelect_enrollable
    ...UserLink_user
    bio
    createdAt
    isViewer
    login
    name
    resourcePath
  }
`

class UserPreview extends React.Component {
  static Study = Relay.createFragmentContainer(StudyUserPreview, FRAGMENT)
  static Tutor = Relay.createFragmentContainer(TutorUserPreview, FRAGMENT)

  get classes() {
    const {className} = this.props
    return cls("UserPreview", className)
  }

  render() {
    const user = get(this.props, "user", {})
    return (
      <div className={this.classes}>
        <Link to={user.resourcePath}>
          <span>{user.login}</span>
          <span>{user.name}</span>
          <div>{user.bio}</div>
        </Link>
      </div>
    )
  }
}


export default hoistNonReactStatic(
  Relay.createFragmentContainer(UserPreview, FRAGMENT),
  UserPreview,
)
