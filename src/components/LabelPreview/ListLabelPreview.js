import * as React from 'react'
import cls from 'classnames'
import DeleteLabelMutation from 'mutations/DeleteLabelMutation'
import {get, isNil} from 'utils'
import Icon from 'components/Icon'
import LabelLink from 'components/LabelLink'

class ListLabelPreview extends React.Component {
  state = {
    error: null,
  }

  handleDelete = () => {
    DeleteLabelMutation(
      this.props.label.id,
      (response, errors) => {
        if (!isNil(errors)) {
          this.setState({ error: errors[0].message })
        }
      },
    )
  }

  get classes() {
    const {className} = this.props
    return cls("ListLabelPreview mdc-list-item", className)
  }

  render() {
    const label = get(this.props, "label", {})
    return (
      <li className={this.classes}>
        <Icon as="span" className="mdc-list-item__graphic" icon="label" />
        <span className="mdc-list-item__text">
          <LabelLink label={label} />
          <span className="ml2">
            {label.description}
          </span>
        </span>
        <span className="mdc-list-item__meta">
          {label.viewerCanDelete &&
          <button
            className="material-icons mdc-icon-button"
            type="button"
            onClick={this.handleDelete}
            aria-label="Delete label"
            title="Delete label"
          >
            delete
          </button>}
        </span>
      </li>
    )
  }
}

export default ListLabelPreview
