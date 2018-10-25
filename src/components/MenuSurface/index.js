import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {MDCMenuSurfaceFoundation} from '@material/menu-surface/dist/mdc.menuSurface'

import MenuSurfaceAnchor from './MenuSurfaceAnchor'

const {cssClasses, strings} = MDCMenuSurfaceFoundation

class MenuSurface extends React.Component {
  foundation_ = null

  constructor(props) {
    super(props)

    this.root_ = null
    this.previousFocus_ = null
    this.anchorElement = null
    this.firstFocusableElement_ = null
    this.lastFocusableElement_ = null

    this.setRootRef = (element) => {
      this.root_ = element;
    }

    this.state = {
      classList: new Set(),
      style: {},
    }
  }

  componentDidMount() {
    this.foundation_ = new MDCMenuSurfaceFoundation(this.adapter)
    this.foundation_.init()

    if (this.root_.parentElement && this.root_.parentElement.classList.contains(cssClasses.ANCHOR)) {
      this.anchorElement = this.root_.parentElement;
    }

    this.fixed = this.props.fixed
    this.open = this.props.open

    this.listen(strings.OPENED_EVENT, this.registerBodyClickListener_)
    this.listen(strings.CLOSED_EVENT, this.deregisterBodyClickListener_)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.open !== this.props.open) {
      this.open = this.props.open
    } else if (prevProps.fixed !== this.props.fixed) {
      this.fixed = this.props.fixed
    }
  }

  componentWillUnmount() {
    this.foundation_.destroy()

    this.unlisten(strings.OPENED_EVENT, this.registerBodyClickListener_)
    this.unlisten(strings.CLOSED_EVENT, this.deregisterBodyClickListener_)
  }

  listen(evtType, handler) {
    this.root_.addEventListener(evtType, handler)
  }

  unlisten(evtType, handler) {
    this.root_.removeEventListener(evtType, handler)
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

    this.root_ && this.root_.dispatchEvent(evt)
  }

  handleKeydown = (e) => {
    this.foundation_.handleKeydown(e)
    this.props.onKeyDown(e)
  }

  handleBodyClick = (e) => {
    this.foundation_.handleBodyClick(e)
  }

  registerBodyClickListener_ = () => document.body.addEventListener('click', this.handleBodyClick)

  deregisterBodyClickListener_ = () => document.body.removeEventListener('click', this.handleBodyClick)

  setStyleProperty = (property, value) => {
    this.setState({
      style: {
        ...this.state.style,
        [property]: value,
      }
    })
  }

  /**
   * Removes the menu-surface from it's current location and appends it to the
   * body to overcome any overflow:hidden issues.
   */
  hoistMenuToBody() {
    document.body.appendChild(this.root_.parentElement.removeChild(this.root_));
    this.setIsHoisted(true);
  }

  /**
   * Sets the foundation to use page offsets for an positioning when the menu
   * is hoisted to the body.
   * @param {boolean} isHoisted
   */
  setIsHoisted(isHoisted) {
    this.foundation_.setIsHoisted(isHoisted);
  }

  /**
   * Sets the element that the menu-surface is anchored to.
   * @param {!Element} element
   */
  setMenuSurfaceAnchorElement(element) {
    this.anchorElement = element;
  }

  /**
   * Sets the menu-surface to position: fixed.
   * @param {boolean} isFixed
   */
  setFixedPosition(isFixed) {
    if (isFixed) {
      this.root_.classList.add(cssClasses.FIXED);
    } else {
      this.root_.classList.remove(cssClasses.FIXED);
    }

    this.foundation_.setFixedPosition(isFixed);
  }

  /**
   * Sets the absolute x/y position to position based on. Requires the menu to be hoisted.
   * @param {number} x
   * @param {number} y
   */
  setAbsolutePosition(x, y) {
    this.foundation_.setAbsolutePosition(x, y);
    this.setIsHoisted(true);
  }

  /**
   * @param {!Corner} corner Default anchor corner alignment of top-left
   *     surface corner.
   */
  setAnchorCorner(corner) {
    this.foundation_.setAnchorCorner(corner);
  }

  /**
   * @param {!AnchorMargin} margin
   */
  setAnchorMargin(margin) {
    this.foundation_.setAnchorMargin(margin);
  }

  /** @param {boolean} quickOpen */
  set quickOpen(quickOpen) {
    this.foundation_.setQuickOpen(quickOpen);
  }
  set fixed(value) {
    this.foundation_.setFixedPosition(value)
  }

  set open(value) {
    if (value) {
      const focusableElements = this.root_.querySelectorAll(strings.FOCUSABLE_ELEMENTS);
      this.firstFocusableElement_ = focusableElements.length > 0 ? focusableElements[0] : null;
      this.lastFocusableElement_ = focusableElements.length > 0 ?
        focusableElements[focusableElements.length - 1] : null;
      this.foundation_.open();
    } else {
      this.foundation_.close();
    }
  }

  get open() {
    return this.foundation_.isOpen()
  }

  get classes() {
    const {classList} = this.state
    const {
      className,
      fixed,
    } = this.props
    return cls("mdc-menu-surface", Array.from(classList), className, {
      "mdc-menu-surface--fixed": fixed,
    })
  }

  get adapter() {
    return Object.assign({
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
      hasAnchor: () => !!this.anchorElement,
      notifyClose: () => { this.emit(strings.CLOSED_EVENT, {}); this.props.onClose() },
      notifyOpen: () => { this.emit(strings.OPENED_EVENT, {}); this.props.onOpen() },
      isElementInContainer: (el) => this.root_ === el || this.root_.contains(el),
      isRtl: () => getComputedStyle(this.root_).getPropertyValue('direction') === 'rtl',
      setTransformOrigin: (origin) => this.setStyleProperty("transformOrigin", origin),
    },
    this.getFocusAdapterMethods_(),
    this.getDimensionAdapterMethods_(),
    )
  }

  getFocusAdapterMethods_ = () => {
    return {
      isFocused: () => document.activeElement === this.root_,
      saveFocus: () => {
        this.previousFocus_ = document.activeElement;
      },
      restoreFocus: () => {
        if (this.root_.contains(document.activeElement)) {
          if (this.previousFocus_ && this.previousFocus_.focus) {
            this.previousFocus_.focus();
          }
        }
      },
      isFirstElementFocused: () =>
        this.firstFocusableElement_ && this.firstFocusableElement_ === document.activeElement,
      isLastElementFocused: () =>
        this.lastFocusableElement_ && this.lastFocusableElement_ === document.activeElement,
      focusFirstElement: () =>
        this.firstFocusableElement_ && this.firstFocusableElement_.focus && this.firstFocusableElement_.focus(),
      focusLastElement: () =>
        this.lastFocusableElement_ && this.lastFocusableElement_.focus && this.lastFocusableElement_.focus(),
    };
  }

  getDimensionAdapterMethods_ = () => {
    return {
      getInnerDimensions: () => {
        return {width: this.root_.offsetWidth, height: this.root_.offsetHeight};
      },
      getAnchorDimensions: () => this.anchorElement && this.anchorElement.getBoundingClientRect(),
      getWindowDimensions: () => {
        return {width: window.innerWidth, height: window.innerHeight};
      },
      getBodyDimensions: () => {
        return {width: document.body.clientWidth, height: document.body.clientHeight};
      },
      getWindowScroll: () => {
        return {x: window.pageXOffset, y: window.pageYOffset};
      },
      setPosition: (position) => {
        this.setState({
          style: {
            ...this.state.style,
            left: 'left' in position ? position.left : null,
            right: 'right' in position ? position.right : null,
            top: 'top' in position ? position.top : null,
            bottom: 'bottom' in position ? position.bottom : null,
          }
        })
      },
      setMaxHeight: (height) => {
        this.setStyleProperty("maxHeight", height)
      },
    };
  }

  get otherProps() {
    const {
      as,
      children,
      className,
      fixed,
      innerRef,
      open,
      onClose,
      onKeyDown,
      onOpen,
      ...otherProps,
    } = this.props
    return otherProps
  }

  render() {
    const {
      as: Component,
      children,
      innerRef,
    } = this.props
    const {style} = this.state

    return (
      <Component
        {...this.otherProps}
        ref={(node) => {this.setRootRef(node); innerRef(node)}}
        style={style}
        className={this.classes}
        onKeyDown={this.handleKeydown}
      >
        {children}
      </Component>
    )
  }
}

MenuSurface.propTypes = {
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  children: PropTypes.node,
  className: PropTypes.string,
  fixed: PropTypes.bool,
  innerRef: PropTypes.func,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onKeyDown: PropTypes.func,
  onOpen: PropTypes.func,
}

MenuSurface.defaultProps = {
  as: "div",
  children: null,
  className: '',
  fixed: false,
  innerRef: () => {},
  open: false,
  onClose: () => {},
  onKeyDown: () => {},
  onOpen: () => {},
}

MenuSurface.Anchor = MenuSurfaceAnchor

export default MenuSurface
