import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import Dialog from 'components/Dialog'
import UserAssetNameInput from 'components/UserAssetNameInput'
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
      error: null,
      file: null,
      name: "",
      request: {
        cancel() {}
      },
      submittable: false,
    }
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

  handleChangeName = (name, submittable) => {
    this.setState({
      name,
      submittable,
    })
  }

  handleChangeFile = (e) => {
    const file = e.target.files[0]

    this.setState({
      file: e.target.files[0],
      name: file.name,
    })
  }

  handleSubmit = (e) => {
    const {file} = this.state
    if (!isNil(file)) {
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
          this.state.name,
          (userAsset, errors) => {
            if (!isNil(errors)) {
              this.setState({ error: errors[0].message })
            }
            this.setState({
              loading: false,
              file: null,
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
    const {file, submittable} = this.state

    return (
      <Dialog
        innerRef={this.setRoot}
        className={this.classes}
        open={open}
        onClose={this.handleCancel}
        title={<Dialog.Title>Create asset</Dialog.Title>}
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
              disabled={!file || !submittable}
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
    const {file} = this.state
    const filename = replaceAll(get(file, "name", ""), " ", "_")

    return (
      <form>
        <label
          className="mdc-button w-100 mb2"
          htmlFor="file-input"
        >
          <i className="material-icons mdc-button__icon">attach_file</i>
          File
          <input
            id="file-input"
            className="dn"
            type="file"
            accept=".jpg,.jpeg,.png,.gif"
            onChange={this.handleChangeFile}
          />
        </label>
        <UserAssetNameInput
          initialValue={filename}
          label="No file chosen"
          onChange={this.handleChangeName}
          disabled={!file}
        />
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
