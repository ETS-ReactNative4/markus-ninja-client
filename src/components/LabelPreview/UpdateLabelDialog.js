import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import tinycolor from 'tinycolor2'
import { GithubPicker } from 'react-color'
import {HelperText} from '@material/react-text-field'
import TextField, {defaultTextFieldState} from 'components/TextField'
import Dialog from 'components/Dialog'
import {Label} from 'components/Label'
import {withUID} from 'components/UniqueId'
import UpdateLabelMutation from 'mutations/UpdateLabelMutation'
import {get, isEmpty, isNil} from 'utils'

class UpdateLabelDialog extends React.Component {
  constructor(props) {
    super(props)

    const {label} = this.props

    this.state = {
      error: null,
      color: {
        ...defaultTextFieldState,
        value: label.color,
        valid: true,
      },
      description: {
        ...defaultTextFieldState,
        value: label.description,
        valid: true,
      },
    }
  }

  handleCancel = () => {
    const {label} = this.props
    this.setState({
      error: null,
      color: {
        ...defaultTextFieldState,
        value: label.color,
      },
      description: {
        ...defaultTextFieldState,
        value: label.description,
      },
    })
    this.props.onClose()
  }

  handleChange = (field) => {
    const valid = field.name === "color"
      ? tinycolor(field.value).isValid()
      : field.valid
    this.setState({
      [field.name]: {
        ...field,
        valid,
      },
    })
  }

  handleChangeComplete = (color, event) => {
    this.setState({
      color: {
        ...this.state.color,
        value: color.hex,
        valid: true,
      },
    });
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { color, description} = this.state
    UpdateLabelMutation(
      this.props.label.id,
      color.value,
      description.value,
      (response, error) => {
        if (!isNil(error)) {
          this.setState({ error: error[0].message })
        }
      },
    )
  }

  get classes() {
    const {className} = this.props
    return cls("UpdateLabelDialog", className)
  }

  get label() {
    const {color} = this.state
    const name = get(this.props, "label.name", "")
    return {color: color.value, name}
  }

  get isFormValid() {
    const {color, description} = this.state
    return !isEmpty(color.value) && color.valid &&
      description.valid
  }

  render() {
    const {open, uid} = this.props

    return (
      <Dialog
        innerRef={this.setRoot}
        className={this.classes}
        open={open}
        onClose={this.handleCancel}
        title={
          <Dialog.Title>
            <Label className="UpdateLabelDialog__preview" label={this.label} />
          </Dialog.Title>
        }
        content={<Dialog.Content>{this.renderForm()}</Dialog.Content>}
        actions={
          <Dialog.Actions>
            <button
              type="button"
              className="mdc-button"
              data-mdc-dialog-action="cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              form={`update-label-form${uid}`}
              className="mdc-button mdc-button--unelevated"
              data-mdc-dialog-action={this.isFormValid ? "update" : null}
            >
              Update
            </button>
          </Dialog.Actions>}
      />
    )
  }

  renderForm() {
    const {uid} = this.props
    const {color, description} = this.state

    return (
      <form className="UpdateLabelDialog__form" id={`update-label-form${uid}`} onSubmit={this.handleSubmit}>
        <div className="mb1">
          <TextField
            label="Description"
            floatingLabelClassName={!isEmpty(description.value) ? "mdc-floating-label--float-above" : ""}
            helperText={<HelperText>A brief description of the label.</HelperText>}
            inputProps={{
              name: "description",
              value: description.value,
              onChange: this.handleChange,
            }}
          />
        </div>
        <div>
          <div className="mb1">
            <GithubPicker triangle="hide" onChangeComplete={this.handleChangeComplete} />
          </div>
          <TextField
            label="Color"
            floatingLabelClassName={!isEmpty(color) ? "mdc-floating-label--float-above" : ""}
            helperText={
              <HelperText validation>
                Color may be formatted in hex, rgb(a), hsl(a), hsv(a), or named.
              </HelperText>
            }
            inputProps={{
              name: "color",
              value: color.value,
              required: true,
              pattern: color.valid ? null : "",
              onChange: this.handleChange,
            }}
          />
        </div>
      </form>
    )
  }
}

UpdateLabelDialog.propTypes = {
  label: PropTypes.shape({
    color: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func,
}

UpdateLabelDialog.defaultProps = {
  label: {
    color: "",
    description: "",
    name: "",
    id: "",
  },
  onClose: () => {},
}

export default withUID((getId) => ({uid: getId()}))(UpdateLabelDialog)
