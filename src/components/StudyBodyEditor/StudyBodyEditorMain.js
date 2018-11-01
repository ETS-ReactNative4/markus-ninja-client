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
      confirmResetDialogOpen: false,
      initialValue: this.props.draft,
      loading: false,
      tab: "draft",
    }
  }

  componentDidMount() {
    const {editorState, onChange} = this.context
    const {draft} = this.props
    if (editorState) {
      onChange(EditorState.push(editorState, ContentState.createFromText(draft)))
    }
  }

  componentDidUpdate(prevProps) {
    const {editorState, onChange} = this.context
    const {draft} = this.props
    if (draft !== prevProps.draft && draft !== this.text) {
      onChange(EditorState.push(editorState, ContentState.createFromText(draft)))
    }
  }

  handleCancel = () => {
    this.props.onCancel()
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

  handlePublish = () => {
    this.setState({tab: "draft"})
    this.props.onPublish()
  }

  handleReset = () => {
    const {editorState} = this.context
    const {body} = this.props
    this.handleChange(EditorState.push(
      editorState,
      ContentState.createFromText(body),
    ))
  }

  handleToggleCancelConfirmation = () => {
    if (this.text !== this.props.draft) {
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
    const {placeholder, showFormButtonsFor, study} = this.props

    return (
      <div className={this.classes}>
        {this.renderNav()}
        <div className="StudyBodyEditorMain__preview">
          <Preview
            open={tab === "preview"}
            studyId={study.id}
            text={this.text}
            onPublish={this.handlePublish}
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
                {this.props.submitText || "Save draft"}
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
                onClick={this.handleToggleResetConfirmation}
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
        {this.renderConfirmResetDialog()}
      </div>
    )
  }

  renderConfirmCancelDialog() {
    const {confirmCancelDialogOpen} = this.state

    return (
      <Dialog
        open={confirmCancelDialogOpen}
        onClose={() => this.setState({confirmCancelDialogOpen: false})}
        title={<Dialog.Title>Cancel changes made to the draft</Dialog.Title>}
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

  renderConfirmResetDialog() {
    const {confirmResetDialogOpen} = this.state

    return (
      <Dialog
        open={confirmResetDialogOpen}
        onClose={() => this.setState({confirmResetDialogOpen: false})}
        title={<Dialog.Title>Reset draft to match body</Dialog.Title>}
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
              onClick={this.handleReset}
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
  draft: PropTypes.string,
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
  draft: "",
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