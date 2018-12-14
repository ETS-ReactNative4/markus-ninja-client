import * as React from 'react'
import PropTypes from 'prop-types'
import Relay from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import hoistNonReactStatic from 'hoist-non-react-statics'
import {
  CompositeDecorator,
  ContentState,
  EditorState,
} from 'draft-js'
import Context from './Context'
import SaveFileDialog from './SaveFileDialog'
import StudyBodyEditorMain from './Main'
import './styles.css'

const FRAGMENT = graphql`
  fragment StudyBodyEditor_study on Study {
    id
    viewerCanAdmin
  }
`

class StudyBodyEditor extends React.Component {
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

    this.state = {
      clearText: this.handleClearText,
      editorState: EditorState.createWithContent(
        ContentState.createFromText(""),
        compositeDecorator,
      ),
      onChange: this.handleChange,
      tab: "draft",
      changeTab: this.handleChangeTab,
      readOnly: false,
      saveFileDialogOpen: false,
      toggleSaveDialog: this.handleToggleSaveDialog,
    }
  }

  handleChange = (editorState) => {
    this.setState({editorState})
  }

  handleChangeTab = (tab) => {
    this.setState({tab})
  }

  handleClearText = () => {
    const {editorState} = this.state
    this.setState({
      editorState: EditorState.push(
        editorState,
        ContentState.createFromText(""),
      ),
    })
  }

  handleToggleSaveDialog = () => {
    const {saveFileDialogOpen} = this.state
    this.setState({saveFileDialogOpen: !saveFileDialogOpen})
  }

  setText = (text) => {
    const {editorState} = this.state
    this.handleChange(EditorState.push(editorState, ContentState.createFromText(text)))
  }

  render() {
    const child = React.Children.only(this.props.children)
    const study = this.props.study
    const {saveFileDialogOpen} = this.state

    return (
      <Context.Provider value={this.state}>
        {child}
        {study.viewerCanAdmin &&
        <SaveFileDialog
          handleSaveFileRequest={() => this.setState({readOnly: true})}
          handleSaveFileComplete={() => this.setState({readOnly: false})}
          open={saveFileDialogOpen}
          study={study}
        />}
      </Context.Provider>
    )
  }
}

StudyBodyEditor.propTypes = {
  study: PropTypes.shape({
    id: PropTypes.string.isRequired,
    viewerCanAdmin: PropTypes.bool.isRequired,
  }).isRequired,
}

StudyBodyEditor.defaultProps = {
  study: {
    id: "",
    viewerCanAdmin: false,
  }
}

StudyBodyEditor.Context = Context
StudyBodyEditor.Main = Relay.createFragmentContainer(StudyBodyEditorMain, FRAGMENT)

const AT_REGEX = /(?:(?:^|\s)@)(\w+)(?=\s|$)/g
const HASHTAG_REGEX = /(?:(?:^|\s)#)(\d+)(?=\s|$)/g
const DOLLAR_SIGN_REGEX = /(?:(?:^|\s|\[)\${2})([\w-.]+)(?:\?{2}(.*)\?{2})?(?:(?=\]|\s|$))/g
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
      className="StudyBodyEditor__at"
      data-offset-key={props.offsetKey}
    >
      {props.children}
    </span>
  )
}

const HashtagSpan = (props) => {
  return (
    <span
      className="StudyBodyEditor__hashtag"
      data-offset-key={props.offsetKey}
    >
      {props.children}
    </span>
  )
}

const DollarSignSpan = (props) => {
  return (
    <span
      className="StudyBodyEditor__dollar-sign"
      data-offset-key={props.offsetKey}
    >
      {props.children}
    </span>
  )
}

export default hoistNonReactStatic(
  Relay.createFragmentContainer(StudyBodyEditor, FRAGMENT),
  StudyBodyEditor,
)
