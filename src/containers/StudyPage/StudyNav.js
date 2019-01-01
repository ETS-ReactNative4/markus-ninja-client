import * as React from 'react'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import {withRouter} from 'react-router-dom'
import getHistory from 'react-router-global-history'
import Tab from '@material/react-tab'
import TabBar from '@material/react-tab-bar'
import Icon from 'components/Icon'
import Counter from 'components/Counter'
import {filterDefinedReactChildren, get} from 'utils'

const OVERVIEW_TAB = 0,
      LESSONS_TAB = 1,
      COURSES_TAB = 2,
      ASSETS_TAB = 3,
      ACTIVITIES_TAB = 4,
      SETTINGS_TAB = 5

class StudyNav extends React.Component {
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
    const resourcePath = get(this.props, "study.resourcePath", "")
    switch (pathname) {
      case resourcePath:
        return OVERVIEW_TAB
      case resourcePath+"/lessons":
        return LESSONS_TAB
      case resourcePath+"/courses":
        return COURSES_TAB
      case resourcePath+"/assets":
        return ASSETS_TAB
      case resourcePath+"/activities":
        return ACTIVITIES_TAB
      case resourcePath+"/settings":
        return SETTINGS_TAB
      default:
        return OVERVIEW_TAB
    }
  }

  activeIndexToPath = (activeIndex) => {
    const resourcePath = get(this.props, "study.resourcePath", "")
    switch (activeIndex) {
      case OVERVIEW_TAB:
        return resourcePath
      case LESSONS_TAB:
        return resourcePath+"/lessons"
      case COURSES_TAB:
        return resourcePath+"/courses"
      case ASSETS_TAB:
        return resourcePath+"/assets"
      case ACTIVITIES_TAB:
        return resourcePath+"/activities"
      case SETTINGS_TAB:
        return resourcePath+"/settings"
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
    const {className, study} = this.props

    return (
      <TabBar
        className={className}
        activeIndex={activeIndex}
        indexInView={activeIndex}
        handleActiveIndexUpdate={this.handleActiveIndexUpdate_}
      >
        {filterDefinedReactChildren([
        <Tab minWidth>
          <span className="mdc-tab__text-label">
            Overview
          </span>
        </Tab>,
        <Tab minWidth>
          <Icon as="span" className="mdc-tab__icon" icon="lesson" />
          <span className="mdc-tab__text-label">
            Lessons
            <Counter>{get(study, "lessons.totalCount", 0)}</Counter>
          </span>
        </Tab>,
        <Tab minWidth>
          <Icon as="span" className="mdc-tab__icon" icon="course" />
          <span className="mdc-tab__text-label">
            Courses
            <Counter>{get(study, "courses.totalCount", 0)}</Counter>
          </span>
        </Tab>,
        <Tab minWidth>
          <Icon as="span" className="mdc-tab__icon" icon="asset" />
          <span className="mdc-tab__text-label">
            Assets
            <Counter>{get(study, "assets.totalCount", 0)}</Counter>
          </span>
        </Tab>,
        <Tab minWidth>
          <Icon as="span" className="mdc-tab__icon" icon="activity" />
          <span className="mdc-tab__text-label">
            Activities
            <Counter>{get(study, "activities.totalCount", 0)}</Counter>
          </span>
        </Tab>,
        study.viewerCanAdmin &&
        <Tab minWidth>
          <Icon as="span" className="mdc-tab__icon">settings</Icon>
          <span className="mdc-tab__text-label">
            Settings
          </span>
        </Tab>])}
      </TabBar>
    )
  }
}

export default withRouter(createFragmentContainer(StudyNav, graphql`
  fragment StudyNav_study on Study {
    activities(first: 0) {
      totalCount
    }
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
