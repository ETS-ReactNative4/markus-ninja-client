import * as React from 'react'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import cls from 'classnames'
import {matchPath, withRouter} from 'react-router-dom'
import Icon from 'components/Icon'
import Counter from 'components/Counter'
import Tab from 'components/mdc/Tab'
import TabBar from 'components/mdc/TabBar'
import { get } from 'utils'

class CourseNav extends React.Component {
  isPathActive = (path) => {
    const pathname = get(this.props, "location.pathname", "")
    const match = matchPath(pathname, { path, exact: true })
    return Boolean(match && match.isExact)
  }

  handleClickTab_ = (e) => {
    this.props.history.push(e.target.value)
  }

  get classes() {
    const {className} = this.props
    return cls("mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const course = get(this.props, "course", {})
    const coursePath = "/:owner/:name/course/:number"

    return (
      <div className={this.classes}>
        <TabBar onClickTab={this.handleClickTab_}>
          <Tab
            minWidth
            active={this.isPathActive(coursePath)}
            value={course.resourcePath}
          >
            <Icon as="span" className="mdc-tab__icon" icon="lesson" />
            <span className="mdc-tab__text-label">
              Lessons
              <Counter>{get(course, "lessons.totalCount", 0)}</Counter>
            </span>
          </Tab>
        </TabBar>
      </div>
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
