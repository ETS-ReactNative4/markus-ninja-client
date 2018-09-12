import * as React from 'react'
import cls from 'classnames'
import moment from 'moment'
import DeleteLabelMutation from 'mutations/DeleteLabelMutation'
import {get, isNil} from 'utils'
import Label from 'components/Label'

class StudyLabelPreview extends React.Component {
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
    return cls("StudyLabelPreview flex items-center", className)
  }

  render() {
    const label = get(this.props, "label", {})
    return (
      <div className={this.classes}>
        <div className="inline-flex items-center flex-auto">
          <Label className="self-start" label={label} />
          <span className="mdc-typography--subtitle1 mdc-theme--text-secondary-on-light ml2">
            created on
            <span className="mh1">{moment(label.createdAt).format("MMM D")}</span>
          </span>
        </div>
        <button
          className="material-icons mdc-icon-button mb1"
          type="button"
          onClick={this.handleDelete}
          aria-label="Delete label"
          title="Delete label"
        >
          delete
        </button>
      </div>
    )
  }
}

export default StudyLabelPreview
