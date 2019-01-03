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
import { get } from 'utils'

const HOME_TAB = 0,
      ACTIVITIES_TAB = 1

class LessonNav extends React.Component {
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
    const resourcePath = get(this.props, "lesson.resourcePath", "")
    switch (pathname) {
      case resourcePath:
        return HOME_TAB
      case resourcePath + "/activities":
        return ACTIVITIES_TAB
      default:
        return HOME_TAB
    }
  }

  activeIndexToPath = (activeIndex) => {
    const resourcePath = get(this.props, "lesson.resourcePath", "")
    switch (activeIndex) {
      case HOME_TAB:
        return resourcePath
      case ACTIVITIES_TAB:
        return resourcePath + "/activities"
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
    const {className, lesson} = this.props

    return (
      <TabBar
        className={className}
        activeIndex={activeIndex}
        indexInView={activeIndex}
        handleActiveIndexUpdate={this.handleActiveIndexUpdate_}
      >
        <Tab minWidth>
          <Icon as="span" className="mdc-tab__icon" icon="lesson" />
          <span className="mdc-tab__text-label">
            Home
          </span>
        </Tab>
        <Tab minWidth>
          <Icon as="span" className="mdc-tab__icon" icon="lesson" />
          <span className="mdc-tab__text-label">
            Activities
            <Counter>{get(lesson, "activities.totalCount", 0)}</Counter>
          </span>
        </Tab>
      </TabBar>
    )
  }
}

export default withRouter(createFragmentContainer(LessonNav, graphql`
  fragment LessonNav_lesson on Lesson {
    activities(first: 0) {
      totalCount
    }
    resourcePath
  }
`))
