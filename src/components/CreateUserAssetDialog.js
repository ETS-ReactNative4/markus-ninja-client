import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import {HelperText} from '@material/react-text-field'
import Dialog from 'components/Dialog'
import ErrorText from 'components/ErrorText'
import TextField, {defaultTextFieldState} from 'components/TextField'
import UserAssetNameInput, {defaultUserAssetNameState} from 'components/UserAssetNameInput'
import CreateUserAssetMutation from 'mutations/CreateUserAssetMutation'
import StudyContext from 'containers/StudyPage/Context'
import {get, isNil, makeCancelable, replaceAll} from 'utils'

const defaultState = {
  description: defaultTextFieldState,
  error: null,
  file: null,
  name: defaultUserAssetNameState,
  request: {
    cancel() {}
  },
}

class CreateUserAssetDialog extends React.Component {
  state = defaultState

  componentWillUnmount() {
    this.state.request.cancel()
  }

  handleClose = (action) => {
    const {toggleCreateUserAssetDialog} = this.context
    this.setState(defaultState)
    toggleCreateUserAssetDialog()
    this.props.onClose()
  }

  handleChangeField = (field) => {
    this.setState({
      error: null,
      [field.name]: field,
    })
  }

  handleChangeFile = (e) => {
    const file = e.target.files[0]
    this.setState({
      file,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const {description, file, name} = this.state
    if (file) {
      if (!name.available) {
        this.setState({
          error: "Choose a new name"
        })
        return
      }

      const formData = new FormData()

      formData.append("save", true)
      formData.append("study_id", get(this.props, "study.id", ""))
      formData.append("file", file)

      const request = makeCancelable(fetch(process.env.REACT_APP_API_URL + "/upload/assets", {
        method: "POST",
        body: formData,
        credentials: "include",
      }))
      this.setState({request})

      request.promise.then((response) => {
        return response.text()
      }).then((responseBody) => {
        try {
          return JSON.parse(responseBody)
        } catch (error) {
          console.error(error)
          return responseBody
        }
      }).then((data) => {
        CreateUserAssetMutation(
          data.asset.id,
          this.props.study.id,
          name.value,
          description.value,
          (userAsset, errors) => {
            if (!isNil(errors)) {
              this.setState({ error: errors[0].message })
            }
            this.setState(defaultState)
          }
        )
        return
      }).catch((error) => {
        console.error(error)
        return
      })
    }
  }

  get classes() {
    const {className} = this.props
    return cls("CreateUserAssetDialog", className)
  }

  render() {
    const {open} = this.props
    const {error, file, name} = this.state

    return (
      <Dialog
        innerRef={this.setRoot}
        className={this.classes}
        open={open}
        onClose={this.handleClose}
        title={<Dialog.Title>Create asset</Dialog.Title>}
        content={
          <Dialog.Content>
            {this.renderForm()}
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
              className="mdc-button mdc-button--unelevated"
              form="create-user-asset-form"
              data-mdc-dialog-action={file && name.valid && name.available ? "create" : null}
            >
              Create
            </button>
          </Dialog.Actions>}
      />
    )
  }

  renderForm() {
    const {file} = this.state
    const filename = replaceAll(get(file, "name", ""), " ", "_")

    return (
      <form id="create-user-asset-form" onSubmit={this.handleSubmit}>
        <div className="rn-file-field">
          <input
            id="file-input"
            className="rn-file-field__input"
            type="file"
            accept=".jpg,.jpeg,.png,.gif"
            required
            onChange={this.handleChangeFile}
          />
          <label className="mdc-button mb1" htmlFor="file-input">
            <i className="material-icons mdc-button__icon">attach_file</i>
            File
          </label>
        </div>
        <UserAssetNameInput
          className="mb1"
          initialValue={filename}
          label={!file ? "No file chosen" : "Name"}
          onChange={this.handleChangeField}
          disabled={!file}
        />
        <div>
          <TextField
            label="Description (optional)"
            helperText={<HelperText>Give a brief description of the asset.</HelperText>}
            inputProps={{
              name: "description",
              onChange: this.handleChangeField,
            }}
          />
        </div>
      </form>
    )
  }
}

CreateUserAssetDialog.propTypes = {
  onClose: PropTypes.func,
}

CreateUserAssetDialog.defaultProps = {
  onClose: () => {},
}

CreateUserAssetDialog.contextType = StudyContext

export default createFragmentContainer(CreateUserAssetDialog, graphql`
  fragment CreateUserAssetDialog_study on Study {
    id
  }
`)
