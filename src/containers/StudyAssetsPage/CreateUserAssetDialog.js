import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import {HelperText} from '@material/react-text-field'
import TextField, {Input} from '@material/react-text-field'
import Dialog from 'components/Dialog'
import ErrorText from 'components/ErrorText'
import UserAssetNameInput, {defaultUserAssetNameState} from 'components/UserAssetNameInput'
import CreateUserAssetMutation from 'mutations/CreateUserAssetMutation'
import {get, isNil, makeCancelable, replaceAll} from 'utils'

class CreateUserAssetDialog extends React.Component {
  constructor(props) {
    super(props)

    this.root = null

    this.setRoot = (element) => {
      this.root = element
    }

    this.state = {
      description: "",
      error: null,
      file: null,
      loading: false,
      name: defaultUserAssetNameState,
      request: {
        cancel() {}
      },
    }
  }

  componentWillUnmount() {
    this.state.request.cancel()
  }

  handleClose = (action) => {
    this.setState({
      error: null,
      description: "",
      file: null,
      name: defaultUserAssetNameState,
    })
    this.props.onClose()
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleChangeName = (name) => {
    this.setState({
      error: null,
      name,
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
    const {file, name} = this.state
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
          this.state.description,
          (userAsset, errors) => {
            if (!isNil(errors)) {
              this.setState({ error: errors[0].message })
            }
            this.setState({
              error: null,
              description: "",
              file: null,
              loading: false,
              name: defaultUserAssetNameState,
            })
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
    const {description, file} = this.state
    const filename = replaceAll(get(file, "name", ""), " ", "_")

    return (
      <form id="create-user-asset-form" onSubmit={this.handleSubmit}>
        <div className="CreateUserAssetDialog__file">
          <input
            id="file-input"
            className="CreateUserAssetDialog__file-input"
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
          onChange={this.handleChangeName}
          disabled={!file}
        />
        <div>
          <TextField
            label="Description (optional)"
            helperText={<HelperText>Give a brief description of the asset.</HelperText>}
          >
            <Input
              name="description"
              value={description}
              onChange={this.handleChange}
            />
          </TextField>
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

export default createFragmentContainer(CreateUserAssetDialog, graphql`
  fragment CreateUserAssetDialog_study on Study {
    id
  }
`)
