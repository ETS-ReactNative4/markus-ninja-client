import * as React from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withUID } from 'components/UniqueId'
import TextField, {Input} from '@material/react-text-field'
import UserAssetNameInput, {defaultUserAssetNameState} from 'components/UserAssetNameInput'
import Dialog from 'components/Dialog'
import ErrorText from 'components/ErrorText'
import CreateUserAssetMutation from 'mutations/CreateUserAssetMutation'
import {get, isNil, makeCancelable, replaceAll} from 'utils'

class AttachFile extends React.Component {
  state = {
    description: "",
    file: null,
    name: defaultUserAssetNameState,
    open: false,
    request: {
      cancel() {}
    },
    save: false,
  }

  componentWillUnmount() {
    this.state.request.cancel()
  }

  handleClose = () => {
    this.setState({
      description: "",
      file: null,
      name: defaultUserAssetNameState,
      open: false,
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

  handleToggleSaveForm = (e) => {
    const {open} = this.state
    this.setState({
      open: !open,
    })
  }

  handleSaveFile = (e) => {
    e.preventDefault()
    const {file, name} = this.state
    if (!name.available) {
      this.setState({
        error: "Choose a new name"
      })
      return
    }
    this.handleAttachFile(file, true)
  }

  handleAttachFile = (file, save) => {
    if (file) {
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
            this.state.name.value,
            this.state.description,
            (userAsset, errors) => {
              if (!isNil(errors)) {
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
        } else {
          this.setState({
            error: null,
            loading: false,
            file: null,
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
}
