import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import queryString from 'query-string'
import {Link, withRouter} from 'react-router-dom'
import getHistory from 'react-router-global-history'
import List from 'components/mdc/List'
import Drawer from 'components/mdc/Drawer'
import Icon from 'components/Icon'
import Counter from 'components/Counter'
import { get } from 'utils'

const USER_ASSET_INDEX = 0,
      ACTIVITY_INDEX = 1,
      COURSE_INDEX = 2,
      LESSON_INDEX = 3,
      STUDY_INDEX = 4,
      TOPIC_INDEX = 5,
      USER_INDEX = 6

class SearchNav extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      open: this.props.open,
      selectedIndex: this.getSelectedIndex(),
    }
  }

  componentDidUpdate(prevProps) {
    const {open} = this.props
    if (prevProps.open !== open) {
      this.setState({open})
    }
  }

  getSelectedIndex = () => {
    const query = queryString.parse(get(this.props, "location.search", ""))
    const t = get(query, "t", "")
    switch (t.toLowerCase()) {
      case "user_asset":
        return USER_ASSET_INDEX
      case "activity":
        return ACTIVITY_INDEX
      case "course":
        return COURSE_INDEX
      case "lesson":
        return LESSON_INDEX
      case "study":
        return STUDY_INDEX
      case "topic":
        return TOPIC_INDEX
      case "user":
        return USER_INDEX
      default:
        return STUDY_INDEX
    }
  }

  handleSelect_ = (selectedIndex) => {
    this.setState({selectedIndex})

    const {location} = this.props
    const query = queryString.parse(get(this.props, "location.search", ""))
    const pathname = get(location, "pathname", "")

    query.t = "activity"
    const searchActivities = queryString.stringify(query)
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

    let to = {pathname}
    switch (selectedIndex) {
      case ACTIVITY_INDEX:
        to.search = searchActivities
        break
      case COURSE_INDEX:
        to.search = searchCourses
        break
      case LESSON_INDEX:
        to.search = searchLessons
        break
      case STUDY_INDEX:
        to.search = searchStudies
        break
      case TOPIC_INDEX:
        to.search = searchTopics
        break
      case USER_INDEX:
        to.search = searchUsers
        break
      case USER_ASSET_INDEX:
        to.search = searchUserAssets
        break
      default:
        break
    }

    getHistory().push(to)
    this.props.onClose()
  }

  get classes() {
    const {className} = this.props
    return cls("SearchNav", className)
  }

  render() {
    const {open, selectedIndex} = this.state
    const {counts, onClose} = this.props

    return (
      <Drawer
        className={this.classes}
        modal
        open={open}
        onClose={onClose}
      >
        <Drawer.Header>
          <Drawer.Title>
            <Link className="rn-link" to="/search" onClick={onClose}>
              Search
            </Link>
          </Drawer.Title>
        </Drawer.Header>
        <Drawer.Content>
          <List
            singleSelection
            selectedIndex={selectedIndex}
            handleSelect={this.handleSelect_}
          >
            <List.Item className="pointer">
              <List.Item.Graphic graphic={<Icon icon="asset" />} />
              <List.Item.Text primaryText={
                <span>
                  Assets
                  <Counter>{counts.userAsset}</Counter>
                </span>
              }/>
            </List.Item>
            <List.Item className="pointer">
              <List.Item.Graphic graphic={<Icon icon="activity" />} />
              <List.Item.Text primaryText={
                <span>
                  Activities
                  <Counter>{counts.activity}</Counter>
                </span>
              }/>
            </List.Item>
            <List.Item className="pointer">
              <List.Item.Graphic graphic={<Icon icon="course" />} />
              <List.Item.Text primaryText={
                <span>
                  Courses
                  <Counter>{counts.course}</Counter>
                </span>
              }/>
            </List.Item>
            <List.Item className="pointer">
              <List.Item.Graphic graphic={<Icon icon="lesson" />} />
              <List.Item.Text primaryText={
                <span>
                  Lessons
                  <Counter>{counts.lesson}</Counter>
                </span>
              }/>
            </List.Item>
            <List.Item className="pointer">
              <List.Item.Graphic graphic={<Icon icon="study" />} />
              <List.Item.Text primaryText={
                <span>
                  Studies
                  <Counter>{counts.study}</Counter>
                </span>
              }/>
            </List.Item>
            <List.Item className="pointer">
              <List.Item.Graphic graphic={<Icon icon="topic" />} />
              <List.Item.Text primaryText={
                <span>
                  Topics
                  <Counter>{counts.topic}</Counter>
                </span>
              }/>
            </List.Item>
            <List.Item className="pointer">
              <List.Item.Graphic graphic={<Icon icon="user" />} />
              <List.Item.Text primaryText={
                <span>
                  Users
                  <Counter>{counts.user}</Counter>
                </span>
              }/>
            </List.Item>
          </List>
        </Drawer.Content>
      </Drawer>
    )
  }
}

SearchNav.propTypes = {
  counts: PropTypes.shape({
    activity: PropTypes.number,
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
    activity: 0,
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
