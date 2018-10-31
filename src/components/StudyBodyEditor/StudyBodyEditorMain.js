import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {
  ContentState,
  Editor,
  EditorState,
} from 'draft-js'
import Dialog from 'components/Dialog'
import Tab from 'components/mdc/Tab'
import TabBar from 'components/mdc/TabBar'
import AttachFile from './AttachFile'
import Context from './Context'
import Preview from './Preview'

class StudyBodyEditorMain extends React.Component {
  constructor(props) {
    super(props)

    this.editorElement = React.createRef()

    this.state = {
      confirmCancelDialogOpen: false,
      loading: false,
      tab: "draft",
    }
  }

  componentDidMount() {
    const {editorState, onChange} = this.context
    const {initialValue} = this.props
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

  handleClickTab_ = (e) => {
    e.preventDefault()
    const tab = e.target.value
    this.setState({tab})
    if (tab === "preview") {
      this.props.onPreview()
    }
  }

  handleReset = () => {
    const {editorState, onChange} = this.context
    const {initialValue, onReset} = this.props
    onChange(EditorState.push(
      editorState,
      ContentState.createFromText(initialValue),
    ))
    onReset()
  }

  handleToggleCancelConfirmation = () => {
    if (this.text !== this.props.initialValue) {
      const {confirmCancelDialogOpen} = this.state
      this.setState({
        confirmCancelDialogOpen: !confirmCancelDialogOpen,
      })
    } else {
      this.props.onCancel()
    }
  }

  handleToggleResetConfirmation = () => {
    const {confirmResetDialogOpen} = this.state
    this.setState({
      confirmResetDialogOpen: !confirmResetDialogOpen,
    })
  }

  focus = () => {
    if (this.editorElement && this.editorElement.current) {
      this.editorElement.current.focus()
    }
  }

  get classes() {
    const {tab} = this.state
    const {className} = this.props
    return cls("StudyBodyEditorMain", className, {
      "StudyBodyEditorMain--preview": tab === "preview",
    })
  }

  get text() {
    return this.context.editorState.getCurrentContent().getPlainText()
  }

  render() {
    const {editorState, toggleSaveDialog} = this.context
    const {loading, tab} = this.state
    const {onPublish, placeholder, showFormButtonsFor, study} = this.props

    return (
      <div className={this.classes}>
        {this.renderNav()}
        <div className="StudyBodyEditorMain__preview">
          <Preview
            open={tab === "preview"}
            studyId={study.id}
            text={this.text}
            onPublish={onPublish}
          />
        </div>
        <div className="StudyBodyEditorMain__draft mdc-card mdc-card--outlined">
          <div className="StudyBodyEditorMain__draft-text" onClick={() => this.focus()}>
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
              >
                {this.props.submitText || "Submit"}
              </button>
              <button
                className="mdc-button mdc-card__action mdc-card__action--button"
                type="button"
                onClick={this.handleToggleCancelConfirmation}
              >
                Cancel
              </button>
            </div>}
            <div className="mdc-card__action-icons">
              <button
                className="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon"
                type="button"
                onClick={this.handleToggleCancelConfirmation}
                aria-label="Reset draft"
                title="Reset draft"
              >
                restore
              </button>
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
        {this.renderConfirmCancelDialog()}
      </div>
    )
  }

  renderConfirmCancelDialog() {
    const {confirmCancelDialogOpen} = this.state

    return (
      <Dialog
        open={confirmCancelDialogOpen}
        onClose={() => this.setState({confirmCancelDialogOpen: false})}
        title={<Dialog.Title>Cancel comment</Dialog.Title>}
        content={
          <Dialog.Content>
            <div className="flex flex-column mw5">
              <p>Are you sure?</p>
            </div>
          </Dialog.Content>
        }
        actions={
          <Dialog.Actions>
            <button
              type="button"
              className="mdc-button"
              data-mdc-dialog-action="no"
            >
              No
            </button>
            <button
              type="button"
              className="mdc-button"
              onClick={this.handleCancel}
              data-mdc-dialog-action="yes"
            >
              Yes
            </button>
          </Dialog.Actions>}
        />
    )
  }

  renderNav() {
    const {tab} = this.state

    return (
      <TabBar className="mb2" onClickTab={this.handleClickTab_}>
        <Tab
          active={tab === "draft"}
          minWidth
          value="draft"
        >
          <span className="mdc-tab__content">
            <span className="mdc-tab__text-label">
              Draft
            </span>
          </span>
        </Tab>
        <Tab
          active={tab === "preview"}
          minWidth
          value="preview"
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
  onPreview: PropTypes.func,
  onPublish: PropTypes.func,
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
  onPreview: () => {},
  onPublish: () => {},
  study: {
    id: "",
    viewerCanAdmin: false,
  }
}

StudyBodyEditorMain.contextType = Context

export default StudyBodyEditorMain
