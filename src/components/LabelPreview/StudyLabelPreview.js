import * as React from 'react'
import cls from 'classnames'
import moment from 'moment'
import DeleteLabelMutation from 'mutations/DeleteLabelMutation'
import {get, isEmpty, isNil} from 'utils'
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
    return cls("StudyLabelPreview flex relative items-center content-start ph2 overflow-hidden", className)
  }

  render() {
    const label = get(this.props, "label", {})
    return (
      <div className={this.classes}>
        <span className="inline-flex items-center flex-stable content-center mr2">
          <Label className="self-start" label={label} />
        </span>
        <span className="self-start truncate">
          <span className="truncate mt0 db mdc-typography--subtitle1 mdc-theme--text-primary-on-light ml2">
            {isEmpty(label.description) ? "No description provided" : label.description}
          </span>
          <span className="truncate mt0 db mdc-typography--subtitle2 mdc-theme--text-secondary-on-light ml2">
            Created on
            <span className="mh1">{moment(label.createdAt).format("MMM D")}</span>
          </span>
        </span>
        <span className="ml-auto mr0">
          <button
            className="material-icons mdc-icon-button mb1"
            type="button"
            onClick={this.handleDelete}
            aria-label="Delete label"
            title="Delete label"
          >
            delete
          </button>
        </span>
      </div>
    )
  }
}

export default StudyLabelPreview
