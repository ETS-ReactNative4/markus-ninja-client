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
import { get, isNil } from 'utils'
import AttachFile from './AttachFile'
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
      {
        strategy: dollarSignStrategy,
        component: DollarSignSpan,
      },
      {
        strategy: crossRefStrategy,
        component: HashtagSpan,
      },
    ])

    const initialValue = get(props, "initialValue", "")
    this.state = {
      editorState: EditorState.createWithContent(
        ContentState.createFromText(initialValue),
        compositeDecorator,
      ),
      loadingFileSelection: null,
    }
  }

  componentDidUpdate() {
    if (this.props.submit) {
      const editorState = EditorState.push(this.state.editorState, ContentState.createFromText(""))
      this.setState({ editorState })
    }
  }

  render() {
    const { editorState } = this.state
    const { placeholder } = this.props

    return (
      <div className="RichTextEditor">
        <Editor
          editorState={editorState}
          onChange={this.handleChange}
          placeholder={placeholder || "Enter text"}
          ref="editor"
        />
        <AttachFile
          onChange={this.handleChangeFile}
          onChangeComplete={this.handleChangeFileComplete}
          study={get(this.props, "study", null)}
        />
      </div>
    )
  }

  handleChangeFile = (file) => {
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
      loadingFileSelection: selection.merge({
        focusKey: es.getSelection().getFocusKey(),
        focusOffset: loadingText.length,
      }),
    })
  }

  handleChangeFileComplete = (asset, wasSaved, error) => {
    const { loadingFileSelection, editorState } = this.state

    if (!isNil(error)) {
      console.error(error.error_description)
      const contentState = editorState.getCurrentContent()
      const removeLoadingText = Modifier.replaceText(contentState, loadingFileSelection, "")
      this.handleChange(EditorState.push(editorState, removeLoadingText, 'insert-fragment'))
      this.setState({
        loadingFileSelection: null,
      })
      return
    }
    const contentState = editorState.getCurrentContent()
    const fileLink = Modifier.replaceText(contentState, loadingFileSelection,
      `![${wasSaved && "$$"}${asset.name}](${asset.href})`
    )
    this.handleChange(EditorState.push(editorState, fileLink, 'insert-fragment'))
    this.setState({
      loadingFileSelection: null,
    })
    return
  }

  handleChange = (editorState) => {
    this.setState({editorState})
    this.props.onChange(editorState.getCurrentContent().getPlainText())
  }

  focus = () => this.refs.editor.focus()
}

const AT_REGEX = /(?:(?:^|\s)@)(\w+)(?=\s|$)/g
const HASHTAG_REGEX = /(?:(?:^|\s)#)(\d+)(?=\s|$)/g
const DOLLAR_SIGN_REGEX = /(?:(?:^|\s|\[)\${2})([\w-.]+)(?:(?=\]|\s|$))/g
const CROSS_REF_REGEX = /(?:^|\s)(\w+)\/([\w-]+)#(\d+)(?=\s|$)/g

function atStrategy(contentBlock, callback, contentState) {
  findWithRegex(AT_REGEX, contentBlock, callback)
}

function hashtagStrategy(contentBlock, callback, contentState) {
  findWithRegex(HASHTAG_REGEX, contentBlock, callback)
}

function dollarSignStrategy(contentBlock, callback, contentState) {
  findWithRegex(DOLLAR_SIGN_REGEX, contentBlock, callback)
}

function crossRefStrategy(contentBlock, callback, contentState) {
  findWithRegex(CROSS_REF_REGEX, contentBlock, callback)
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

const DollarSignSpan = (props) => {
  return (
    <span
      className="RichTextEditor__dollar-sign"
      data-offset-key={props.offsetKey}
    >
      {props.children}
    </span>
  )
}

export default createFragmentContainer(RichTextEditor, graphql`
  fragment RichTextEditor_study on Study {
    ...AttachFile_study
  }
`)
