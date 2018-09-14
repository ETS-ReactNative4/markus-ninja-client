import * as React from 'react'
import cls from 'classnames'
import moment from 'moment'
import EnrollmentSelect from 'components/EnrollmentSelect'
import UserLink from 'components/UserLink'
import {get} from 'utils'

class StudyUserPreview extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("StudyUserPreview", className)
  }

  render() {
    const user = get(this.props, "user", {})

    return (
      <div className={this.classes}>
        <div className="flex flex-column items-start">
          <UserLink className="rn-link mdc-typography--headline5 self-start" user={user} />
          <div className="mdc-typography--subtitle1 mdc-theme--text-secondary-on-light">
            Joined on {moment(user.createdAt).format("MMM D, YYYY")}
          </div>
          {!user.isViewer &&
          <EnrollmentSelect enrollable={user} />}
        </div>
      </div>
    )
  }
}

export default StudyUserPreview
