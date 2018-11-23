import * as React from 'react'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import {withRouter} from 'react-router-dom'
import Tab from '@material/react-tab'
import TabBar from '@material/react-tab-bar'
import Counter from 'components/Counter'
import { get } from 'utils'

const STUDIES_TAB = 0,
      COURSES_TAB = 1

class TopicNav extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeIndex: this.getActiveIndex(),
    }
  }

  componentDidMount() {
    const query = queryString.parse(get(this.props, "location.search", ""))
    const t = query.t
    if (t && t !== "study" && t !== "course") {
      query.t = "study"
      const pathname = get(this.props, "location.pathname", "")
      const search = queryString.stringify(query)
      this.props.history.push({pathname, search})
    }
  }

  getActiveIndex = () => {
    const query = queryString.parse(get(this.props, "location.search", ""))
    const t = get(query, "t", "")
    switch (t.toLowerCase()) {
      case "course":
        return COURSES_TAB
      case "study":
        return STUDIES_TAB
      default:
        return STUDIES_TAB
    }
  }

  activeIndexToPath = (activeIndex) => {
    const resourcePath = get(this.props, "topic.resourcePath", "")
    switch (activeIndex) {
      case COURSES_TAB:
        return resourcePath+"?t=course"
      case STUDIES_TAB:
        return resourcePath+"?t=study"
      default:
        return resourcePath+"?t=study"
    }
  }

  handleActiveIndexUpdate_ = (activeIndex) => {
    this.setState({activeIndex})
    const path = this.activeIndexToPath(activeIndex)
    this.props.history.push(path)
  }

  render() {
    const {activeIndex} = this.state
    const {className, counts} = this.props

    return (
      <TabBar
        className={className}
        activeIndex={activeIndex}
        indexInView={activeIndex}
        handleActiveIndexUpdate={this.handleActiveIndexUpdate_}
      >
        <Tab minWidth>
          <span className="mdc-tab__content">
            <span className="mdc-tab__text-label">
              Studies
              <Counter>{counts.study}</Counter>
            </span>
          </span>
        </Tab>
        <Tab minWidth>
          <span className="mdc-tab__content">
            <span className="mdc-tab__text-label">
              Courses
              <Counter>{counts.course}</Counter>
            </span>
          </span>
        </Tab>
      </TabBar>
    )
  }
}

TopicNav.propTypes = {
  className: PropTypes.string,
  counts: PropTypes.shape({
    course: PropTypes.number,
    study: PropTypes.number,
  }).isRequired,
}

TopicNav.defaultProps = {
  className: "",
  counts: {
    course: 0,
    study: 0,
  }
}

export default withRouter(TopicNav)
