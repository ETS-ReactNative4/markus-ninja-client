import React, {Component} from 'react'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import { Link, withRouter } from 'react-router-dom';
import UpdateTopicsMutation from 'mutations/UpdateTopicsMutation'
import { get, isNil } from 'utils'
import cls from 'classnames'
import { TOPICS_PER_PAGE } from 'consts'

class CourseMetaTopics extends Component {
  constructor(props) {
    super(props)
    const topicEdges = get(props, "course.topics.edges", [])
    this.state = {
      error: null,
      topics: topicEdges.map(edge => get(edge, "node.name")).join(" "),
      open: false,
    }
  }

  render() {
    const course = get(this.props, "course", {})
    const topicEdges = get(course, "topics.edges", [])
    const pageInfo = get(course, "topics.pageInfo", {})
    const { error, open, topics } = this.state
    return (
      <div className={cls("CourseMetaTopics", {open})}>
        <div className="CourseMetaTopics__list">
          {topicEdges.map(({ node = {} }) =>
            <Link key={node.id} to={node.resourcePath}>{node.name}</Link>)}
        </div>
        {pageInfo.hasNextPage &&
        <button
          className="CourseMetaTopics__more"
          onClick={this._loadMore}
        >
          More
        </button>}
        {course.viewerCanAdmin &&
        <span className="CourseMetaTopics__edit-toggle">
          <button
            className="btn"
            type="button"
            onClick={this.handleToggleOpen}
          >
            Manage topics
          </button>
        </span>}
        {course.viewerCanAdmin &&
        <div className="CourseMetaTopics__edit">
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="course-topics">
              Topics
              <span>(separate with spaces)</span>
            </label>
            <div>Add topics to categorize your course and make it more discoverable.</div>
            <input
              id="course-topics"
              className={cls("form-control", "edit-course-topics")}
              type="text"
              name="topics"
              value={topics}
              onChange={this.handleChange}
            />
            <button
              className="btn"
              type="submit"
              onClick={this.handleSubmit}
            >
              Save
            </button>
            <button
              className="btn-link"
              type="button"
              onClick={this.handleToggleOpen}
            >
              Cancel
            </button>
            <span>{error}</span>
          </form>
        </div>}
      </div>
    )
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { topics } = this.state
    UpdateTopicsMutation(
      this.props.course.id,
      topics.split(" "),
      (error) => {
        if (!isNil(error)) {
          this.setState({ error: error.message })
        }
        this.handleToggleOpen()
      },
    )
  }

  handleToggleOpen = () => {
    this.setState({ open: !this.state.open })
  }

  _loadMore = () => {
    const relay = get(this.props, "relay")
    if (!relay.hasMore()) {
      console.log("Nothing more to load")
      return
    } else if (relay.isLoading()){
      console.log("Request is already pending")
      return
    }

    relay.loadMore(TOPICS_PER_PAGE)
  }
}

export default withRouter(createPaginationContainer(CourseMetaTopics,
  {
    course: graphql`
      fragment CourseMetaTopics_course on Course {
        id
        topics(
          first: $count,
          after: $after,
        ) @connection(key: "CourseMetaTopics_topics", filters: []) {
          edges {
            node {
              id
              name
              resourcePath
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
        viewerCanAdmin
      }
    `,
  },
  {
    direction: 'forward',
    query: graphql`
      query CourseMetaTopicsForwardQuery(
        $owner: String!,
        $name: String!,
        $number: Int!,
        $count: Int!,
        $after: String
      ) {
        study(owner: $owner, name: $name) {
          course(number: $number) {
            ...CourseMetaTopics_course
          }
        }
      }
    `,
    getConnectionFromProps(props) {
      return get(props, "course.topics")
    },
    getFragmentVariables(previousVariables, totalCount) {
      return {
        ...previousVariables,
        count: totalCount,
      }
    },
    getVariables(props, paginationInfo, getFragmentVariables) {
      return {
        owner: props.match.params.owner,
        name: props.match.params.name,
        number: parseInt(props.match.params.number, 10),
        count: paginationInfo.count,
        after: paginationInfo.cursor,
      }
    }
  }
))
