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

const LESSONS_TAB = 0

class ActivityNav extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeIndex: this.getActiveIndex(),
    }
  }

  getActiveIndex = () => {
    const pathname = get(this.props, "location.pathname", "")
    const resourcePath = get(this.props, "activity.resourcePath", "")
    switch (pathname) {
      case resourcePath:
        return LESSONS_TAB
      default:
        return LESSONS_TAB
    }
  }

  activeIndexToPath = (activeIndex) => {
    const resourcePath = get(this.props, "activity.resourcePath", "")
    switch (activeIndex) {
      case LESSONS_TAB:
        return resourcePath
      default:
        return resourcePath
    }
  }

  handleActiveIndexUpdate_ = (activeIndex) => {
    this.setState({activeIndex})
    const path = this.activeIndexToPath(activeIndex)
    getHistory().push(path)
  }

  render() {
    const {activeIndex} = this.state
    const {className, activity} = this.props

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
            Assets
            <Counter>{get(activity, "assets.totalCount", 0)}</Counter>
          </span>
        </Tab>
      </TabBar>
    )
  }
}

export default withRouter(createFragmentContainer(ActivityNav, graphql`
  fragment ActivityNav_activity on Activity {
    assets(first: 0) {
      totalCount
    }
    resourcePath
    viewerCanAdmin
  }
`))
