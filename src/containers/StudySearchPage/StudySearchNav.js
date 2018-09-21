import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import queryString from 'query-string'
import { Link, withRouter } from 'react-router-dom'
import Counter from 'components/Counter'
import Tab from 'components/Tab'
import TabBar from 'components/TabBar'
import { get } from 'utils'

class StudySearchNav extends React.Component {
  componentDidMount() {
    const query = queryString.parse(get(this.props, "location.search", ""))
    const t = query.t
    if (t && (t !== "lesson" && t !== "course" && t !== "user_asset")) {
      query.t = "lesson"
      const pathname = get(this.props, "location.pathname", "")
      const search = queryString.stringify(query)
      this.props.history.push({pathname, search})
    }
  }

  _tabLink = (query, type) => {
    const pathname = get(this.props, "location.pathname", "")
    query.t = type
    const search = queryString.stringify(query)
    return {pathname, search}
  }

  get classes() {
    const {className} = this.props
    return cls("StudySearchNav mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const {counts} = this.props
    const query = queryString.parse(get(this.props, "location.search", ""))
    const type = ((t) => {
      switch (t) {
        case "course":
          return t
        case "lesson":
          return t
        case "user_asset":
          return t
        default:
          return "lesson"
      }
    })(query.t)

    return (
      <TabBar className={this.classes}>
        <Tab
          minWidth
          active={type === "lesson"}
          as={Link}
          to={this._tabLink(query, "lesson")}
        >
          <span className="mdc-tab__content">
            <span className="mdc-tab__text-label">
              Lessons
              <Counter>{counts.lesson}</Counter>
            </span>
          </span>
        </Tab>
        <Tab
          minWidth
          active={type === "course"}
          as={Link}
          to={this._tabLink(query, "course")}
        >
          <span className="mdc-tab__content">
            <span className="mdc-tab__text-label">
              Courses
              <Counter>{counts.course}</Counter>
            </span>
          </span>
        </Tab>
        <Tab
          minWidth
          active={type === "user_asset"}
          as={Link}
          to={this._tabLink(query, "user_asset")}
        >
          <span className="mdc-tab__content">
            <span className="mdc-tab__text-label">
              Assets
              <Counter>{counts.userAsset}</Counter>
            </span>
          </span>
        </Tab>
      </TabBar>
    )
  }
}

StudySearchNav.propTypes = {
  counts: PropTypes.shape({
    course: PropTypes.number,
    lesson: PropTypes.number,
    userAsset: PropTypes.number,
  }).isRequired,
}

StudySearchNav.defaultProps = {
  counts: {
    course: 0,
    lesson: 0,
    userAsset: 0,
  }
}

export default withRouter(StudySearchNav)
