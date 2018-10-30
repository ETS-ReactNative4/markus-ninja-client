import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import queryString from 'query-string'
import {withRouter} from 'react-router-dom'
import Counter from 'components/Counter'
import Tab from 'components/mdc/Tab'
import TabBar from 'components/mdc/TabBar'
import { get } from 'utils'

class TopicNav extends React.Component {
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

  handleClickTab_ = (e) => {
    this.props.history.push(e.target.value)
  }

  _tabLink = (query, type) => {
    const pathname = get(this.props, "location.pathname", "")
    query.t = type
    const search = queryString.stringify(query)
    return pathname + "?" + search
  }

  get classes() {
    const {className} = this.props
    return cls("TopicNav mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const {counts} = this.props
    const query = queryString.parse(get(this.props, "location.search", ""))
    const type = ((t) => {
      switch (t) {
        case "course":
          return t
        case "study":
          return t
        default:
          return "study"
      }
    })(query.t)

    return (
      <TabBar className={this.classes} onClickTab={this.handleClickTab_}>
        <Tab
          minWidth
          active={type === "study"}
          value={this._tabLink(query, "study")}
        >
          <span className="mdc-tab__content">
            <span className="mdc-tab__text-label">
              Studies
              <Counter>{counts.study}</Counter>
            </span>
          </span>
        </Tab>
        <Tab
          minWidth
          active={type === "course"}
          value={this._tabLink(query, "course")}
        >
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
  counts: PropTypes.shape({
    course: PropTypes.number,
    study: PropTypes.number,
  }).isRequired,
}

TopicNav.defaultProps = {
  counts: {
    course: 0,
    study: 0,
  }
}

export default withRouter(TopicNav)
