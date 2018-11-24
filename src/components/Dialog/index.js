import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {MDCDialogFoundation} from '@material/dialog'
import {closest, matches} from '@material/dom/ponyfill'
import createFocusTrap from 'focus-trap'
import * as util from './util'
import DialogActions from './Actions'
import DialogContent from './Content'
import DialogTitle from './Title'

const strings = MDCDialogFoundation.strings

class Dialog extends React.Component {
  foundation_ = null

  constructor(props) {
    super(props)

    this.root = null
    this.container = React.createRef()
    this.content = React.createRef()
    this.focusTrap_ = null
    this.focusTrapFactory_ = createFocusTrap
    this.initialFocusEl = null

    this.setRootRef = (element) => {
      this.root = element;
    }

    this.state = {
      classList: new Set(),
    }
  }

  componentDidMount() {
    this.buttons_ = [].slice.call(this.root.querySelectorAll(strings.BUTTON_SELECTOR))
    this.defaultButton_ = this.root.querySelector(strings.DEFAULT_BUTTON_SELECTOR)
    this.focusTrap_ = util.createFocusTrapInstance(this.container.current, this.focusTrapFactory_, this.initialFocusEl)
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
    this.root.addEventListener(evtType, handler)
  }

  unlisten(evtType, handler) {
    this.root.removeEventListener(evtType, handler)
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

    this.root.dispatchEvent(evt)
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
      eventTargetMatches: (target, selector) => matches(target, selector),
      trapFocus: () => this.focusTrap_.activate(),
      releaseFocus: () => this.focusTrap_.deactivate(),
      isContentScrollable: () => !!this.content.current && util.isScrollable(this.content.current),
      areButtonsStacked: () => util.areTopsMisaligned(this.buttons_),
      getActionFromEvent: (e) => {
        const element = closest(e.target, `[${strings.ACTION_ATTRIBUTE}]`)
        return element && element.getAttribute(strings.ACTION_ATTRIBUTE)
      },
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

  get otherProps() {
    const {
      actions,
      className,
      content,
      innerRef,
      onClose,
      onOpen,
      open,
      title,
      ...otherProps
    } = this.props
    return otherProps
  }

  render() {
    const {
      actions,
      content,
      innerRef,
      title,
    } = this.props

    return (
      <div
        {...this.otherProps}
        className={this.classes}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-content"
        onClick={(e) => this.foundation_.handleInteraction(e)}
        onKeyDown={(e) => this.foundation_.handleInteraction(e)}
        ref={(node) => {this.setRootRef(node); innerRef(node)}}
      >
        <div
          className="mdc-dialog__container"
          ref={this.container}
        >
          <div className="mdc-dialog__surface">
            {title && this.renderTitle()}
            {content && this.renderContent()}
            {actions && this.renderActions()}
          </div>
        </div>
        <div className="mdc-dialog__scrim"></div>
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
      ref: this.content,
    }, content.props)
    return React.cloneElement(content, props)
  }

  renderActions() {
    const {actions} = this.props
    const props = Object.assign({
    }, actions.props)
    return React.cloneElement(actions, props)
  }

  static Actions = DialogActions
  static Content = DialogContent
  static Title = DialogTitle
}

Dialog.propTypes = {
  actions: PropTypes.element,
  className: PropTypes.string,
  content: PropTypes.element,
  innerRef: PropTypes.func,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
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
  open: false,
  title: null,
}

export default Dialog
