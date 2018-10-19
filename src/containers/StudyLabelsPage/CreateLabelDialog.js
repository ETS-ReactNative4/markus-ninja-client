import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import TextField, {Input} from '@material/react-text-field'
import { GithubPicker } from 'react-color'
import Dialog from 'components/Dialog'
import CreateLabelMutation from 'mutations/CreateLabelMutation'
import {isNil} from 'utils'

class CreateLabelDialog extends React.Component {
  constructor(props) {
    super(props)

    this.colorInput = React.createRef()
    this.root = null

    this.setRoot = (element) => {
      this.root = element
    }

    this.state = {
      error: null,
      color: "",
      description: "",
      name: "",
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
    this.setState({
      error: null,
      color: "",
      description: "",
      name: "",
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
    const { color, description, name } = this.state
    CreateLabelMutation(
      this.props.study.id,
      name,
      description,
      color,
      (response, error) => {
        if (!isNil(error)) {
          this.setState({ error: error[0].message })
        }
      },
    )
  }

  get classes() {
    const {className} = this.props
    return cls("CreateLabelDialog", className)
  }

  render() {
    const {open} = this.props

    return (
      <Dialog
        innerRef={this.setRoot}
        className={this.classes}
        open={open}
        onClose={this.handleCancel}
        title={<Dialog.Title>Create label</Dialog.Title>}
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
              Create
            </button>
          </Dialog.Actions>}
      />
    )
  }

  renderForm() {
    const {color, description, focusColorInput, name} = this.state
    return (
      <form>
        <div>
          <TextField label="Name">
            <Input
              name="name"
              value={name}
              onChange={this.handleChange}
            />
          </TextField>
        </div>
        <div>
          <TextField label="Description (optional)">
            <Input
              name="description"
              value={description}
              onChange={this.handleChange}
            />
          </TextField>
        </div>
        <div ref={this.colorInput} className={cls("rn-color-input", {"rn-color-input--focused": focusColorInput})}>
          <TextField label="Color">
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

CreateLabelDialog.propTypes = {
  onClose: PropTypes.func,
}

CreateLabelDialog.defaultProps = {
  onClose: () => {},
}

export default createFragmentContainer(CreateLabelDialog, graphql`
  fragment CreateLabelDialog_study on Study {
    id
  }
`)
