import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import TextField, {Input} from '@material/react-text-field'
import { GithubPicker } from 'react-color'
import Dialog from 'components/Dialog'
import UpdateLabelMutation from 'mutations/UpdateLabelMutation'
import {isEmpty, isNil} from 'utils'

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
      color: label.color,
      description: label.description,
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
      color: label.color,
      description: label.description,
      focusColorInput: false,
    })
    this.props.onClose()
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleChangeComplete = (color, event) => {
    this.setState({
      color: color.hex,
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
            {this.renderForm()}
          </Dialog.Content>}
        actions={
          <Dialog.Actions>
            <button
              type="button"
              className="mdc-button"
              data-mdc-dialog-action="close"
            >
              Cancel
            </button>
            <button
              type="button"
              className="mdc-button mdc-button--unelevated"
              onClick={this.handleSubmit}
              data-mdc-dialog-action="create"
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
            value={description}
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
              value={color}
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
    id: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func,
}

UpdateLabelDialog.defaultProps = {
  label: {
    color: "",
    description: "",
    id: "",
  },
  onClose: () => {},
}

export default UpdateLabelDialog
