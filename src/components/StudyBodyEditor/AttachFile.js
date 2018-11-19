import * as React from 'react'
import PropTypes from 'prop-types'
import {
  EditorState,
  Modifier,
} from 'draft-js'
import cls from 'classnames'
import List from 'components/mdc/List'
import Icon from 'components/Icon'
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
  fileInputElement_ = React.createRef()
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

  handleClick = (e) => {
    const fileInput = this.fileInputElement_
    if (fileInput && fileInput.current) {
      fileInput.current.click()
    }
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

  render() {
    const {variant} = this.props

    switch (variant) {
      case "icon-button":
        return this.renderIconButton()
      case "list-item":
        return this.renderListItem()
      default:
        return null
    }
  }

  renderListItem() {
    const {className} = this.props

    return (
      <List.Item
        className={className}
        role="button"
        onClick={this.handleClick}
      >
        <input
          ref={this.fileInputElement_}
          className="dn"
          type="file"
          accept=".jpg,jpeg,.png,.gif"
          onChange={this.handleSubmit}
        />
        <List.Item.Graphic graphic={<Icon icon="attach_file" />} />
        <List.Item.Text primaryText="Attach file" />
      </List.Item>
    )
  }

  renderIconButton() {
    const {className} = this.props

    return (
      <button
        type="button"
        className={cls("material-icons mdc-icon-button", className)}
        title="Attach file"
        aria-label="Attach file"
        onClick={this.handleClick}
      >
        attach_file
        <input
          ref={this.fileInputElement_}
          className="dn"
          type="file"
          accept=".jpg,jpeg,.png,.gif"
          onChange={this.handleSubmit}
        />
      </button>
    )
  }
}

AttachFile.propTypes = {
  study: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  variant: PropTypes.oneOf(["icon-button", "list-item"]),
}

AttachFile.defaultProps = {
  study: {
    id: "",
  },
  variant: "icon-button",
}

AttachFile.contextType = Context

export default AttachFile
