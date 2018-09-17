import * as React from 'react'
import cls from 'classnames'
import moment from 'moment'
import HTML from 'components/HTML'
import EnrollmentSelect from 'components/EnrollmentSelect'
import UserLink from 'components/UserLink'
import {get} from 'utils'

class TutorUserPreview extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("TutorUserPreview", className)
  }

  render() {
    const user = get(this.props, "user", {})

    return (
      <div className={this.classes}>
        <div className="flex">
          <div className="inline-flex flex-column items-start flex-auto">
            <div>
              <UserLink className="rn-link mdc-typography--headline5 mr1" useName user={user} />
              <UserLink className="rn-link mdc-typography--subtitle1" user={user} />
            </div>
            <HTML html={user.descriptionHTML} />
            <div className="mdc-typography--subtitle1 mdc-theme--text-secondary-on-light">
              Joined on {moment(user.createdAt).format("MMM D, YYYY")}
            </div>
          </div>
          <div className="flex-stable">
            {user.viewerCanEnroll && !user.isViewer &&
            <EnrollmentSelect enrollable={user} />}
          </div>
        </div>
      </div>
    )
  }
}

export default TutorUserPreview
