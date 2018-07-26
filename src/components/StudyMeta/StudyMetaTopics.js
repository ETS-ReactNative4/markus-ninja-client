import React, {Component} from 'react'
import { Link, withRouter } from 'react-router-dom';
import UpdateTopicsMutation from 'mutations/UpdateTopicsMutation'
import { get, isNil } from 'utils'
import cls from 'classnames'

class StudyMetaTopics extends Component {
  constructor(props) {
    super(props)
    const topicNodes = get(props, "study.topics.nodes", [])
    this.state = {
      error: null,
      topics: topicNodes.map(node => node.name).join(" "),
      open: false,
    }
  }

  render() {
    const study = get(this.props, "study", {})
    const topicNodes = get(study, "topics.nodes", [])
    const { error, open, topics } = this.state
    return (
      <div className={cls("StudyMetaTopics", {open})}>
        <div className="StudyMetaTopics__list">
          {topicNodes.map(topic =>
            <Link key={topic.id} to={topic.resourcePath}>{topic.name}</Link>)}
        </div>
        <span className="StudyMetaTopics__edit-toggle">
          <button
            className="btn"
            type="button"
            onClick={this.handleToggleOpen}
          >
            Manage topics
          </button>
        </span>
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
        </div>
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
      topics,
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
}

export default withRouter(StudyMetaTopics)
