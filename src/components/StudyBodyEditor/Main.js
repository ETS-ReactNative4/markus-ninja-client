import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {
  ContentState,
  Editor,
  EditorState,
} from 'draft-js'
import Sticky from 'react-stickynode'
import HTML from 'components/HTML'
import List from 'components/mdc/List'
import Dialog from 'components/Dialog'
import Icon from 'components/Icon'
import Menu, {Corner} from 'components/mdc/Menu'
import { withUID } from 'components/UniqueId'
import {mediaQueryPhone} from 'styles/helpers'
import {filterDefinedReactChildren, timeDifferenceForDate} from 'utils'
import AttachFile from './AttachFile'
import Context from './Context'
import Preview from './Preview'

class StudyBodyEditorMain extends React.Component {
  constructor(props) {
    super(props)

    this.editorElement = React.createRef()

    this.state = {
      anchorElement: null,
      confirmCancelDialogOpen: false,
      confirmResetDialogOpen: false,
      draftBackupId: 0,
      loading: false,
      menuOpen: false,
    }
  }

  setAnchorElement = (el) => {
    if (this.state.anchorElement) {
      return
    }
    this.setState({anchorElement: el})
  }

  componentDidMount() {
    const {editorState, onChange} = this.context
    const {draft} = this.props.object
    if (editorState && draft) {
      onChange(EditorState.push(editorState, ContentState.createFromText(draft)))
    }
  }

  componentDidUpdate(prevProps) {
    const {changeTab} = this.context
    const {edit} = this.props
    if (!edit && prevProps.edit) {
      changeTab("draft")
      this.setState({anchorElement: null})
    }
  }

  handleChange = (editorState) => {
    this.context.onChange(editorState)
    this.props.handleChange(editorState.getCurrentContent().getPlainText())
  }

  handleChangeTab_ = (tab) => {
    const {changeTab} = this.context
    changeTab(tab)
    if (tab === "preview") {
      this.props.handlePreview()
    }
  }

  handleToggleCancelConfirmation = () => {
    const {handleCancel} = this.props
    if (this.text !== this.props.object.draft) {
      const {confirmCancelDialogOpen} = this.state
      this.setState({
        confirmCancelDialogOpen: !confirmCancelDialogOpen,
      })
    } else {
      handleCancel()
    }
  }

  handleToggleResetConfirmation = () => {
    const {confirmResetDialogOpen} = this.state
    this.setState({
      confirmResetDialogOpen: !confirmResetDialogOpen,
    })
  }

  focusEditor = () => {
    if (this.editorElement && this.editorElement.current) {
      this.editorElement.current.focus()
    }
  }

  get classes() {
    const {tab} = this.context
    const {className} = this.props
    return cls("StudyBodyEditorMain", className, {
      "StudyBodyEditorMain--preview": tab === "preview",
    })
  }

  get text() {
    return this.context.editorState.getCurrentContent().getPlainText()
  }

  get stickyMenuTop() {
    const mq = mediaQueryPhone()
    if (mq.matches) {
      return 56
    } else {
      return 64
    }
  }

