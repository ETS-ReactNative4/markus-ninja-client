import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { get, nullOr } from 'utils'
import UserLink from 'components/UserLink'
import Counter from 'components/Counter'

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
        <div className="Study__nav">
          <Link
            className="Study__nav-item"
            to={study.resourcePath}
          >
            Overview
          </Link>
          <Link
            className="Study__nav-item"
            to={study.resourcePath + "/lessons"}
          >
            Lessons
            <Counter>{study.lessonCount}</Counter>
          </Link>
          {study.viewerCanAdmin &&
          <Link
            className="Study__nav-item"
            to={study.resourcePath + "/settings"}
          >
            Settings
          </Link>}
        </div>
      </div>
    )
  }
}

export default withRouter(createFragmentContainer(Study, graphql`
  fragment Study_study on Study {
    id
    advancedAt
    createdAt
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
