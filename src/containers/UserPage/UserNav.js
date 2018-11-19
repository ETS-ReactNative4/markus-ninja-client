import * as React from 'react'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import cls from 'classnames'
import queryString from 'query-string'
import {withRouter} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faApple } from '@fortawesome/free-brands-svg-icons'
import Icon from 'components/Icon'
import Counter from 'components/Counter'
import Tab from 'components/mdc/Tab'
import TabBar from 'components/mdc/TabBar'
import { get, isEmpty } from 'utils'

class UserNav extends React.Component {
  handleClickTab_ = (e) => {
    this.props.history.push(e.target.value)
  }

  render() {
    const { className, user } = this.props
    const tab = (() => {
      const query = queryString.parse(get(this.props, "location.search", ""))
      const t = get(query, "tab", "")
      switch (t.toLowerCase()) {
        case "apples":
        case "assets":
        case "pupils":
        case "studies":
        case "tutors":
          return t
        default:
          return ""
      }
    })()

    return (
      <TabBar className={cls("UserNav", className)} onClickTab={this.handleClickTab_}>
        <Tab
          minWidth
          active={isEmpty(tab)}
          value={user.resourcePath}
        >
          <span className="mdc-tab__text-label">
            Overview
          </span>
        </Tab>
        <Tab
          minWidth
          active={tab === "studies"}
          value={user.resourcePath + "?tab=studies"}
        >
          <Icon as="span" className="mdc-tab__icon" icon="study" />
          <span className="mdc-tab__text-label">
            Studies
            <Counter>{get(user, "studies.totalCount", 0)}</Counter>
          </span>
        </Tab>
        <Tab
          minWidth
          active={tab === "assets"}
          value={user.resourcePath + "?tab=assets"}
        >
          <Icon as="span" className="mdc-tab__icon" icon="asset" />
          <span className="mdc-tab__text-label">
            Assets
            <Counter>{get(user, "assets.totalCount", 0)}</Counter>
          </span>
        </Tab>
        <Tab
          minWidth
          active={tab === "apples"}
          value={user.resourcePath + "?tab=apples"}
        >
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
        <Tab
          minWidth
          active={tab === "pupils"}
          value={user.resourcePath + "?tab=pupils"}
        >
          <Icon as="span" className="mdc-tab__icon" icon="user" />
          <span className="mdc-tab__text-label">
            Pupils
            <Counter>{get(user, "enrollees.totalCount", 0)}</Counter>
          </span>
        </Tab>
        <Tab
          minWidth
          active={tab === "tutors"}
          value={user.resourcePath + "?tab=tutors"}
        >
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