  render() {
    const {editorState, tab, toggleSaveDialog} = this.context
    const {anchorElement, loading, menuOpen} = this.state
    const {
      bodyClassName,
      bodyHeaderText,
      bottomActions,
      edit,
      handlePublish,
      handleRestore,
      handleToggleEdit,
      isPublishable,
      object,
      placeholder,
      study,
      uid,
    } = this.props

    return (
      <div id={`draft-${uid}`} className={this.classes}>
        <div className="mdc-card">
          <Sticky
            enabled={object.viewerCanUpdate}
            top={this.stickyMenuTop}
            bottomBoundary={`#draft-${uid}`}
            innerZ={2}
          >
            {edit
            ? <div className="mdc-card__actions rn-card__actions">
                <span className="rn-card__overline">
                  {tab === "draft"
                  ? `Last edited ${timeDifferenceForDate(object.lastEditedAt)}`
                  : "Preview"}
                </span>
                <div className="mdc-card__action-icons rn-card__actions--spread">
                  {tab === "preview" &&
                  <React.Fragment>
                    <button
                      type="button"
                      className="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon"
                      onClick={() => this.handleChangeTab_("draft")}
                      aria-label="Draft"
                      title="Draft"
                    >
                      edit
                    </button>
                    <button
                      type="button"
                      className="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon"
                      onClick={handlePublish}
                      disabled={!isPublishable}
                      aria-label="Publish draft"
                      title="Publish draft"
                    >
                      publish
                    </button>
                  </React.Fragment>
                  }
                  {tab === "draft" &&
                  <React.Fragment>
                    <button
                      type="button"
                      className="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon"
                      onClick={() => this.handleChangeTab_("preview")}
                      aria-label="Preview"
                      title="Preview"
                    >
                      visibility
                    </button>
                    <button
                      className="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon"
                      type="button"
                      onClick={this.handleToggleResetConfirmation}
                      aria-label="Reset draft"
                      title="Reset draft"
                    >
                      restore
                    </button>
                    <button
                      className="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon"
                      type="button"
                      onClick={handleRestore}
                      aria-label="Restore draft from backup"
                      title="Restore draft from backup"
                    >
                      restore_page
                    </button>
                    <AttachFile study={this.props.study} />
                    {study.viewerCanAdmin &&
                    <button
                      className="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon"
                      type="button"
                      onClick={toggleSaveDialog}
                      aria-label="Attach & Save file"
                      title="Attach & Save file"
                    >
                      cloud_upload
                    </button>}
                  </React.Fragment>}
                  {object.isPublished &&
                  <button
                    className="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon"
                    type="button"
                    onClick={this.handleToggleCancelConfirmation}
                    aria-label="Cancel edit"
                    title="Cancel edit"
                  >
                    cancel
                  </button>}
                </div>
                <Menu.Anchor
                  className="mdc-card__action-icons rn-card__actions--collapsed"
                  innerRef={this.setAnchorElement}
                >
                  {tab === "preview" &&
                  <button
                    type="button"
                    className="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon"
                    onClick={() => this.handleChangeTab_("draft")}
                    aria-label="Draft"
                    title="Draft"
                  >
                    edit
                  </button>}
                  {tab === "draft" &&
                  <button
                    type="button"
                    className="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon"
                    onClick={() => this.handleChangeTab_("preview")}
                    aria-label="Preview"
                    title="Preview"
                  >
                    visibility
                  </button>}
                  <button
                    type="button"
                    className="mdc-icon-button material-icons"
                    onClick={() => this.setState({menuOpen: !menuOpen})}
                  >
                    more_vert
                  </button>
                  <Menu
                    open={menuOpen}
                    onClose={() => this.setState({menuOpen: false})}
                    anchorElement={anchorElement}
                    anchorCorner={Corner.BOTTOM_LEFT}
                  >
                    <List items={filterDefinedReactChildren(
                      (tab === "draft"
                      ? [<List.Item
                          role="button"
                          onClick={this.handleToggleResetConfirmation}
                        >
                          <List.Item.Graphic graphic={
                            <Icon icon="restore" />
                          }/>
                          <List.Item.Text primaryText="Reset draft" />
                        </List.Item>,
                        <List.Item
                          role="button"
                          onClick={handleRestore}
                        >
                          <List.Item.Graphic graphic={
                            <Icon icon="restore_page" />
                          }/>
                          <List.Item.Text primaryText="Restore draft from backup" />
                        </List.Item>,
                        <AttachFile variant="list-item" study={this.props.study} />,
                        study.viewerCanAdmin &&
                        <List.Item
                          role="button"
                          onClick={toggleSaveDialog}
                        >
                          <List.Item.Graphic graphic={
                            <Icon icon="cloud_upload" />
                          }/>
                          <List.Item.Text primaryText="Attach & Save file" />
                        </List.Item>]
                      : []).concat(
                        tab === "preview"
                        ? [<List.Item
                            role="button"
                            onClick={handlePublish}
                          >
                            <List.Item.Graphic graphic={
                              <Icon icon="publish" />
                            }/>
                            <List.Item.Text primaryText="Publish draft" />
                          </List.Item>]
                        : []).concat([
                          object.isPublished &&
                          <List.Item
                            role="button"
                            onClick={this.handleToggleCancelConfirmation}
                          >
                            <List.Item.Graphic graphic={
                              <Icon icon="cancel" />
                            }/>
                            <List.Item.Text primaryText="Cancel edit" />
                          </List.Item>])
                    )}/>
                  </Menu>
                </Menu.Anchor>
              </div>
            : <div className="rn-card__actions mdc-card__actions">
                <span className="rn-card__overline">
                  {bodyHeaderText}
                </span>
                {object.viewerCanUpdate &&
                <div className="mdc-card__action-icons">
                  <button
                    className="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon"
                    type="button"
                    onClick={handleToggleEdit}
                    aria-label="Edit body"
                    title="Edit body"
                  >
                    edit
                  </button>
                </div>}
              </div>}
          </Sticky>
          {edit
          ? <React.Fragment>
              <div className="StudyBodyEditorMain__preview">
                <div className={cls("rn-card__body", bodyClassName)}>
                  <Preview
                    open={tab === "preview"}
                    studyId={study.id}
                    text={this.text}
                    initialPreview={object.bodyHTML}
                  />
                </div>
              </div>
              <div className="StudyBodyEditorMain__draft">
                <div
                  className={cls("StudyBodyEditorMain__draft-text rn-card__body", bodyClassName)}
                  onClick={() => this.focusEditor()}
                >
                  <input
                    className="StudyBodyEditorMain__hidden-input"
                    type="text"
                    value={this.text}
                    required
                    onChange={() => {}}
                    onInvalid={this.focusEditor}
                    onFocus={this.focusEditor}
                  />
                  <Editor
                    editorState={editorState}
                    readOnly={loading}
                    onChange={this.handleChange}
                    placeholder={placeholder || "Enter text"}
                    ref={this.editorElement}
                  />
                </div>
              </div>
            </React.Fragment>
          : <div className={cls("rn-card__body", bodyClassName)}>
              <HTML className="mdc-typography--body1" html={object.bodyHTML} />
            </div>}
          {bottomActions}
        </div>
        {object.ViewerCanUpdate && this.renderConfirmCancelDialog()}
        {object.ViewerCanUpdate && this.renderConfirmResetDialog()}
      </div>
    )
  }

