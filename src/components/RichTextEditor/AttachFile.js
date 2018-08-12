import * as React from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import {
  Button,
  FileInput,
  SelectionControl,
  TextField,
} from 'react-md'
import cls from 'classnames'
import { withUID } from 'components/UniqueId'
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
    const { uid } = this.props
    const { file, save, submittable } = this.state
    const filename = get(this.state, "file.name", "")

    return (
      <div className="RichTextEditor__attach-file">
        <SelectionControl
          id={`attach-file-save${uid}`}
          type="switch"
          name="save"
          checked={this.state.save}
          onChange={save => this.setState({ save })}
          inline
          label="Save"
        />
        <FileInput
          id={`attach-file-input${uid}`}
          accept="image/*"
          name="images"
          onChange={file => this.setState({ file })}
          flat
        />
        {/*<label
          className="attach-file-label"
          htmlFor={`attach-file-input${uid}`}
        >
          File
          <input
            id={`attach-file-input${uid}`}
            className="attach-file-input"
            type="file"
            style={{display: "none"}}
            onChange={this.handleChangeFile}
          />
        </label>*/}
        <UserAssetNameInput
          className={cls("attach-file-name-input", {open: save})}
          study={get(this.props, "study", null)}
          disabled={!save}
          placeholder="No file chosen"
          value={filename}
          onChange={this.handleChangeName}
        />
        <TextField
          id={`attach-file-name${uid}`}
          placeholder="No file chosen"
          value={filename}
          className={cls("attach-file-name", {open: !save})}
          readOnly
          fullWidth={false}
        />
        <Button
          flat
          onClick={this.handleAttachFile}
          disabled={isNil(file) || (save && !submittable)}
          tooltipLabel={save ? "Saving the file will add it to the study's assets" : null }
          tooltipPosition={save ? "top" : null}
        >
          {save ? "Attach & Save" : "Attach"}
        </Button>
      </div>
    )
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
        if (save) {
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
        } else {
          this.props.onChangeComplete(data.asset, save, data.error)
          this.setState({
            loading: false,
            file: null,
            save: false,
          })
        }
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
}

export default withUID((getUID) => ({uid: getUID() }))(createFragmentContainer(AttachFile, graphql`
  fragment AttachFile_study on Study {
    id
    ...UserAssetNameInput_study
  }
`))
