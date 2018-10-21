import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import TextField, {Input} from '@material/react-text-field'
import Dialog from 'components/Dialog'
import AddEmailMutation from 'mutations/AddEmailMutation'
import {isNil} from 'utils'

class AddEmailDialog extends React.Component {
  constructor(props) {
    super(props)

    this.root = null

    this.setRoot = (element) => {
      this.root = element
    }

    this.state = {
      error: null,
      email: "",
      validInput: false,
    }
  }

  handleClose = (action) => {
    if (action === 'cancel') {
      this.setState({
        error: null,
        email: "",
      })
    }
    this.props.onClose()
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      validInput: e.target.validity.valid,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { email } = this.state
    AddEmailMutation(
      email,
      (response, error) => {
        if (!isNil(error)) {
          this.setState({ error: error[0].message })
        }
      },
    )
  }

  get classes() {
    const {className} = this.props
    return cls("AddEmailDialog", className)
  }

  get isValid() {
    return this.state.validInput
  }

  render() {
    const {open} = this.props

    return (
      <Dialog
        innerRef={this.setRoot}
        className={this.classes}
        open={open}
        onClose={this.handleClose}
        title={<Dialog.Title>Add email</Dialog.Title>}
        content={
          <Dialog.Content>
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
              data-mdc-dialog-action="add"
            >
              Add
            </button>
          </Dialog.Actions>}
      />
    )
  }

  renderForm() {
    const {email} = this.state
    return (
      <form>
        <TextField label="Email">
          <Input
            type="email"
            name="email"
            value={email}
            onChange={this.handleChange}
          />
        </TextField>
      </form>
    )
  }
}

AddEmailDialog.propTypes = {
  onClose: PropTypes.func,
}

AddEmailDialog.defaultProps = {
  onClose: () => {},
}

export default AddEmailDialog
