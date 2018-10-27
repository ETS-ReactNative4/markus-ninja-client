import * as React from 'react'
import {matchPath, withRouter} from 'react-router-dom'
import Tab from 'components/mdc/Tab'
import TabBar from 'components/mdc/TabBar'
import { get } from 'utils'

class NotificationsPageNav extends React.Component {
  isPathActive = (path) => {
    const pathname = get(this.props, "location.pathname", "")
    const match = matchPath(pathname, { path, exact: true })
    return Boolean(match && match.isExact)
  }

  handleClickTab_ = (e) => {
    this.props.history.push(e.target.value)
  }

  render() {
    const {className} = this.props

    return (
      <TabBar className={className} onClickTab={this.handleClickTab}>
        <Tab
          active={this.isPathActive("/notifications")}
          minWidth
          value="/notifications"
        >
          <span className="mdc-tab__icon material-icons">notifications</span>
          <span className="mdc-tab__text-label">Notifications</span>
        </Tab>
        <Tab
          active={this.isPathActive("/enrolled")}
          minWidth
          value="/enrolled"
        >
          <span className="mdc-tab__icon material-icons">playlist_add_check</span>
          <span className="mdc-tab__text-label">Enrolled</span>
        </Tab>
      </TabBar>
    )
  }
}

export default withRouter(NotificationsPageNav)
