import * as React from 'react'
import cls from 'classnames'
import { Link, matchPath, withRouter } from 'react-router-dom'
import Counter from 'components/Counter'
import Tab from 'components/Tab'
import TabBar from 'components/TabBar'
import { get } from 'utils'

class TopicSearchNav extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("TopicSearchNav mt3", className)
  }

  render() {
    const { study } = this.props
    const pathname = get(this.props, "location.pathname", "")
    const studyPath = "/:owner/:name"

    return (
      <TabBar className={this.classes}>
        <Tab
          active={matchPath(pathname, { path: studyPath, exact: true })}
          as={Link}
          to={study.resourcePath}
        >
          <span className="mdc-tab__content">
            <span className="mdc-tab__text-label">
              Studies
            </span>
          </span>
        </Tab>
        <Tab
          active={matchPath(pathname, { path: studyPath+"/courses", exact: true })}
          as={Link}
          to={study.resourcePath + "/courses"}
        >
          <span className="mdc-tab__content">
            <span className="mdc-tab__text-label">
              Courses
              <Counter>{get(study, "courses.totalCount", 0)}</Counter>
            </span>
          </span>
        </Tab>
      </TabBar>
    )
  }
}

export default withRouter(TopicSearchNav)
