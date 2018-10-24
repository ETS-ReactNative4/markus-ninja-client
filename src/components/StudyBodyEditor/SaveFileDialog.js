import * as React from 'react'
import PropTypes from 'prop-types'
import {
  EditorState,
  Modifier,
} from 'draft-js'
import Dialog from 'components/Dialog'
import ErrorText from 'components/ErrorText'
import TextField, {defaultTextFieldState} from 'components/TextField'
import UserAssetNameInput, {defaultUserAssetNameState} from 'components/UserAssetNameInput'
import CreateUserAssetMutation from 'mutations/CreateUserAssetMutation'
import {get, makeCancelable, replaceAll} from 'utils'
import Context from './Context'

const defaultState = {
  error: null,
  file: null,
  description: defaultTextFieldState,
  loading: false,
  name: defaultUserAssetNameState,
  request: {
    cancel() {}
  },
}

class SaveFileDialog extends React.Component {
  state = defaultState

  componentDidMount() {
    console.log(this.context)
  }

  componentWillUnmount() {
    this.state.request.cancel()
  }

  handleClose = (action) => {
    const {toggleSaveDialog} = this.context
    this.setState(defaultState)
    toggleSaveDialog()
  }

  handleChangeField = (field) => {
    this.setState({
      [field.name]: field,
    })
  }

  handleSaveFileRequest = (file) => {
    const {editorState, onChange} = this.context
    const selection = editorState.getSelection()
    const currentContent = editorState.getCurrentContent()
    const loadingText = ` ![Uploading ${file.name}...]() `
    const loadingLink = Modifier.insertText(
      currentContent,
      selection,
      loadingText,
    )
    onChange(EditorState.push(editorState, loadingLink, 'insert-fragment'))
    this.setState({
      loading: true,
    })
  }

  handleSaveFileComplete = (asset, error) => {
    const {editorState, onChange} = this.context

    if (error) {
      console.error(error)
      onChange(EditorState.undo(editorState))
      return
    }
    const previousEditorState = EditorState.undo(editorState)
    const currentContent = previousEditorState.getCurrentContent()
    const selection = previousEditorState.getSelection()
    const fileLink = Modifier.insertText(
      currentContent,
      selection,
      `$$${asset.name}`,
    )
    this.setState({loading: false})
    onChange(EditorState.push(editorState, fileLink, 'insert-fragment'))
    return
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

      this.handleSaveFileRequest(file)

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
            if (errors) {
              this.setState({ error: errors[0].message })
              return
            }
            this.setState(defaultState)
            this.handleSaveFileComplete(userAsset, data.error)
          }
        )
        return
      }).catch((error) => {
        console.error(error)
        this.handleSaveFileComplete(null, error)
        return
      })
    }
  }

  render() {
    const {open} = this.props
    const {error, file, name} = this.state

    return (
      <Dialog
        open={open}
        onClose={this.handleClose}
        title={<Dialog.Title>Attach and Save file</Dialog.Title>}
        content={
          <Dialog.Content>
            {this.renderForm()}
            <ErrorText error={error} />
          </Dialog.Content>
        }
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
              type="submit"
              className="mdc-button mdc-button--unelevated"
              form="attach-and-save-file-form"
              data-mdc-dialog-action={file && name.valid && name.available ? "save" : null}
            >
              Save
            </button>
          </Dialog.Actions>}
      />
    )
  }

  renderForm() {
    const {file} = this.state
    const filename = replaceAll(get(file, "name", ""), " ", "_")

    return (
      <form id="attach-and-save-file-form" className="flex flex-column mw5" onSubmit={this.handleSubmit}>
        <p>
          The selected file will be saved to the study's assets.
          A reference will be attached in the text body,
          which will translate into an image link.
        </p>
        <label
          className="mdc-button mdc-button--outlined mb2"
          htmlFor="file-input"
        >
          File
          <input
            id="file-input"
            className="dn"
            type="file"
            accept=".jpg,jpeg,.png,.gif"
            onChange={this.handleChangeFile}
          />
        </label>
        <UserAssetNameInput
          initialValue={filename}
          label={!file ? "No file chosen" : "Name"}
          onChange={this.handleChangeField}
          disabled={!file}
        />
        <div>
          <TextField
            label="Description (optional)"
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

SaveFileDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  study: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
}

SaveFileDialog.defaultProps = {
  open: false,
  study: {
    id: "",
  }
}

SaveFileDialog.contextType = Context

export default SaveFileDialog
