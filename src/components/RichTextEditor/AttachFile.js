import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withUID } from 'components/UniqueId'
import UserAssetNameInput from 'components/UserAssetNameInput'
import CreateUserAssetMutation from 'mutations/CreateUserAssetMutation'
import { get, isNil, makeCancelable } from 'utils'
import { getAuthHeader } from 'auth'

class AttachFile extends React.Component {
  state = {
    request: {
      cancel() {}
    },
    file: null,
    name: "",
    save: false,
    submittable: false,
  }

  componentWillUnmount() {
    this.state.request.cancel()
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

  get classes() {
    const {className} = this.props
    return cls("AttachFile flex items-center", className)
  }

  render() {
    const { uid } = this.props
    const { file, save, submittable } = this.state
    const filename = get(this.state, "file.name", "")

    return (
      <div className={this.classes}>
        <label
          htmlFor={`file-save${uid}`}
          title="Save file to study assets"
          aria-label="Save file to study assets"
        >
          <input
            id={`file-save${uid}`}
            type="checkbox"
            name="save"
            checked={this.state.save}
            onChange={(e) => this.setState({ save: e.target.checked })}
          />
        </label>
        <label
          className="material-icons pointer"
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
            onChange={(e) => this.setState({file: e.target.files[0]})}
          />
        </label>
        <UserAssetNameInput
          className={cls("AttachFile__name-input", {open: save})}
          study={get(this.props, "study", null)}
          disabled={!save}
          placeholder="No file chosen"
          value={filename}
          onChange={this.handleChangeName}
        />
        <input
          id={`file-name${uid}`}
          className={cls("AttachFile__name", {open: !save})}
          placeholder="No file chosen"
          disabled
          value={filename}
        />
        <button
          className="mdc-button mdc-button--unelevated ml2"
          type="button"
          onClick={this.handleAttachFile}
          disabled={isNil(file) || (save && !submittable)}
        >
          {save ? "Attach & Save" : "Attach"}
        </button>
      </div>
    )
  }
}

export default withUID((getUID) => ({ uid: getUID() }))(createFragmentContainer(AttachFile, graphql`
  fragment AttachFile_study on Study {
    id
    ...UserAssetNameInput_study
  }
`))
