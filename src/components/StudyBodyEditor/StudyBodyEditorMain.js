import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {
  ContentState,
  Editor,
  EditorState,
} from 'draft-js'
import Tab from 'components/Tab'
import TabBar from 'components/TabBar'
import {get} from 'utils'
import AttachFile from './AttachFile'
import Context from './Context'
import Preview from './Preview'

class StudyBodyEditorMain extends React.Component {
  constructor(props) {
    super(props)

    this.editorElement = React.createRef()

    this.state = {
      loading: false,
      preview: false,
    }
  }

  componentDidMount() {
    const {editorState, onChange} = this.context
    const initialValue = get(this.props, "initialValue", "")
    if (editorState) {
      onChange(EditorState.push(editorState, ContentState.createFromText(initialValue)))
    }
  }

  handleCancel = () => {
    const {editorState, onChange} = this.context
    const {initialValue, onCancel} = this.props
    onChange(EditorState.push(
      editorState,
      ContentState.createFromText(initialValue),
    ))
    onCancel()
  }

  handleChange = (editorState) => {
    this.context.onChange(editorState)
    this.props.onChange(editorState.getCurrentContent().getPlainText())
  }

  handleSubmit = (e) => {
    const {editorState, onChange} = this.context
    onChange(EditorState.push(
      editorState,
      ContentState.createFromText(""),
    ))
  }

  focus = () => {
    if (this.editorElement && this.editorElement.current) {
      this.editorElement.current.focus()
    }
  }

  get classes() {
    const {preview} = this.state
    const {className} = this.props
    return cls("StudyBodyEditorMain", className, {
      "StudyBodyEditorMain--preview": preview,
    })
  }

  get text() {
    const {editorState} = this.context
    const currentContent = editorState && editorState.getCurrentContent()
    return currentContent && currentContent.getPlainText()
  }

  render() {
    const {editorState, toggleSaveDialog} = this.context
    const {loading, preview} = this.state
    const {placeholder, showFormButtonsFor, study} = this.props

    if (!editorState) {
      return null
    }

    return (
      <div className={this.classes}>
        {this.renderNav()}
        <div className="StudyBodyEditorMain__preview mdc-card mdc-card--outlined">
          <Preview
            open={preview}
            studyId={study.id}
            text={this.text}
          />
        </div>
        <div className="StudyBodyEditorMain__write mdc-card mdc-card--outlined">
          <div className="StudyBodyEditorMain__write-text" onClick={() => this.focus()}>
            <input
              className="StudyBodyEditorMain__hidden-input"
              type="text"
              value={this.text}
              required
              onChange={() => {}}
              onInvalid={this.focus}
              onFocus={this.focus}
            />
            <Editor
              editorState={editorState}
              readOnly={loading}
              onChange={this.handleChange}
              placeholder={placeholder || "Enter text"}
              ref={this.editorElement}
            />
          </div>
          <div className="mdc-card__actions">
            {showFormButtonsFor &&
            <div className="mdc-card__action-buttons">
              <button
                type="submit"
                form={showFormButtonsFor}
                className="mdc-button mdc-button--unelevated mdc-card__action mdc-card__action--button"
                onClick={this.handleSubmit}
              >
                {this.props.submitText || "Submit"}
              </button>
              <button
                className="mdc-button mdc-card__action mdc-card__action--button"
                type="button"
                onClick={this.handleCancel}
              >
                Cancel
              </button>
            </div>}
            <div className="mdc-card__action-icons">
              <AttachFile study={this.props.study} />
              {study.viewerCanAdmin &&
              <button
                className="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon"
                type="button"
                onClick={toggleSaveDialog}
                aria-label="Save file"
                title="Save file"
              >
                save
              </button>}
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderNav() {
    const {preview} = this.state

    return (
      <TabBar className="mb2">
        <Tab
          active={!preview}
          minWidth
          as="button"
          type="button"
          onClick={() => this.setState({preview: false})}
        >
          <span className="mdc-tab__content">
            <span className="mdc-tab__text-label">
              Write
            </span>
          </span>
        </Tab>
        <Tab
          active={preview}
          minWidth
          as="button"
          type="button"
          onClick={() => this.setState({preview: true})}
        >
          <span className="mdc-tab__content">
            <span className="mdc-tab__text-label">
              Preview
            </span>
          </span>
        </Tab>
      </TabBar>
    )
  }
}

StudyBodyEditorMain.propTypes = {
  initialValue: PropTypes.string,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
  showFormButtonsFor: PropTypes.string,
  study: PropTypes.shape({
    id: PropTypes.string.isRequired,
    viewerCanAdmin: PropTypes.bool.isRequired,
  }).isRequired,
}

StudyBodyEditorMain.defaultProps = {
  initialValue: "",
  onCancel: () => {},
  onChange: () => {},
  study: {
    id: "",
    viewerCanAdmin: false,
  }
}

StudyBodyEditorMain.contextType = Context

export default StudyBodyEditorMain
