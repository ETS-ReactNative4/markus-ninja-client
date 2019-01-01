import * as React from 'react'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import queryString from 'query-string'
import {withRouter} from 'react-router-dom'
import getHistory from 'react-router-global-history'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faApple } from '@fortawesome/free-brands-svg-icons'
import Tab from '@material/react-tab'
import TabBar from '@material/react-tab-bar'
import Icon from 'components/Icon'
import Counter from 'components/Counter'
import {get} from 'utils'

const OVERVIEW_TAB = 0,
      STUDIES_TAB = 1,
      ASSETS_TAB = 2,
      APPLES_TAB = 3,
      PUPILS_TAB = 4,
      TUTORS_TAB = 5

class UserNav extends React.Component {
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
    const query = queryString.parse(get(this.props, "location.search", ""))
    const t = get(query, "tab", "")
    switch (t.toLowerCase()) {
      case "apples":
        return APPLES_TAB
      case "assets":
        return ASSETS_TAB
      case "pupils":
        return PUPILS_TAB
      case "studies":
        return STUDIES_TAB
      case "tutors":
        return TUTORS_TAB
      default:
        return OVERVIEW_TAB
    }
  }

  activeIndexToPath = (activeIndex) => {
    const resourcePath = get(this.props, "user.resourcePath", "")
    switch (activeIndex) {
      case OVERVIEW_TAB:
        return resourcePath
      case STUDIES_TAB:
        return resourcePath+"?tab=studies"
      case ASSETS_TAB:
        return resourcePath+"?tab=assets"
      case APPLES_TAB:
        return resourcePath+"?tab=apples"
      case PUPILS_TAB:
        return resourcePath+"?tab=pupils"
      case TUTORS_TAB:
        return resourcePath+"?tab=tutors"
      default:
        return resourcePath
    }
  }

  handleActiveIndexUpdate_ = (activeIndex) => {
    const path = this.activeIndexToPath(activeIndex)
    getHistory().push(path)
  }

  render() {
    const {activeIndex} = this.state
    const { className, user } = this.props

    return (
      <TabBar
        className={className}
        activeIndex={activeIndex}
        indexInView={activeIndex}
        handleActiveIndexUpdate={this.handleActiveIndexUpdate_}
      >
        <Tab minWidth>
          <span className="mdc-tab__text-label">
            Overview
          </span>
        </Tab>
        <Tab minWidth>
          <Icon as="span" className="mdc-tab__icon" icon="study" />
          <span className="mdc-tab__text-label">
            Studies
            <Counter>{get(user, "studies.totalCount", 0)}</Counter>
          </span>
        </Tab>
        <Tab minWidth>
          <Icon as="span" className="mdc-tab__icon" icon="asset" />
          <span className="mdc-tab__text-label">
            Assets
            <Counter>{get(user, "assets.totalCount", 0)}</Counter>
          </span>
        </Tab>
        <Tab minWidth>
          <FontAwesomeIcon
            className="mdc-tab__icon"
            icon={faApple}
            size="2x"
          />
          <span className="mdc-tab__text-label">
            Apples
            <Counter>{
              get(user, "appled.courseCount", 0) +
              get(user, "appled.studyCount", 0)
            }</Counter>
          </span>
        </Tab>
        <Tab minWidth>
          <Icon as="span" className="mdc-tab__icon" icon="user" />
          <span className="mdc-tab__text-label">
            Pupils
            <Counter>{get(user, "enrollees.totalCount", 0)}</Counter>
          </span>
        </Tab>
        <Tab minWidth>
          <Icon as="span" className="mdc-tab__icon" icon="user" />
          <span className="mdc-tab__text-label">
            Tutors
            <Counter>{get(user, "enrolled.userCount", 0)}</Counter>
          </span>
        </Tab>
      </TabBar>
    )
  }
}

export default withRouter(createFragmentContainer(UserNav, graphql`
  fragment UserNav_user on User {
    appled(first: 0 type: STUDY) {
      courseCount
      studyCount
    }
    assets(first: 0) {
      totalCount
    }
    enrollees(first: 0) {
      totalCount
    }
    enrolled(first: 0 type: USER) {
      userCount
    }
    studies(first: 0) {
      totalCount
    }
    resourcePath
  }
`))
