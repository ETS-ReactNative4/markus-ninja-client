import * as React from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import { get } from 'utils'

class Label extends React.Component {
  render() {
    const label = get(this.props, "label", {})
    return (
      <Link
        to={label.resourcePath}
        style={{backgroundColor: label.color}}
      >
        {label.name}
      </Link>
    )
  }
}

export default createFragmentContainer(Label, graphql`
  fragment Label_label on Label {
    color
    name
    resourcePath
  }
`)
