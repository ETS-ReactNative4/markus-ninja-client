import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import { get } from 'utils'

class LabelPreview extends Component {
  render() {
    const label = get(this.props, "label", {})
    return (
      <div>
        <Link to={label.resourcePath}>
          {label.name}
        </Link>
        <span>{label.description}</span>
      </div>
    )
  }
}

export default createFragmentContainer(LabelPreview, graphql`
  fragment LabelPreview_label on Label {
    id
    description
    name
    resourcePath
  }
`)
