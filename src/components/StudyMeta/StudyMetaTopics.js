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

class StudyMetaTopics extends React.Component {
  constructor(props) {
    super(props)

    const topicEdges = get(props, "study.topics.edges", [])
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
      this.props.study.id,
      topics.split(" "),
      (error, invalidTopicNames) => {
        if (!isEmpty(invalidTopicNames)) {
          this.setState({ error, invalidTopicNames })
        } else {
          this.handleToggleOpen()
        }
      },
    )
  }

  handleToggleOpen = () => {
    const open = !this.state.open

    this.setState({ open, error: null })
    this.props.onOpen(open)

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
    return cls("StudyMetaTopics mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const study = get(this.props, "study", {})
    const topicEdges = get(study, "topics.edges", [])
    const pageInfo = get(study, "topics.pageInfo", {})
    const {open, topics} = this.state
    return (
      <div className={this.classes}>
        {open
        ? study.viewerCanAdmin &&
          <form className="StudyMeta__form inline-flex w-100" onSubmit={this.handleSubmit}>
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
                onClick={this.handleToggleOpen}
              >
                Cancel
              </span>
            </div>
          </form>
        : <div className="inline-flex items-center w-100">
            {topicEdges.map(({ node = {} }) =>
            <Link
              className="mdc-button mdc-button--outlined mr1 mb1"
              key={node.id}
              to={node.resourcePath}
            >
              {node.name}
            </Link>)}
            {pageInfo.hasNextPage &&
            <button
              className="material-icons mdc-icon-button mr1 mb1"
              onClick={this._loadMore}
            >
              more
            </button>}
            {study.viewerCanAdmin &&
            <button
              className="mdc-button mdc-button--unelevated mr1 mb1"
              type="button"
              onClick={this.handleToggleOpen}
            >
              Manage topics
            </button>}
          </div>}
      </div>
    )
  }

  renderHelperText() {
    return (
      <HelperText>
        Add topics to categorize your study and make it more discoverable.
      </HelperText>
    )
  }
}

StudyMetaTopics.propTypes = {
  onOpen: PropTypes.func,
}

StudyMetaTopics.defaulProps = {
  onOpen: () => {}
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
