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
      tab: "write",
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
    this.setState({tab: e.target.value})
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
        <div className="StudyBodyEditorMain__preview mdc-card mdc-card--outlined">
          <Preview
            open={tab === "preview"}
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
          active={tab === "write"}
          minWidth
          value="write"
        >
          <span className="mdc-tab__content">
            <span className="mdc-tab__text-label">
              Write
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
