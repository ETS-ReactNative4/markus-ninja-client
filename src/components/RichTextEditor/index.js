import * as React from 'react'
import cls from 'classnames'
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
    this.editorElement = React.createRef()

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
      loadingFile: false,
    }
  }

  componentDidUpdate() {
    if (this.props.submit) {
      const editorState = EditorState.push(this.state.editorState, ContentState.createFromText(""))
      this.setState({ editorState })
    }
  }

  get classes() {
    const {className} = this.props
    return cls("mdc-card mdc-card--outlined", className)
  }

  render() {
    const {editorState, loadingFile} = this.state
    const { placeholder } = this.props

    return (
      <div className={this.classes}>
        <div className="pa3 text" onClick={() => this.focus()}>
          <Editor
            editorState={editorState}
            readOnly={loadingFile}
            onChange={this.handleChange}
            placeholder={placeholder || "Enter text"}
            ref={this.editorElement}
          />
        </div>
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
    const currentContent = editorState.getCurrentContent()
    const loadingText = ` ![Uploading ${file.name}...]() `
    const loadingLink = Modifier.insertText(
      currentContent,
      selection,
      loadingText,
    )
    const es = EditorState.push(editorState, loadingLink, 'insert-fragment')
    this.setState({
      editorState: es,
      loadingFile: true,
    })
  }

  handleChangeFileComplete = (asset, wasSaved, error) => {
    const {editorState} = this.state

    if (!isNil(error)) {
      console.error(error)
      this.handleChange(EditorState.undo(editorState))
      return
    }
    const previousEditorState = EditorState.undo(editorState)
    const currentContent = previousEditorState.getCurrentContent()
    const selection = previousEditorState.getSelection()
    const fileLink = Modifier.insertText(currentContent, selection,
      wasSaved
      ? `$$${asset.name}`
      : ` ![${asset.name}](${asset.href})`
    )
    this.setState({loadingFile: false})
    this.handleChange(EditorState.push(editorState, fileLink, 'insert-fragment'))
    return
  }

  handleChange = (editorState) => {
    this.setState({editorState})
    this.props.onChange(editorState.getCurrentContent().getPlainText())
  }

  focus = () => {
    if (this.editorElement && this.editorElement.current) {
      this.editorElement.current.focus()
    }
  }
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

