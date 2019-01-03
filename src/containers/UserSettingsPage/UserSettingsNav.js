import * as React from 'react'
import {withRouter} from 'react-router-dom'
import getHistory from 'react-router-global-history'
import Tab from '@material/react-tab'
import TabBar from '@material/react-tab-bar'
import { get } from 'utils'

import './styles.css'

const SETTINGS_PATH = "/settings"
const PROFILE_TAB = 0,
      ACCOUNT_TAB = 1,
      EMAILS_TAB = 2

class UserSettingsNav extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeIndex: this.getActiveIndex(),
    }
  }

  componentDidUpdate(prevProps) {
    const pathname = get(this.props, "location.pathname", "")
    const prevPathname = get(prevProps, "location.pathname", "")
    if (pathname !== prevPathname) {
      this.setState({
        activeIndex: this.getActiveIndex(),
      })
    }
  }

  getActiveIndex = () => {
    const pathname = get(this.props, "location.pathname", "")
    switch (pathname) {
      case SETTINGS_PATH+"/profile":
        return PROFILE_TAB
      case SETTINGS_PATH+"/account":
        return ACCOUNT_TAB
      case SETTINGS_PATH+"/emails":
        return EMAILS_TAB
      default:
        return PROFILE_TAB
    }
  }

  activeIndexToPath = (activeIndex) => {
    switch (activeIndex) {
      case PROFILE_TAB:
        return SETTINGS_PATH+"/profile"
      case ACCOUNT_TAB:
        return SETTINGS_PATH+"/account"
      case EMAILS_TAB:
        return SETTINGS_PATH+"/emails"
      default:
        return SETTINGS_PATH+"/profile"
    }
  }

  handleActiveIndexUpdate_ = (activeIndex) => {
    const path = this.activeIndexToPath(activeIndex)
    getHistory().push(path)
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
          <span className="mdc-tab__icon material-icons">person</span>
          <span className="mdc-tab__text-label">Profile</span>
        </Tab>
        <Tab minWidth>
          <span className="mdc-tab__icon material-icons">account_box</span>
          <span className="mdc-tab__text-label">Account</span>
        </Tab>
        <Tab minWidth>
          <span className="mdc-tab__icon material-icons">email</span>
          <span className="mdc-tab__text-label">Emails</span>
        </Tab>
      </TabBar>
    )
  }
}

export default withRouter(UserSettingsNav)
