import * as React from 'react'
import cls from 'classnames'
import NotificationsPageNav from './NotificationsPageNav'
import NotificationsTab from './NotificationsTab'
import EnrolledStudiesTab from './EnrolledStudiesTab'

import "./styles.css"

class NotificationsPage extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("NotificationsPage mdc-layout-grid mw8", className)
  }

  render() {
    const tab = this.props.match.params[0]

    return (
      <div className={this.classes}>
        <div className="mdc-layout-grid__inner">
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <NotificationsPageNav />
          </div>
          <div className="rn-divider mdc-layout-grid__cell mdc-layout-grid__cell--span-12" />
          <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            {tab === "notifications"
            ? <NotificationsTab />
            : tab === "enrolled"
              ? <EnrolledStudiesTab />
            : null}
          </div>
        </div>
      </div>
    )
  }
}

export default NotificationsPage
