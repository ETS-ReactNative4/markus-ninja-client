import * as React from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import cls from 'classnames'
import { Link, matchPath, withRouter } from 'react-router-dom'
import Icon from 'components/Icon'
import Counter from 'components/Counter'
import Tab from 'components/Tab'
import TabBar from 'components/TabBar'
import { get } from 'utils'

class CourseNav extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const course = get(this.props, "course", {})
    const pathname = get(this.props, "location.pathname", "")
    const coursePath = "/:owner/:name/course/:number"

    return (
      <TabBar className={this.classes}>
        <Tab
          minWidth
          active={matchPath(pathname, { path: coursePath, exact: true })}
          as={Link}
          to={course.resourcePath}
        >
          <span className="mdc-tab__content">
            <Icon as="span" className="mdc-tab__icon" icon="lesson" />
            <span className="mdc-tab__text-label">
              Lessons
              <Counter>{get(course, "lessons.totalCount", 0)}</Counter>
            </span>
          </span>
        </Tab>
        {course.viewerCanAdmin &&
        <Tab
          minWidth
          active={matchPath(pathname, { path: coursePath+"/settings", exact: true })}
          as={Link}
          to={course.resourcePath + "/settings"}
        >
          <span className="mdc-tab__content">
            <Icon as="span" className="mdc-tab__icon">settings</Icon>
            <span className="mdc-tab__text-label">
              Settings
            </span>
          </span>
        </Tab>}
      </TabBar>
    )
  }
}

export default withRouter(createFragmentContainer(CourseNav, graphql`
  fragment CourseNav_course on Course {
    lessons(first: 0) {
      totalCount
    }
    resourcePath
    viewerCanAdmin
  }
`))
