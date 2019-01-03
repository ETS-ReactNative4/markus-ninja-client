import * as React from 'react'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { Link } from 'react-router-dom'

class LinkStudyPreview extends React.Component {
  render() {
    const {
      className,
      innerRef,
      relay,
      study = {},
      withOwner = false,
      ...otherProps
    } = this.props

    return (
      <Link
        innerRef={innerRef}
        className={className}
        to={study.resourcePath}
        {...otherProps}
      >
        {withOwner ? study.nameWithOwner : study.name}
      </Link>
    )
  }
}

export default createFragmentContainer(LinkStudyPreview, graphql`
  fragment LinkStudyPreview_study on Study {
    id
    name
    nameWithOwner
    resourcePath
  }
`)
