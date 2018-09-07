import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import cls from 'classnames'
import { Link } from 'react-router-dom'
import { get } from 'utils'

class StudyPreview extends Component {
  render() {
    const { className } = this.props
    const study = get(this.props, "study", {})
    return (
      <div className={cls("StudyPreview", className)}>
        <Link to={study.resourcePath}>
          {study.nameWithOwner}
        </Link>
        <span className="ml1">{study.lessonCount} lessons</span>
        <span className="ml1">{study.description}</span>
      </div>
    )
  }
}

export default createFragmentContainer(StudyPreview, graphql`
  fragment StudyPreview_study on Study {
    description
    lessonCount
    nameWithOwner
    resourcePath
  }
`)
