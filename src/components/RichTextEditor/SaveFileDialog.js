import * as React from 'react'
import Dialog from 'components/Dialog'
import ErrorText from 'components/ErrorText'
import UserAssetNameInput, {defaultUserAssetNameState} from 'components/UserAssetNameInput'
import CreateUserAssetMutation from 'mutations/CreateUserAssetMutation'
import {get, makeCancelable, replaceAll} from 'utils'

class SaveFileDialog extends React.Component {
  handleSubmit = (file) => {
    if (file) {
      const formData = new FormData()

      formData.append("save", true)
      formData.append("study_id", get(this.props, "study.id", ""))
      formData.append("file", file)

      this.props.onChange(file)

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
          this.state.name.value,
          this.state.description,
          (userAsset, errors) => {
            if (errors) {
              this.setState({ error: errors[0].message })
              return
            }
            this.setState({
              error: null,
              description: "",
              file: null,
              loading: false,
              name: defaultUserAssetNameState,
            })
            this.props.onChangeComplete(userAsset, save, data.error)
          }
        )
        return
      }).catch((error) => {
        console.error(error)
        this.props.onChangeComplete(null, save, error)
        return
      })
    }
  }

  render() {
    const {description, error, file, name, open} = this.state
    const filename = replaceAll(get(file, "name", ""), " ", "_")

    return (
      <Dialog
        open={open}
        onClose={this.handleClose}
        title={<Dialog.Title>Attach & Save file</Dialog.Title>}
        content={
          <Dialog.Content>
            <form id="attach-and-save-file-form" className="flex flex-column mw5" onSubmit={this.handleSaveFile}>
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
                onChange={this.handleChangeName}
                disabled={!file}
              />
              <div>
                <TextField label="Description (optional)">
                  <Input
                    name="description"
                    value={description}
                    onChange={this.handleChange}
                  />
                </TextField>
              </div>
            </form>
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
}

export default SaveFileDialog
