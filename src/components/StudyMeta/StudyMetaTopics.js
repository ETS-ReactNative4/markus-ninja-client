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

class StudyMetaTopics extends Component {
  constructor(props) {
    super(props)
    const topicEdges = get(props, "study.topics.edges", [])
    this.state = {
      error: null,
      topics: topicEdges.map(edge => get(edge, "node.name")).join(" "),
      open: false,
    }
  }

  render() {
    const study = get(this.props, "study", {})
    const topicEdges = get(study, "topics.edges", [])
    const pageInfo = get(study, "topics.pageInfo", {})
    const { error, open, topics } = this.state
    return (
      <div className={cls("StudyMetaTopics", {open})}>
        <div className="StudyMetaTopics__list">
          {topicEdges.map(({ node = {} }) =>
            <Link key={node.id} to={node.resourcePath}>{node.name}</Link>)}
        </div>
        {pageInfo.hasNextPage &&
        <button
          className="StudyMetaTopics__more"
          onClick={this._loadMore}
        >
          More
        </button>}
        {study.viewerCanAdmin &&
        <span className="StudyMetaTopics__edit-toggle">
          <button
            className="btn"
            type="button"
            onClick={this.handleToggleOpen}
          >
            Manage topics
          </button>
        </span>}
        {study.viewerCanAdmin &&
        <div className="StudyMetaTopics__edit">
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="study-topics">
              Topics
              <span>(separate with spaces)</span>
            </label>
            <div>Add topics to categorize your study and make it more discoverable.</div>
            <input
              id="study-topics"
              className={cls("form-control", "edit-study-topics")}
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
      this.props.study.id,
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

export default withRouter(createPaginationContainer(StudyMetaTopics,
  {
    study: graphql`
      fragment StudyMetaTopics_study on Study {
        id
        topics(
          first: $count,
          after: $after,
        ) @connection(key: "StudyMetaTopics_topics", filters: []) {
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
      query StudyMetaTopicsForwardQuery(
        $owner: String!,
        $name: String!,
        $count: Int!,
        $after: String
      ) {
        study(owner: $owner, name: $name) {
          ...StudyMetaTopics_study
        }
      }
    `,
    getConnectionFromProps(props) {
      return get(props, "study.topics")
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
        count: paginationInfo.count,
        after: paginationInfo.cursor,
      }
    }
  }
))
