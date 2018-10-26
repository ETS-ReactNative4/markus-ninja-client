import * as React from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import cls from 'classnames'
import {matchPath, withRouter} from 'react-router-dom'
import Icon from 'components/Icon'
import Counter from 'components/Counter'
import Tab from 'components/mdc/Tab'
import TabBar from 'components/mdc/TabBar'
import { get } from 'utils'

class StudyNav extends React.Component {
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
    const {study} = this.props
    const studyPath = "/:owner/:name"

    return (
      <div className={this.classes}>
        <TabBar onClickTab={this.handleClickTab_}>
          <Tab
            minWidth
            active={this.isPathActive(studyPath)}
            value={study.resourcePath}
          >
            <span className="mdc-tab__text-label">
              Overview
            </span>
          </Tab>
          <Tab
            minWidth
            active={this.isPathActive(studyPath+"/lessons")}
            value={study.resourcePath+"/lessons"}
          >
            <Icon as="span" className="mdc-tab__icon" icon="lesson" />
            <span className="mdc-tab__text-label">
              Lessons
              <Counter>{get(study, "lessons.totalCount", 0)}</Counter>
            </span>
          </Tab>
          <Tab
            minWidth
            active={this.isPathActive(studyPath+"/courses")}
            value={study.resourcePath+"/courses"}
          >
            <Icon as="span" className="mdc-tab__icon" icon="course" />
            <span className="mdc-tab__text-label">
              Courses
              <Counter>{get(study, "courses.totalCount", 0)}</Counter>
            </span>
          </Tab>
          <Tab
            minWidth
            active={this.isPathActive(studyPath+"/assets")}
            value={study.resourcePath+"/assets"}
          >
            <Icon as="span" className="mdc-tab__icon" icon="asset" />
            <span className="mdc-tab__text-label">
              Assets
              <Counter>{get(study, "assets.totalCount", 0)}</Counter>
            </span>
          </Tab>
          {study.viewerCanAdmin &&
          <Tab
            minWidth
            active={this.isPathActive(studyPath+"/settings")}
            value={study.resourcePath+"/settings"}
          >
            <Icon as="span" className="mdc-tab__icon">settings</Icon>
            <span className="mdc-tab__text-label">
              Settings
            </span>
          </Tab>}
        </TabBar>
      </div>
    )
  }
}

export default withRouter(createFragmentContainer(StudyNav, graphql`
  fragment StudyNav_study on Study {
    assets(first: 0) {
      totalCount
    }
    courses(first: 0) {
      totalCount
    }
    lessons(first: 0) {
      totalCount
    }
    resourcePath
    viewerCanAdmin
  }
`))
