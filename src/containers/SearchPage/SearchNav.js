import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import queryString from 'query-string'
import {withRouter} from 'react-router-dom'
import getHistory from 'react-router-global-history'
import List from 'components/mdc/List'
import Drawer from 'components/mdc/Drawer'
import Icon from 'components/Icon'
import Counter from 'components/Counter'
import { get } from 'utils'

const COURSE_INDEX = 0,
      LESSON_INDEX = 1,
      STUDY_INDEX = 2,
      TOPIC_INDEX = 3,
      USER_INDEX = 4,
      USER_ASSET_INDEX = 5

class SearchNav extends React.Component {
  state = {
    open: this.props.open,
    selectedIndex: STUDY_INDEX,
  }

  componentDidUpdate(prevProps) {
    const {open} = this.props
    if (prevProps.open !== open) {
      this.setState({open})
    }
  }

  handleSelect_ = (selectedIndex) => {
    const {location} = this.props
    const query = queryString.parse(get(this.props, "location.search", ""))
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

    let to = {pathname}
    switch (selectedIndex) {
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
    const {counts} = this.props

    return (
      <Drawer
        className={this.classes}
        modal
        open={open}
        onClose={this.props.onClose}
      >
        <Drawer.Header>
          <Drawer.Title tabIndex={-1}>
            Search
          </Drawer.Title>
        </Drawer.Header>
        <Drawer.Content>
          <List
            singleSelection
            selectedIndex={selectedIndex}
            handleSelect={this.handleSelect_}
          >
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
            <List.Item className="pointer">
              <List.Item.Graphic graphic={<Icon icon="asset" />} />
              <List.Item.Text primaryText={
                <span>
                  Assets
                  <Counter>{counts.userAsset}</Counter>
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
