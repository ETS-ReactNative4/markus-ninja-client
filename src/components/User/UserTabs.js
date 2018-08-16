import * as React from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import cls from 'classnames'
import queryString from 'query-string'
import { Link, withRouter } from 'react-router-dom'
import Counter from 'components/Counter'
import Tab from 'components/Tab'
import TabBar from 'components/TabBar'
import { get, isEmpty } from 'utils'

class UserTabs extends React.Component {
  render() {
    const { className, user } = this.props
    const tab = (() => {
      const query = queryString.parse(get(this.props, "location.search", ""))
      const t = get(query, "tab", "")
      switch (t.toLowerCase()) {
        case "apples":
        case "pupils":
        case "studies":
        case "tutors":
          return t
        default:
          return ""
      }
    })()

    return (
      <TabBar className={cls("UserTabs", className)}>
        <Tab
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
          active={tab === "studies"}
          as={Link}
          to={user.resourcePath + "?tab=studies"}
        >
          <span className="mdc-tab__content">
            <span className="mdc-tab__text-label">
              Studies
              <Counter>{get(user, "studies.totalCount", 0)}</Counter>
            </span>
          </span>
        </Tab>
        <Tab
          active={tab === "apples"}
          as={Link}
          to={user.resourcePath + "?tab=apples"}
        >
          <span className="mdc-tab__content">
            <span className="mdc-tab__text-label">
              Apples
              <Counter>{get(user, "appled.studyCount", 0)}</Counter>
            </span>
          </span>
        </Tab>
        <Tab
          active={tab === "pupils"}
          as={Link}
          to={user.resourcePath + "?tab=pupils"}
        >
          <span className="mdc-tab__content">
            <span className="mdc-tab__text-label">
              Pupils
              <Counter>{get(user, "enrollees.totalCount", 0)}</Counter>
            </span>
          </span>
        </Tab>
        <Tab
          active={tab === "tutors"}
          as={Link}
          to={user.resourcePath + "?tab=tutors"}
        >
          <span className="mdc-tab__content">
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

export default withRouter(createFragmentContainer(UserTabs, graphql`
  fragment UserTabs_user on User {
    appled(first: 0 type: STUDY) {
      studyCount
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
