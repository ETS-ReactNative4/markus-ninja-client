import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import TextField, {Input} from '@material/react-text-field'
import { GithubPicker } from 'react-color'
import Dialog from 'components/Dialog'
import {Label} from 'components/Label'
import UpdateLabelMutation from 'mutations/UpdateLabelMutation'
import {get, isEmpty, isNil} from 'utils'

class UpdateLabelDialog extends React.Component {
  constructor(props) {
    super(props)

    this.colorInput = React.createRef()
    this.root = null

    this.setRoot = (element) => {
      this.root = element
    }

    const {label} = this.props

    this.state = {
      error: null,
      color: {
        value: label.color,
        valid: true,
      },
      description: {
        value: label.description,
        valid: true,
      },
      focusColorInput: false,
    }
  }

  componentDidMount() {
    this.root.addEventListener('mousedown', this.handleClick, false);
  }

  componentWillUnmount() {
    this.root.removeEventListener('mousedown', this.handleClick, false);
  }

  handleCancel = () => {
    const {label} = this.props
    this.setState({
      error: null,
      color: {
        value: label.color,
        valid: true,
      },
      description: {
        value: label.description,
        valid: true,
      },
      focusColorInput: false,
    })
    this.props.onClose()
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: {
        value: e.target.value,
        valid: e.target.validity.valid,
      },
    })
  }

  handleChangeComplete = (color, event) => {
    this.setState({
      color: {
        value: color.hex,
        valid: true,
      },
      focusColorInput: false,
    });
  }

  handleClick = (e) => {
    if (!this.colorInput.current.contains(e.target)) {
      this.setState({ focusColorInput: false })
    }
  }

  handleBlurColorInput = (e) => {
    setTimeout(() => {
      if (!this.colorInput.current.contains(document.activeElement)) {
        this.setState({ focusColorInput: false })
      }
    }, 0);
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { color, description} = this.state
    UpdateLabelMutation(
      this.props.label.id,
      color,
      description,
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

  get isValid() {
    const {color, description} = this.state
    return color.valid && description.valid
  }

  render() {
    const {open} = this.props

    return (
      <Dialog
        innerRef={this.setRoot}
        className={this.classes}
        open={open}
        onClose={this.handleCancel}
        title={<Dialog.Title>Update label</Dialog.Title>}
        content={
          <Dialog.Content>
            <Label className="mb2" label={this.label} />
            {this.renderForm()}
          </Dialog.Content>}
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
              type="button"
              className="mdc-button mdc-button--unelevated"
              disabled={!this.isValid}
              onClick={this.handleSubmit}
              data-mdc-dialog-action="update"
            >
              Update
            </button>
          </Dialog.Actions>}
      />
    )
  }

  renderForm() {
    const {color, description, focusColorInput} = this.state
    return (
      <form>
        <TextField
          label="Description"
          floatingLabelClassName={!isEmpty(description) ? "mdc-floating-label--float-above" : ""}
        >
          <Input
            name="description"
            value={description.value}
            onChange={this.handleChange}
          />
        </TextField>
        <div ref={this.colorInput} className={cls("rn-color-input", {"rn-color-input--focused": focusColorInput})}>
          <TextField
            label="Color"
            floatingLabelClassName={!isEmpty(color) ? "mdc-floating-label--float-above" : ""}
          >
            <Input
              name="color"
              value={color.value}
              pattern="^#(?:[0-9a-fA-F]{3}){1,2}$"
              required
              onChange={this.handleChange}
              onFocus={() => this.setState({focusColorInput: true})}
              onBlur={this.handleBlurColorInput}
            />
          </TextField>
          <div className="rn-color-input__picker rn-color-input__picker--persistent">
            <GithubPicker onChangeComplete={this.handleChangeComplete} />
          </div>
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

export default UpdateLabelDialog
