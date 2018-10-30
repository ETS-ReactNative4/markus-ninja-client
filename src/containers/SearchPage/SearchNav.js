import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import queryString from 'query-string'
import { Link, withRouter } from 'react-router-dom'
import Drawer from 'components/mdc/Drawer'
import Icon from 'components/Icon'
import List from 'components/List'
import Counter from 'components/Counter'
import { get } from 'utils'

class SearchNav extends React.Component {
  getItemProps(isActive) {
    const className = cls("mdc-list-item", {
      "mdc-list-item--activated": isActive,
    })
    return {
      className,
      "aria-selected": isActive,
    }
  }

  get classes() {
    const {className} = this.props
    return cls("SearchNav", className)
  }

  render() {
    const {counts, location} = this.props
    const query = queryString.parse(get(this.props, "location.search", ""))
    const type = get(query, "t", "study").toLowerCase()
    const pathname = get(location, "pathname", "")

    query.t = "course"
    const searchCourses = queryString.stringify(query)
    query.t = "lesson"
    const searchLessons = queryString.stringify(query)
    query.t = "study"
    const searchStudies = queryString.stringify(query)
    query.t = "topic"
    const searchTopics = queryString.stringify(query)
    query.t = "user"
    const searchUsers = queryString.stringify(query)
    query.t = "user_asset"
    const searchUserAssets = queryString.stringify(query)

    return (
      <Drawer
        className={this.classes}
        modal
        open={this.props.open}
        onClose={this.props.onClose}
      >
        <Drawer.Header>
          <Drawer.Title>
            Search
          </Drawer.Title>
        </Drawer.Header>
        <Drawer.Content>
          <List as="nav">
            <div role="separator" className="mdc-list-divider"></div>
            <Link
              {...this.getItemProps(type === 'course')}
              to={{pathname, search: searchCourses}}
              onClick={this.props.onClose}
            >
              <Icon as="span" className="mdc-list-item__graphic" icon="course" />
              Courses
              <Counter>{counts.course}</Counter>
            </Link>
            <Link
              {...this.getItemProps(type === 'lesson')}
              to={{pathname, search: searchLessons}}
              onClick={this.props.onClose}
            >
              <Icon as="span" className="mdc-list-item__graphic" icon="lesson" />
              Lessons
              <Counter>{counts.lesson}</Counter>
            </Link>
            <Link
              {...this.getItemProps(type === 'study')}
              to={{pathname, search: searchStudies}}
              onClick={this.props.onClose}
            >
              <Icon as="span" className="mdc-list-item__graphic" icon="study" />
              Studies
              <Counter>{counts.study}</Counter>
            </Link>
            <Link
              {...this.getItemProps(type === 'topic')}
              to={{pathname, search: searchTopics}}
              onClick={this.props.onClose}
            >
              <Icon as="span" className="mdc-list-item__graphic" icon="topic" />
              Topics
              <Counter>{counts.topic}</Counter>
            </Link>
            <Link
              {...this.getItemProps(type === 'user')}
              to={{pathname, search: searchUsers}}
              onClick={this.props.onClose}
            >
              <Icon as="span" className="mdc-list-item__graphic" icon="user" />
              Users
              <Counter>{counts.user}</Counter>
            </Link>
            <Link
              {...this.getItemProps(type === 'user_asset')}
              to={{pathname, search: searchUserAssets}}
              onClick={this.props.onClose}
            >
              <Icon as="span" className="mdc-list-item__graphic" icon="asset" />
              Assets
              <Counter>{counts.userAsset}</Counter>
            </Link>
          </List>
        </Drawer.Content>
      </Drawer>
    )
  }
}

SearchNav.propTypes = {
  counts: PropTypes.shape({
    course: PropTypes.number,
    lesson: PropTypes.number,
    study: PropTypes.number,
    topic: PropTypes.number,
    user: PropTypes.number,
    userAsset: PropTypes.number,
  }).isRequired,
  onClose: PropTypes.func,
}

SearchNav.defaultProps = {
  counts: {
    course: 0,
    lesson: 0,
    study: 0,
    topic: 0,
    user: 0,
    userAsset: 0,
  },
  onClose: () => {},
}

export default withRouter(SearchNav)
