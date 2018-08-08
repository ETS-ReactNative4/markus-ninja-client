import * as React from 'react'
import {
  CompositeDecorator,
  ContentState,
  Editor,
  EditorState,
  Modifier,
} from 'draft-js'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import cls from 'classnames'
import { get, isNil } from 'utils'
import { getAuthHeader } from 'auth'
import UserAssetNameInput from 'components/UserAssetNameInput'
import './RichTextEditor.css'

class RichTextEditor extends React.Component {
  constructor(props) {
    super(props)
    const compositeDecorator = new CompositeDecorator([
      {
        strategy: atStrategy,
        component: AtSpan,
      },
      {
        strategy: hashtagStrategy,
        component: HashtagSpan,
      },
    ])

    const initialValue = get(props, "initialValue", "")
    this.state = {
      editorState: EditorState.createWithContent(
        ContentState.createFromText(initialValue),
        compositeDecorator,
      ),
      loading: false,
      save: false,
      name: "",
      submittable: false,
      file: null,
    }
  }

  componentDidUpdate() {
    if (this.props.submit) {
      const editorState = EditorState.push(this.state.editorState, ContentState.createFromText(""))
      this.setState({ editorState })
    }
  }

  render() {
    const { editorState, file, save, submittable } = this.state
    const { placeholder } = this.props

    const filename = get(file, "name", "")

    return (
      <div className="RichTextEditor">
        <Editor
          editorState={editorState}
          onChange={this.handleChange}
          placeholder={placeholder || "Enter text"}
          ref="editor"
        />
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
      </div>
    )
  }

  handleChangeFile = (e) => {
    this.setState({ file: e.target.files[0]})
  }

  handleAttachFile = (e) => {
    const Authorization = getAuthHeader()
    if (isNil(Authorization)) { return }
    const formData = new FormData()
    const { file } = this.state

    formData.append("save", this.state.save)
    formData.append("study_id", get(this.props, "study.id", ""))
    formData.append("file", file)

    const { editorState } = this.state
    const selection = editorState.getSelection()
    const contentState = editorState.getCurrentContent()
    const loadingText = `![Uploading ${file.name}...]()`
    const loadingLink = Modifier.insertText(
      contentState,
      selection,
      loadingText,
    )
    const es = EditorState.push(editorState, loadingLink, 'insert-fragment')
    this.setState({
      editorState: es,
      loading: true,
    })
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
        return responseBody
      }
    }).then((data) => {
      if (!isNil(data.error)) {
        console.error(data.error_description)
        const updatedSelection = selection.merge({
          focusKey: es.getSelection().getFocusKey(),
          focusOffset: loadingText.length,
        })
        const contentState = es.getCurrentContent()
        const removeLoadingText = Modifier.replaceText(contentState, updatedSelection, "")
        this.handleChange(EditorState.push(es, removeLoadingText, 'insert-fragment'))
        this.setState({
          loading: false,
        })
        return
      }
      const updatedSelection = selection.merge({
        focusKey: es.getSelection().getFocusKey(),
        focusOffset: loadingText.length,
      })
      const contentState = es.getCurrentContent()
      const fileLink = Modifier.replaceText(contentState, updatedSelection,
        `![${get(data, "asset.name", "")}](${get(data, "asset.href", "")})`
      )
      this.handleChange(EditorState.push(es, fileLink, 'insert-fragment'))
      this.setState({
        loading: false,
      })
      return
    }).catch((error) => {
      console.error(error)
      const updatedSelection = selection.merge({
        focusKey: es.getSelection().getFocusKey(),
        focusOffset: loadingText.length,
      })
      const contentState = es.getCurrentContent()
      const removeLoadingText = Modifier.replaceText(contentState, updatedSelection, "")
      this.handleChange(EditorState.push(es, removeLoadingText, 'insert-fragment'))
      this.setState({
        loading: false,
      })
    })
  }

  handleChange = (editorState) => {
    this.setState({editorState})
    this.props.onChange(editorState.getCurrentContent().getPlainText())
  }

  handleChangeName = (name, submittable) => {
    this.setState({
      name,
      submittable,
    })
  }

  handleToggleSave = (e) => {
    this.setState({
      [e.target.name]: e.target.checked
    })
  }

  focus = () => this.refs.editor.focus()
}

const AT_REGEX = /@[\w]+[\s]*/g
const HASHTAG_REGEX = /#[\d]+[\s]*/g

function atStrategy(contentBlock, callback, contentState) {
  findWithRegex(AT_REGEX, contentBlock, callback)
}

function hashtagStrategy(contentBlock, callback, contentState) {
  findWithRegex(HASHTAG_REGEX, contentBlock, callback)
}

function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}

const AtSpan = (props) => {
  return (
    <span
      className="RichTextEditor__at"
      data-offset-key={props.offsetKey}
    >
      {props.children}
    </span>
  )
}

const HashtagSpan = (props) => {
  return (
    <span
      className="RichTextEditor__hashtag"
      data-offset-key={props.offsetKey}
    >
      {props.children}
    </span>
  )
}

export default createFragmentContainer(RichTextEditor, graphql`
  fragment RichTextEditor_study on Study {
    id
    ...UserAssetNameInput_study
  }
`)
