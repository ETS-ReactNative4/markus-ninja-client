import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import DeleteLabelMutation from 'mutations/DeleteLabelMutation'
import { get, isNil } from 'utils'

class LabelPreview extends Component {
  render() {
    const label = get(this.props, "label", {})
    return (
      <div>
        <Link to={label.resourcePath}>
          {label.name}
        </Link>
        <span>{label.description}</span>
        <button
          className="btn"
          type="button"
          onClick={this.handleDelete}
        >
          Delete
        </button>
      </div>
    )
  }

  handleDelete = () => {
    DeleteLabelMutation(
      this.props.label.id,
      (response, error) => {
        if (!isNil(error)) {
          this.setState({ error: error[0].message })
        }
      },
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
