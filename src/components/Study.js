import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import UserLink from 'components/UserLink'

class Study extends Component {
  render() {
    return (
      <div className="Study">
        <div className="Study__name">
          <UserLink user={this.props.study.owner} />
          <span className="Study__name-divider">/</span>
          <a href={this.props.study.url}>{this.props.study.name}</a>
        </div>
        <div className="Study__description">{this.props.study.description}</div>
        <Link
          className="Study__lessons-tab"
          to={this.props.location.pathname + "/lessons"}
        >
          Lessons
        </Link>
      </div>
    )
  }
}

export default withRouter(createFragmentContainer(Study, graphql`
  fragment Study_study on Study {
    id
    advancedAt
    createdAt
    description
    ...LessonList_study
    name
    owner {
      ...UserLink_user
    }
    updatedAt
    url
    viewerCanUpdate
    viewerHasAppled
    viewerHasEnrolled
  }
`))
