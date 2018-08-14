import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import AppleButton from 'components/AppleButton'
import EnrollmentSelect from 'components/EnrollmentSelect'
import StudyLink from 'components/StudyLink'
import UserLink from 'components/UserLink'
import Counter from 'components/Counter'
import { get, isNil } from 'utils'

import './Study.css'

class Study extends Component {
  state = {
    edit: false,
  }

  render() {
    const study = get(this.props, "study", null)
    if (isNil(study)) {
      return null
    }
    return (
      <div className="Study">
        <div className="study-name">
          <UserLink user={get(study, "owner", null)} />
          <span className="Study__name-divider">/</span>
          <StudyLink study={study} />
        </div>
        <ul className="study-actions">
          <li>
            <EnrollmentSelect enrollable={study} />
          </li>
          <li>
            <AppleButton appleable={study} />
            <span className="study-apple-count">
              {get(study, "appleGivers.totalCount", 0)}
            </span>
          </li>
        </ul>
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
          <Link
            className="Study__nav-item"
            to={study.resourcePath + "/courses"}
          >
            Courses
            <Counter>{get(study, "courses.totalCount", 0)}</Counter>
          </Link>
          <Link
            className="Study__nav-item"
            to={study.resourcePath + "/assets"}
          >
            Assets
            <Counter>{get(study, "assets.totalCount", 0)}</Counter>
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
    appleGivers(first: 0) {
      totalCount
    }
    assets(first: 0) {
      totalCount
    }
    createdAt
    courses(first: 0) {
      totalCount
    }
    lessonCount
    name
    owner {
      ...UserLink_user
    }
    resourcePath
    updatedAt
    url
    viewerCanAdmin
    ...StudyLink_study
    ...AppleButton_appleable
    ...EnrollmentSelect_enrollable
  }
`))
