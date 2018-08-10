import * as React from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import cls from 'classnames'
import UserAssetNameInput from 'components/UserAssetNameInput'
import CreateUserAssetMutation from 'mutations/CreateUserAssetMutation'
import { get, isNil } from 'utils'
import { getAuthHeader } from 'auth'

class AttachFile extends React.Component {
  state = {
    file: null,
    name: "",
    save: false,
    submittable: false,
  }

  render() {
    const { save, submittable } = this.state
    const filename = get(this.state, "file.name", "")

    return (
      <div className="RichTextEditor__attach-file">
        <label
          className="attach-file-label"
          htmlFor="attach-file-input"
        >
          File
          <input
            id="attach-file-input"
            className="attach-file-input"
            type="file"
            style={{display: "none"}}
            onChange={this.handleChangeFile}
          />
        </label>
        <input
          id="attach-file-save"
          type="checkbox"
          name="save"
          checked={this.state.save}
          onChange={this.handleToggleSave}
        />
        <label
          className="attach-file-save"
          htmlFor="attach-file-save"
        >
          Save
        </label>
        <UserAssetNameInput
          className={cls("attach-file-name-input", {open: save})}
          study={get(this.props, "study", null)}
          disabled={!save}
          value={filename}
          onChange={this.handleChangeName}
        />
        <input
          className={cls("attach-file-name", {open: !save})}
          type="text"
          value={filename}
        />
        <button
          type="button"
          onClick={this.handleAttachFile}
          disabled={save && !submittable}
        >
          Attach
        </button>
      </div>
    )
  }

  handleChangeFile = (e) => {
    this.setState({ file: e.target.files[0]})
  }

  handleChangeName = (name, submittable) => {
    this.setState({
      name,
      submittable,
    })
  }

  handleAttachFile = (e) => {
    const { file, save } = this.state
    if (!isNil(file)) {
      const Authorization = getAuthHeader()
      if (isNil(Authorization)) { return }
      const formData = new FormData()

      formData.append("save", save)
      formData.append("study_id", get(this.props, "study.id", ""))
      formData.append("file", file)

      this.props.onChange(file)
      return fetch(process.env.REACT_APP_API_URL + "/upload/assets", {
        method: "POST",
        headers: {
          Authorization,
        },
        body: formData
      }).then((response) => {
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
            this.props.onChangeComplete(data.asset, save, data.error)
            this.setState({
              loading: false,
              file: null,
              save: false,
            })
          }
        )
        return
      }).catch((error) => {
        console.error(error)
        this.props.onChangeComplete(null, save, error)
        this.setState({
          loading: false,
          file: null,
          save: false,
        })
        return
      })
    }
  }

  handleToggleSave = (e) => {
    this.setState({
      [e.target.name]: e.target.checked
    })
  }
}

export default createFragmentContainer(AttachFile, graphql`
  fragment AttachFile_study on Study {
    id
    ...UserAssetNameInput_study
  }
`)
