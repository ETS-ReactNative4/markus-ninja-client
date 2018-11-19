import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import tinycolor from 'tinycolor2'
import {HelperText} from '@material/react-text-field'
import TextField, {defaultTextFieldState} from 'components/TextField'
import { GithubPicker } from 'react-color'
import Dialog from 'components/Dialog'
import ErrorText from 'components/ErrorText'
import {Label} from 'components/Label'
import StudyContext from 'containers/StudyPage/Context'
import CreateLabelMutation from 'mutations/CreateLabelMutation'
import {isEmpty, replaceAll} from 'utils'

import './styles.css'

const defaultState = {
  error: null,
  color: defaultTextFieldState,
  description: defaultTextFieldState,
  name: defaultTextFieldState,
}

class CreateLabelDialog extends React.Component {
  state = defaultState

  handleClose = (action) => {
    const {toggleCreateLabelDialog} = this.context
    this.setState(defaultState)
    toggleCreateLabelDialog()
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

  handlePickColor = (color, event) => {
    this.setState({
      color: {
        ...this.state.color,
        valid: true,
        value: color.hex,
      },
    });
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { color, description, name } = this.state
    CreateLabelMutation(
      this.props.study.id,
      replaceAll(name.value, " ", "_"),
      description.value,
      color.value,
      (response, error) => {
        if (error) {
          this.setState({ error: error[0].message })
          return
        }
        this.props.onClose()
      },
    )
  }

  get classes() {
    const {className} = this.props
    return cls("CreateLabelDialog", className)
  }

  get isFormValid() {
    const {color, description, name} = this.state
    return !isEmpty(name.value) && name.valid &&
      !isEmpty(color.value) && color.valid &&
      description.valid
  }

  get label() {
    const {color, name} = this.state
    return {
      color: color.value,
      name: !isEmpty(name.value)
      ? replaceAll(name.value, " ", "_")
      : "Enter name",
    }
  }

  render() {
    const {open} = this.props
    const {error} = this.state

    return (
      <Dialog
        innerRef={this.setRoot}
        className={this.classes}
        open={open}
        onClose={this.handleClose}
        title={
          <Dialog.Title>
            <Label className="CreateLabelDialog__preview" label={this.label} />
          </Dialog.Title>
        }
        content={
          <Dialog.Content>
            {open && this.renderForm()}
            <ErrorText error={error} />
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
              type="submit"
              form="create-label-form"
              className="mdc-button mdc-button--unelevated"
              data-mdc-dialog-action={this.isFormValid ? "create" : null}
            >
              Create
            </button>
          </Dialog.Actions>}
      />
    )
  }

  renderForm() {
    const {color} = this.state
    return (
      <form className="CreateLabelDialog__form" id="create-label-form" onSubmit={this.handleSubmit}>
        <div className="mb1">
          <TextField
            label="Name"
            helperText={
              <HelperText persistent>
                Spaces become underscores.
              </HelperText>
            }
            inputProps={{
              name: "name",
              required: true,
              maxLength: 39,
              onChange: this.handleChange,
            }}
          />
        </div>
        <div className="mb1">
          <TextField
            label="Description (optional)"
            helperText={<HelperText>A brief description of the label.</HelperText>}
            inputProps={{
              name: "description",
              onChange: this.handleChange,
            }}
          />
        </div>
        <div>
          <div className="mb1">
            <GithubPicker triangle="hide" onChangeComplete={this.handlePickColor} />
          </div>
          <TextField
            label="Color"
            helperText={
              <HelperText persistent validation={!color.valid}>
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

CreateLabelDialog.propTypes = {
  onClose: PropTypes.func,
}

CreateLabelDialog.defaultProps = {
  onClose: () => {},
}

CreateLabelDialog.contextType = StudyContext

export default createFragmentContainer(CreateLabelDialog, graphql`
  fragment CreateLabelDialog_study on Study {
    id
  }
`)
