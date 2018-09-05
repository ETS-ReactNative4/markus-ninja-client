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
import FloatingLabel from '@material/react-floating-label'
import LineRipple from '@material/react-line-ripple'
import { get, isNil } from 'utils'
import {MDCTextFieldFoundation} from '@material/textfield/dist/mdc.textfield'
import AttachFile from './AttachFile'
import './RichTextEditor.css'

class RichTextEditor extends React.Component {

  foundation_ = null

  constructor(props) {
    super(props)
    this.floatingLabelElement = React.createRef()
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
      loadingFileSelection: null,
      classList: new Set(),
      isFocused: false,
      disabled: false,

      // floating label state
      labelIsFloated: false,
      labelWidth: 0,

      // line ripple state
      activeLineRipple: false,
      lineRippleCenter: null,
    }
  }

  componentDidMount() {
    this.foundation_ = new MDCTextFieldFoundation(this.adapter)
    this.foundation_.init()
  }

  componentDidUpdate() {
    if (this.props.submit) {
      const editorState = EditorState.push(this.state.editorState, ContentState.createFromText(""))
      this.setState({ editorState })
    }
  }

  componentWillUnmount() {
    this.foundation_.destroy()
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
      `![${wasSaved ? "$$" : ""}${asset.name}](${asset.href})`
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

  focusEditor = () => {
    this.editorElement.current.focus()
    this.setState({isFocused: true})
  }

  get classes() {
    const {classList, disabled} = this.state
    const {className} = this.props
    return cls('mdc-text-field mdc-text-field--textarea', Array.from(classList), className, {
      'mdc-text-field--disabled': disabled,
    })
  }

  get otherProps() {
    const {
      children,
      className,
      floatingLabelClassName,
      label,
      lineRippleClassName,
      ...otherProps,
    } = this.props

    return otherProps
  }

  get adapter() {
    const rootAdapterMethods = {
      addClass: (className) =>
        this.setState({classList: this.state.classList.add(className)}),
      removeClass: (className) => {
        const {classList} = this.state
        classList.delete(className)
        this.setState({classList})
      },
      hasClass: (className) => this.classes.split(' ').includes(className),
      isFocused: () => this.state.isFocused,
      isRtl: () => this.props.isRtl,
    }
    return Object.assign({},
      rootAdapterMethods,
      this.inputAdapter,
      this.labelAdapter,
      this.lineRippleAdapter,
    )
  }

  get inputAdapter() {
    // For reference: This is the shape of what the vanilla component `getNativeInput` returns
    // {
    //  value: string,
    //  disabled: boolean, --> doesn't need to be implemented since the <INPUT> handles it
    //  also the `get disabled` isn't actually used, except in the vanilla component
    //  validity: {
    //    badInput: boolean,
    //    valid: boolean,
    //  },
    // }

    return {
      getNativeInput: () => {
        let badInput
        let valid
        if (this.editorElement && this.editorElement.current) {
          badInput = false
          valid = true
        }
        const editor = {
          validity: {badInput, valid},
        }

        // https://stackoverflow.com/a/44913378
        Object.defineProperty(editor, 'value', {
          get: () => this.state.value,
          // set value doesn't need to be done, since value is set via <Input>
          // needs setter here so it browser doesn't throw error
          set: () => {},
        })

        return editor
      },
    }
  }

  get labelAdapter() {
    return {
      shakeLabel: (shakeLabel) => {
        const {floatingLabelElement: floatingLabel} = this
        if (!shakeLabel) return
        if (floatingLabel && floatingLabel.current) {
          floatingLabel.current.shake()
        }
      },
      floatLabel: (labelIsFloated) => this.setState({labelIsFloated}),
      hasLabel: () => !!this.props.label,
      getLabelWidth: () => this.state.labelWidth,
    }
  }

  get lineRippleAdapter() {
    return {
      activateLineRipple: () => this.setState({activeLineRipple: true}),
      deactivateLineRipple: () => this.setState({activeLineRipple: false}),
      setLineRippleTransformOrigin: (lineRippleCenter) => this.setState({lineRippleCenter}),
    }
  }

  render() {
    const {editorState} = this.state
    const {label} = this.props

    return (
      <div
        {...this.otherProps}
        className={this.classes}
        onClick={() => this.foundation_ && this.foundation_.handleTextFieldInteraction()}
        onKeyDown={() => this.foundation_ && this.foundation_.handleTextFieldInteraction()}
        key="text-editor-container"
      >
        <div className="mdc-text-field__input" onClick={this.focusElement}>
          <Editor
            editorState={editorState}
            onChange={this.handleChange}
            ref={this.editorElement}
          />
          <AttachFile
            onChange={this.handleChangeFile}
            onChangeComplete={this.handleChangeFileComplete}
            study={get(this.props, "study", null)}
          />
        </div>
        {label ? this.renderLabel() : null}
      </div>
    )
  }

  renderLabel() {
    const {label, floatingLabelClassName} = this.props
    const {inputId} = this.state
    return (
      <FloatingLabel
        className={floatingLabelClassName}
        float={this.state.labelIsFloated}
        handleWidthChange={
          (labelWidth) => this.setState({labelWidth})}
        ref={this.floatingLabelElement}
        htmlFor={inputId}
      >
        {label}
      </FloatingLabel>
    )
  }

  renderLineRipple() {
    const {lineRippleClassName} = this.props
    const {activeLineRipple, lineRippleCenter} = this.state
    return (
      <LineRipple
        rippleCenter={lineRippleCenter}
        className={lineRippleClassName}
        active={activeLineRipple}
      />
    )
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
  const text = contentBlock.getText()
  let matchArr, start
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index
    callback(start, start + matchArr[0].length)
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
