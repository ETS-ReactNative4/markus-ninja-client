import * as React from 'react'
import cls from 'classnames'
import PropTypes from 'prop-types'
import {
  createPaginationContainer,
  graphql,
} from 'react-relay'
import { Link, withRouter } from 'react-router-dom';
import TextField, {HelperText, Input} from '@material/react-text-field'
import UpdateTopicsMutation from 'mutations/UpdateTopicsMutation'
import { get, isEmpty } from 'utils'
import { TOPICS_PER_PAGE } from 'consts'

class CourseMetaTopics extends React.Component {
  constructor(props) {
    super(props)

    const topicEdges = get(props, "course.topics.edges", [])
    const topics = topicEdges.map(edge => get(edge, "node.name")).join(" ")

    this.state = {
      error: null,
      invalidTopicNames: null,
      initialValues: {
        topics,
      },
      topics,
      open: false,
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      error: null,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { topics } = this.state
    UpdateTopicsMutation(
      this.props.course.id,
      topics.split(" "),
      (error, invalidTopicNames) => {
        if (!isEmpty(invalidTopicNames)) {
          this.setState({ error, invalidTopicNames })
        } else {
          this.handleToggleOpen()
          this.setState({
            error: null,
            initialValues: {topics},
            invalidTopicNames: null,
          })
        }
      },
    )
  }

  handleToggleOpen = () => {
    const open = !this.state.open

    this.setState({ open, error: null })
    this.props.onOpen(open)
  }

  handleCancel = () => {
    this.handleToggleOpen()
    this.reset_()
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

  reset_ = () => {
    this.setState({
      error: null,
      invalidTopicNames: null,
      ...this.state.initialValues,
    })
  }

  get classes() {
    const {className} = this.props
    return cls("CourseMetaTopics mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const course = get(this.props, "course", {})
    const {open} = this.state

    return (
      <div className={this.classes}>
        {open && course.viewerCanAdmin
        ? this.renderForm()
        : this.renderTopics()}
      </div>
    )
  }

  renderForm() {
    const course = get(this.props, "course", {})
    const topicEdges = get(course, "topics.edges", [])
    const {topics} = this.state

    return (
      <form className="CourseMeta__form inline-flex w-100" onSubmit={this.handleSubmit}>
        <div className="flex-auto">
          <TextField
            className="w-100"
            outlined
            label="Topics (separate with spaces)"
            helperText={this.renderHelperText()}
            floatingLabelClassName={!isEmpty(topicEdges) ? "mdc-floating-label--float-above" : ""}
          >
            <Input
              name="topics"
              value={topics}
              onChange={this.handleChange}
            />
          </TextField>
        </div>
        <div className="inline-flex items-center pa2 mb4">
          <button
            className="mdc-button mdc-button--unelevated"
            type="submit"
            onClick={this.handleSubmit}
          >
            Save
          </button>
          <span
            className="pointer pa2 underline-hover"
            role="button"
            onClick={this.handleCancel}
          >
            Cancel
          </span>
        </div>
      </form>
    )
  }

  renderHelperText() {
    return (
      <HelperText>
        Add topics to categorize your course and make it more discoverable.
      </HelperText>
    )
  }

  renderTopics() {
    const course = get(this.props, "course", {})
    const topicEdges = get(course, "topics.edges", [])
    const pageInfo = get(course, "topics.pageInfo", {})

    return (
      <div className="inline-flex items-center w-100">
        {topicEdges.map(({node}) => node
        ? <Link
            className="mdc-button mdc-button--outlined mr1 mb1"
            key={node.id}
            to={node.resourcePath}
          >
            {node.name}
          </Link>
        : null)}
        {pageInfo.hasNextPage &&
        <button
          className="material-icons mdc-icon-button mr1 mb1"
          onClick={this._loadMore}
        >
          more
        </button>}
        {course.viewerCanAdmin &&
        <button
          className="mdc-button mdc-button--unelevated mr1 mb1"
          type="button"
          onClick={this.handleToggleOpen}
        >
          Manage topics
        </button>}
      </div>
    )
  }
}

CourseMetaTopics.propTypes = {
  onOpen: PropTypes.func,
}

CourseMetaTopics.defaulProps = {
  onOpen: () => {}
}

export default withRouter(createPaginationContainer(CourseMetaTopics,
  {
    course: graphql`
      fragment CourseMetaTopics_course on Course @argumentDefinitions(
        after: {type: "String"},
        count: {type: "Int!"},
      ) {
        id
        topics(first: $count, after: $after)
        @connection(key: "CourseMetaTopics_topics", filters: []) {
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
        $after: String,
      ) {
        study(owner: $owner, name: $name) {
          course(number: $number) {
            ...CourseMetaTopics_course @arguments(
              after: $after,
              count: $count,
            )
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
        number: props.match.params.number,
        count: paginationInfo.count,
        after: paginationInfo.cursor,
      }
    }
  }
))
