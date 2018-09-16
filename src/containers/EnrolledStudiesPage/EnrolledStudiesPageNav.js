import * as React from 'react'
import cls from 'classnames'
import { Link, matchPath, withRouter } from 'react-router-dom'
import Tab from 'components/Tab'
import TabBar from 'components/TabBar'
import { get } from 'utils'

class EnrolledStudiesPageNav extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("EnrolledStudiesPageNav mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const pathname = get(this.props, "location.pathname", "")

    return (
      <TabBar className={this.classes}>
        <Tab
          active={matchPath(pathname, { path: "/notifications", exact: true })}
          minWidth
          as={Link}
          to="/notifications"
        >
          <span className="mdc-tab__content">
            <span className="mdc-tab__icon material-icons">notifications</span>
            <span className="mdc-tab__text-label">Notifications</span>
          </span>
        </Tab>
        <Tab
          active={matchPath(pathname, { path: "/enrolled", exact: true })}
          minWidth
          as={Link}
          to="/enrolled"
        >
          <span className="mdc-tab__content">
            <span className="mdc-tab__icon material-icons">playlist_add_check</span>
            <span className="mdc-tab__text-label">Enrolled</span>
          </span>
        </Tab>
      </TabBar>
    )
  }
}

export default withRouter(EnrolledStudiesPageNav)
