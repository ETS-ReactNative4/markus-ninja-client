import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import FocusTrap from 'focus-trap-react'
import {MDCDialogFoundation} from '@material/dialog/dist/mdc.dialog'
import * as util from './util'
import DialogActions from './DialogActions'
import DialogContent from './DialogContent'
import DialogTitle from './DialogTitle'

const strings = MDCDialogFoundation.strings

class Dialog extends React.Component {
  dialogElement_ = React.createRef()
  containerElement_ = React.createRef()
  contentElement_ = React.createRef()
  foundation_ = null

  state = {
    activeFocusTrap: false,
    classList: new Set(),
  }

  componentDidMount() {
    this.buttons_ = [].slice.call(this.dialogElement_.current.querySelectorAll(strings.BUTTON_SELECTOR))
    this.defaultButton_ = this.dialogElement_.current.querySelector(strings.DEFAULT_BUTTON_SELECTOR)
    this.foundation_ = new MDCDialogFoundation(this.adapter)
    this.foundation_.init()

    this.handleDocumentKeydown_ = this.foundation_.handleDocumentKeydown.bind(this.foundation_)
    this.layout_ = this.layout.bind(this)

    const LAYOUT_EVENTS = ['resize', 'orientationchange'];
    this.handleOpening_ = () => {
      LAYOUT_EVENTS.forEach((type) => window.addEventListener(type, this.layout_));
      document.addEventListener('keydown', this.handleDocumentKeydown_);
    };
    this.handleClosing_ = () => {
      LAYOUT_EVENTS.forEach((type) => window.removeEventListener(type, this.layout_));
      document.removeEventListener('keydown', this.handleDocumentKeydown_);
    };

    this.listen(strings.OPENING_EVENT, this.handleOpening_)
    this.listen(strings.CLOSING_EVENT, this.handleClosing_)
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.open && this.props.open) {
      this.open()
    } else if (prevProps.open && !this.props.open) {
      this.close()
    }
  }

  componentWillUnmount() {
    this.foundation_.destroy()

    this.unlisten(strings.OPENING_EVENT, this.handleOpening_)
    this.unlisten(strings.CLOSING_EVENT, this.handleClosing_)
    this.handleClosing_()
  }

  layout() {
    this.foundation_.layout()
  }

  open() {
    this.foundation_.open()
  }

  close(action = '') {
    this.foundation_.close(action)
  }

  listen(evtType, handler) {
    this.dialogElement_.current.addEventListener(evtType, handler)
  }

  unlisten(evtType, handler) {
    this.dialogElement_.current.removeEventListener(evtType, handler)
  }

  emit(evtType, evtData, shouldBubble = false) {
    let evt;
    if (typeof CustomEvent === 'function') {
      evt = new CustomEvent(evtType, {
        detail: evtData,
        bubbles: shouldBubble,
      })
    } else {
      evt = document.createEvent('CustomEvent')
      evt.initCustomEvent(evtType, shouldBubble, false, evtData)
    }

    this.dialogElement_.current.dispatchEvent(evt)
  }

  get classes() {
    const {classList} = this.state
    const {className} = this.props
    return cls('mdc-dialog', Array.from(classList), className)
  }

  get adapter() {
    return {
      addClass: (className) => {
        const classList = new Set(this.state.classList)
        classList.add(className)
        this.setState({classList})
      },
      removeClass: (className) => {
        const classList = new Set(this.state.classList)
        classList.delete(className)
        this.setState({classList})
      },
      hasClass: (className) => this.classes.split(' ').includes(className),
      addBodyClass: (className) => document.body.classList.add(className),
      removeBodyClass: (className) => document.body.classList.remove(className),
      trapFocus: () => this.setState({activeFocusTrap: true}),
      releaseFocus: () => this.setState({activeFocusTrap: false}),
      isContentScrollable: () => !!this.contentElement_.current && util.isScrollable(this.contentElement_.current),
      areButtonsStacked: () => util.areTopsMisaligned(this.buttons_),
      clickDefaultButton: () => {
        if (this.defaultButton_) {
          this.defaultButton_.click()
        }
      },
      reverseButtons: () => {
        this.buttons_.reverse()
        this.buttons_.forEach((button) => button.parentElement.appendChild(button))
      },
      notifyOpening: () => this.emit(strings.OPENING_EVENT, {}),
      notifyOpened: () => {
        this.emit(strings.OPENED_EVENT, {})
        this.props.onOpen()
      },
      notifyClosing: (action) => this.emit(strings.CLOSING_EVENT, action ? {action}: {}),
      notifyClosed: (action) => {
        this.emit(strings.CLOSED_EVENT, action ? {action}: {})
        this.props.onClose(action)
      },
    }
  }

  handleClickAction_ = (evt) => {
    const action = evt.target.getAttribute(strings.ACTION_ATTRIBUTE)
    if (action) {
      this.close(action)
    }
  }

  handleKeyDownAction_ = (evt) => {
    const isEnter = evt.key === 'Enter' || evt.keyCode === 13;
    const isSpace = evt.key === 'Space' || evt.keyCode === 32;

    if (isEnter || isSpace) {
      const action = evt.target.getAttribute(strings.ACTION_ATTRIBUTE)
      if (action) {
        this.close(action)
      }
    }
  }

  handleScrimClick_ = (evt) => {
    this.props.onScrimClick(evt);
    const scrimClickAction = this.foundation_.getScrimClickAction()
    if (scrimClickAction !== "") {
      this.close(scrimClickAction)
    }
  }

  get otherProps() {
    const {
      actions,
      className,
      content,
      innerRef,
      onClose,
      onOpen,
      onScrimClick,
      open,
      title,
      ...otherProps
    } = this.props
    return otherProps
  }

  get focusTrapOptions() {
    return {
      clickOutsideDeactivates: true,
      initialFocus: false,
      escapeDeactivates: false,
      returnFocusOnDeactivate: false,
    }
  }

  render() {
    const {activeFocusTrap} = this.state

    return (
      <div
        {...this.otherProps}
        className={this.classes}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-content"
        ref={this.dialogElement_}
      >
        {activeFocusTrap
        ? <FocusTrap focusTrapOptions={this.focusTrapOptions}>
            {this.renderChildren()}
          </FocusTrap>
        : this.renderChildren()}
        <div
          className="mdc-dialog__scrim"
          onClick={this.handleScrimClick_}
        ></div>
      </div>
    )
  }

  renderChildren() {
    const {
      actions,
      content,
      title,
    } = this.props

    return (
      <div
        className="mdc-dialog__container"
        ref={this.containerElement_}
      >
        <div className="mdc-dialog__surface">
          {title && this.renderTitle()}
          {content && this.renderContent()}
          {actions && this.renderActions()}
        </div>
      </div>
    )
  }

  renderTitle() {
    const {title} = this.props
    const props = Object.assign({
      id: 'dialog-title',
    }, title.props)
    return React.cloneElement(title, props)
  }

  renderContent() {
    const {content} = this.props
    const props = Object.assign({
      id: 'dialog-content',
      ref: this.contentElement_,
    }, content.props)
    return React.cloneElement(content, props)
  }

  renderActions() {
    const {actions} = this.props
    const props = Object.assign({
      onClick: this.handleClickAction_,
      onKeyDown: this.handleKeyDownAction_,
    }, actions.props)
    return React.cloneElement(actions, props)
  }
}

Dialog.propTypes = {
  actions: PropTypes.element,
  className: PropTypes.string,
  content: PropTypes.element,
  innerRef: PropTypes.func,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  onScrimClick: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.element,
}

Dialog.defaultProps = {
  actions: null,
  className: '',
  content: null,
  innerRef: () => {},
  onClose: () => {},
  onOpen: () => {},
  onScrimClick: () => {},
  open: false,
  title: null,
}

Dialog.Actions = DialogActions
Dialog.Content = DialogContent
Dialog.Title = DialogTitle

export default Dialog
