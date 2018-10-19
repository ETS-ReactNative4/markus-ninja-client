import * as React from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import cls from 'classnames'
import queryString from 'query-string'
import { Link, withRouter } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faApple } from '@fortawesome/free-brands-svg-icons'
import Icon from 'components/Icon'
import Counter from 'components/Counter'
import Tab from 'components/Tab'
import TabBar from 'components/TabBar'
import { get, isEmpty } from 'utils'

class UserNav extends React.Component {
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
      <TabBar className={cls("UserNav", className)}>
        <Tab
          minWidth
          active={isEmpty(tab)}
          as={Link}
          to={user.resourcePath}
        >
          <span className="mdc-tab__content">
            <span className="mdc-tab__text-label">
              Overview
            </span>
          </span>
        </Tab>
        <Tab
          minWidth
          active={tab === "studies"}
          as={Link}
          to={user.resourcePath + "?tab=studies"}
        >
          <span className="mdc-tab__content">
            <Icon as="span" className="mdc-tab__icon" icon="study" />
            <span className="mdc-tab__text-label">
              Studies
              <Counter>{get(user, "studies.totalCount", 0)}</Counter>
            </span>
          </span>
        </Tab>
        <Tab
          minWidth
          active={tab === "assets"}
          as={Link}
          to={user.resourcePath + "?tab=assets"}
        >
          <span className="mdc-tab__content">
            <Icon as="span" className="mdc-tab__icon" icon="asset" />
            <span className="mdc-tab__text-label">
              Assets
              <Counter>{get(user, "assets.totalCount", 0)}</Counter>
            </span>
          </span>
        </Tab>
        <Tab
          minWidth
          active={tab === "apples"}
          as={Link}
          to={user.resourcePath + "?tab=apples"}
        >
          <span className="mdc-tab__content">
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
          </span>
        </Tab>
        <Tab
          minWidth
          active={tab === "pupils"}
          as={Link}
          to={user.resourcePath + "?tab=pupils"}
        >
          <span className="mdc-tab__content">
            <Icon as="span" className="mdc-tab__icon" icon="user" />
            <span className="mdc-tab__text-label">
              Pupils
              <Counter>{get(user, "enrollees.totalCount", 0)}</Counter>
            </span>
          </span>
        </Tab>
        <Tab
          minWidth
          active={tab === "tutors"}
          as={Link}
          to={user.resourcePath + "?tab=tutors"}
        >
          <span className="mdc-tab__content">
            <Icon as="span" className="mdc-tab__icon" icon="user" />
            <span className="mdc-tab__text-label">
              Tutors
              <Counter>{get(user, "enrolled.userCount", 0)}</Counter>
            </span>
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
