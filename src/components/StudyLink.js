import * as React from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import { get } from 'utils'

class StudyLink extends React.Component {
  render() {
    const study = get(this.props, "study", {})
    const { className, innerRef, withOwner = false, ...props } = this.props
    return (
      <Link innerRef={innerRef} className={className} to={study.resourcePath} {...props}>
        {withOwner ? study.nameWithOwner : study.name}
      </Link>
    )
  }
}

export default createFragmentContainer(StudyLink, graphql`
  fragment StudyLink_study on Study {
    id
    name
    nameWithOwner
    resourcePath
  }
`)