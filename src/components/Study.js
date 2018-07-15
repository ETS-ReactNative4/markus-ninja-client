import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { get, nullOr } from 'utils'
import UserLink from 'components/UserLink'
import UpdateStudyForm from 'components/UpdateStudyForm'

class Study extends Component {
  state = {
    edit: false,
  }

  render() {
    const study = get(this.props, "study", {})
    return (
      <div className="Study">
        <div className="Study__name">
          <UserLink user={nullOr(study.owner)} />
          <span className="Study__name-divider">/</span>
          <a href={study.url}>{study.name}</a>
        </div>
        <UpdateStudyForm study={nullOr(study)}/>
        <Link
          className="Study__lessons-tab"
          to={study.resourcePath + "/lessons"}
        >
          Lessons
        </Link>
        {study.viewerCanAdmin &&
        <Link
          className="Study__lessons-tab"
          to={study.resourcePath + "/settings"}
        >
          Settings
        </Link>}
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
    lessonCount
    name
    owner {
      ...UserLink_user
    }
    resourcePath
    updatedAt
    url
    viewerCanAdmin
    viewerHasAppled
    viewerHasEnrolled
  }
`))
