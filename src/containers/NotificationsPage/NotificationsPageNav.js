import * as React from 'react'
import {withRouter} from 'react-router-dom'
import Tab from '@material/react-tab'
import TabBar from '@material/react-tab-bar'
import { get } from 'utils'

const NOTIFICATIONS_TAB = 0,
      ENROLLED_TAB = 1

class NotificationsPageNav extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeIndex: this.getActiveIndex(),
    }
  }

  getActiveIndex = () => {
    const pathname = get(this.props, "location.pathname", "")
    switch (pathname) {
      case "/notificajions":
        return NOTIFICATIONS_TAB
      case "/enrolled":
        return ENROLLED_TAB
      default:
        return NOTIFICATIONS_TAB
    }
  }

  activeIndexToPath = (activeIndex) => {
    switch (activeIndex) {
      case NOTIFICATIONS_TAB:
        return "/notifications"
      case ENROLLED_TAB:
        return "/enrolled"
      default:
        return "/notifications"
    }
  }

  handleActiveIndexUpdate_ = (activeIndex) => {
    this.setState({activeIndex})
    const path = this.activeIndexToPath(activeIndex)
    this.props.history.push(path)
  }

  render() {
    const {activeIndex} = this.state
    const {className} = this.props

    return (
      <TabBar
        className={className}
        activeIndex={activeIndex}
        indexInView={activeIndex}
        handleActiveIndexUpdate={this.handleActiveIndexUpdate_}
      >
        <Tab minWidth>
          <span className="mdc-tab__icon material-icons">notifications</span>
          <span className="mdc-tab__text-label">Notifications</span>
        </Tab>
        <Tab minWidth>
          <span className="mdc-tab__icon material-icons">playlist_add_check</span>
          <span className="mdc-tab__text-label">Enrolled</span>
        </Tab>
      </TabBar>
    )
  }
}

export default withRouter(NotificationsPageNav)
