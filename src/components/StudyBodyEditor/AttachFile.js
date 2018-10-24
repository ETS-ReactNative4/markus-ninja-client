import * as React from 'react'
import PropTypes from 'prop-types'
import {
  EditorState,
  Modifier,
} from 'draft-js'
import cls from 'classnames'
import { withUID } from 'components/UniqueId'
import {get, makeCancelable} from 'utils'
import Context from './Context'

const defaultState = {
  error: null,
  loading: false,
  request: {
    cancel() {}
  },
}

class AttachFile extends React.Component {
  state = defaultState

  componentWillUnmount() {
    this.state.request.cancel()
  }

  handleAttachFileRequest = (file) => {
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

  handleAttachFileComplete = (asset, error) => {
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
      ` ![${asset.name}](${asset.href})`,
    )
    this.setState({loading: false})
    onChange(EditorState.push(editorState, fileLink, 'insert-fragment'))
    return
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const file = e.target.files[0]

    if (file) {
      const formData = new FormData()

      formData.append("save", false)
      formData.append("study_id", get(this.props, "study.id", ""))
      formData.append("file", file)

      this.handleAttachFileRequest(file)

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
        this.setState(defaultState)
        this.handleAttachFileComplete(data.asset, data.error)
        return
      }).catch((error) => {
        console.error(error)
        this.handleAttachFileComplete(null, error)
        return
      })
    }
  }

  get classes() {
    const {className} = this.props
    return cls("material-icons mdc-icon-button", className)
  }

  render() {
    const {uid} = this.props

    return (
      <label
        className={this.classes}
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
          onChange={this.handleSubmit}
        />
      </label>
    )
  }
}

AttachFile.propTypes = {
  study: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
}

AttachFile.defaultProps = {
  study: {
    id: "",
  }
}

AttachFile.contextType = Context

export default withUID((getUID) => ({ uid: getUID() }))(AttachFile)
