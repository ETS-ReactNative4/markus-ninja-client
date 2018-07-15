import * as React from 'react'
import {
  CompositeDecorator,
  ContentState,
  Editor,
  EditorState,
} from 'draft-js'
import { get } from 'utils'
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

    const initialValue = get(props, "initialValue")
    this.state = {
      editorState: EditorState.createWithContent(
        ContentState.createFromText(initialValue),
        compositeDecorator,
      )
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
      </div>
    )
  }

  handleChange = (editorState) => {
    this.setState({editorState})
    this.props.onChange(editorState.getCurrentContent().getPlainText())
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

export default RichTextEditor