  renderConfirmCancelDialog() {
    const {handleCancel} = this.props
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
              onClick={handleCancel}
              data-mdc-dialog-action="yes"
            >
              Yes
            </button>
          </Dialog.Actions>}
        />
    )
  }

  renderConfirmResetDialog() {
    const {handleReset} = this.props
    const {confirmResetDialogOpen} = this.state

    return (
      <Dialog
        open={confirmResetDialogOpen}
        onClose={() => this.setState({confirmResetDialogOpen: false})}
        title={<Dialog.Title>Reset draft</Dialog.Title>}
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
              onClick={handleReset}
              data-mdc-dialog-action="yes"
            >
              Yes
            </button>
          </Dialog.Actions>}
        />
    )
  }
}

StudyBodyEditorMain.propTypes = {
  bodyClassName: PropTypes.string,
  bodyHeaderText: PropTypes.node,
  bottomActions: PropTypes.node,
  edit: PropTypes.bool,
  handleCancel: PropTypes.func,
  handleChange: PropTypes.func,
  handlePreview: PropTypes.func,
  handlePublish: PropTypes.func,
  handleReset: PropTypes.func,
  handleRestore: PropTypes.func,
  handleToggleEdit: PropTypes.func.isRequired,
  isPublishable: PropTypes.bool.isRequired,
  object: PropTypes.shape({
    bodyHTML: PropTypes.string.isRequired,
    draft: PropTypes.string.isRequired,
    isPublished: PropTypes.bool.isRequired,
    lastEditedAt: PropTypes.string.isRequired,
    viewerCanUpdate: PropTypes.bool.isRequired,
  }),
  study: PropTypes.shape({
    id: PropTypes.string.isRequired,
    viewerCanAdmin: PropTypes.bool.isRequired,
  }).isRequired,
}

StudyBodyEditorMain.defaultProps = {
  bodyClassName: "",
  bodyHeaderText: null,
  bottomActions: null,
  edit: false,
  handleCancel: () => {},
  handleChange: () => {},
  handlePreview: () => {},
  handlePublish: () => {},
  handleReset: () => {},
  handleRestore: () => {},
  handleToggleEdit: () => {},
  isPublishable: false,
  object: {
    bodyHTML: "",
    draft: "",
    isPublished: false,
    lastEditedAt: "",
    viewerCanUpdate: false,
  },
  study: {
    id: "",
    viewerCanAdmin: false,
  }
}

StudyBodyEditorMain.contextType = Context

export default withUID((getUID) => ({ uid: getUID() }))(StudyBodyEditorMain)
