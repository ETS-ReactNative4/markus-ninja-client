import * as React from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withUID } from 'components/UniqueId'
import UserAssetNameInput from 'components/UserAssetNameInput/index'
import Dialog from 'components/Dialog'
import CreateUserAssetMutation from 'mutations/CreateUserAssetMutation'
import { get, isNil, makeCancelable } from 'utils'

class AttachFile extends React.Component {
  state = {
    request: {
      cancel() {}
    },
    file: null,
    name: "",
    open: false,
    save: false,
    submittable: false,
  }

  componentWillUnmount() {
    this.state.request.cancel()
  }

  handleCancel = () => {
    this.setState({
      file: null,
      name: "",
      open: false,
      submittable: false,
    })
  }

  handleChangeName = (name, submittable) => {
    this.setState({
      name,
      submittable,
    })
  }

  handleChangeFile = (e) => {
    const file = e.target.files[0]
    this.setState({
      file,
      name: file.name
    })
  }

  handleToggleSaveForm = (e) => {
    const {open} = this.state
    this.setState({
      open: !open,
    })
  }

  handleSaveFile = () => {
    const {file} = this.state
    this.handleAttachFile(file, true)
  }

  handleAttachFile = (file, save) => {
    if (!isNil(file)) {
      const formData = new FormData()

      formData.append("save", save)
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
        if (save) {
          CreateUserAssetMutation(
            data.asset.id,
            this.props.study.id,
            this.state.name,
            (userAsset, errors) => {
              if (!isNil(errors)) {
                this.setState({ error: errors[0].message })
              }
              this.setState({
                loading: false,
                file: null,
                save: false,
              })
              this.props.onChangeComplete(userAsset, save, data.error)
            }
          )
        } else {
          this.setState({
            loading: false,
            file: null,
            save: false,
          })
          this.props.onChangeComplete(data.asset, save, data.error)
        }
        return
      }).catch((error) => {
        console.error(error)
        this.props.onChangeComplete(null, save, error)
        return
      })
    }
  }

  render() {
    const {study, uid} = this.props
    const viewerCanAdmin = get(study, "viewerCanAdmin", false)

    return (
      <React.Fragment>
        <label
          className="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon"
          htmlFor={`file-input${uid}`}
          title="Attach file"
          aria-label="Attach file"
        >
          attach_file
          <input
            id={`file-input${uid}`}
            className="dn"
            type="file"
            accept=".jpg,jpeg,.png,.gif"
            onChange={(e) => this.handleAttachFile(e.target.files[0], false)}
          />
        </label>
        {viewerCanAdmin &&
        <button
          className="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon"
          type="button"
          onClick={this.handleToggleSaveForm}
          aria-label="Attach & Save file"
          title="Attach & Save file"
        >
          save
        </button>}
        {viewerCanAdmin && this.renderSaveForm()}
      </React.Fragment>
    )
  }

  renderSaveForm() {
    const {file, open, submittable} = this.state

    return (
      <Dialog
        open={open}
        onClose={this.handleCancel}
        title={<Dialog.Title>Attach & Save file</Dialog.Title>}
        content={
          <Dialog.Content>
            <div className="flex flex-column mw5">
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
                initialValue={get(file, "name", "")}
                label="No file chosen"
                onChange={this.handleChangeName}
                disabled={isNil(file)}
              />
            </div>
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
              type="button"
              className="mdc-button mdc-button--unelevated"
              onClick={this.handleSaveFile}
              disabled={isNil(file) || !submittable}
              data-mdc-dialog-action="save"
            >
              Save
            </button>
          </Dialog.Actions>}
      />
    )
  }
}

export default withUID((getUID) => ({ uid: getUID() }))(createFragmentContainer(AttachFile, graphql`
  fragment AttachFile_study on Study {
    id
    viewerCanAdmin
  }
`))
