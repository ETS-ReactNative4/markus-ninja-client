import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {MDCMenuFoundation} from '@material/menu/dist/mdc.menu'
import {MDCMenuSurfaceFoundation} from '@material/menu-surface/dist/mdc.menuSurface'
import MenuSurface from 'components/MenuSurface'

import MenuSelectionGroup from './MenuSelectionGroup'
import MenuSelectionGroupIcon from './MenuSelectionGroupIcon'

const {cssClasses, strings} = MDCMenuFoundation

class Menu extends React.Component {
  foundation_ = null

  constructor(props) {
    super(props)

    this.root_ = null
    this.menuSurface_ = React.createRef()
    this.list_ = React.createRef()

    this.setRootRef = (element) => {
      this.root_ = element;
    }
  }

  componentDidMount() {
    this.foundation_ = new MDCMenuFoundation(this.adapter)
    this.foundation_.init()

    this.list_.current.wrapFocus = true
    this.open = this.props.open

    this.listen(MDCMenuSurfaceFoundation.strings.OPENED_EVENT, this.handleAfterOpened)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.open !== this.props.open) {
      this.open = this.props.open
    }
  }

  componentWillUnmount() {
    this.foundation_.destroy()

    this.unlisten(MDCMenuSurfaceFoundation.strings.OPENED_EVENT, this.handleAfterOpened)
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

    this.root_.dispatchEvent(evt)
  }

  handleAfterOpened = () => {
    const list = this.items;
    if (list.length > 0) {
      list[0].focus();
    }
  }

  handleKeydown = (e) => {
    this.foundation_.handleKeydown(e)
    this.props.onKeyDown(e)
  }

  handleClick = (e) => {
    this.foundation_.handleClick(e)
    this.props.onClick(e)
  }

  /** @return {boolean} */
  get open() {
    return this.menuSurface_.current.open;
  }

  /** @param {boolean} value */
  set open(value) {
    this.menuSurface_.current.open = value;
  }

  /**
   * @param {!Corner} corner Default anchor corner alignment of top-left
   *     menu corner.
   */
  setAnchorCorner(corner) {
    this.menuSurface_.current.setAnchorCorner(corner);
  }

  /**
   * @param {!AnchorMargin} margin
   */
  setAnchorMargin(margin) {
    this.menuSurface_.current.setAnchorMargin(margin);
  }

  get items() {
    return this.list_.current.listElements
  }

  getOptionByIndex(index) {
    const items = this.items

    if (index < items.length) {
      return this.items[index]
    } else {
      return null
    }
  }

  /** @param {boolean} quickOpen */
  set quickOpen(quickOpen) {
    this.menuSurface_.current.quickOpen = quickOpen;
  }

  /** @param {boolean} isFixed */
  setFixedPosition(isFixed) {
    this.menuSurface_.current.setFixedPosition(isFixed);
  }

  hoistMenuToBody() {
    this.menuSurface_.current.hoistMenuToBody();
  }

  /** @param {boolean} isHoisted */
  setIsHoisted(isHoisted) {
    this.menuSurface_.current.setIsHoisted(isHoisted);
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  setAbsolutePosition(x, y) {
    this.menuSurface_.current.setAbsolutePosition(x, y);
  }

  /**
   * Sets the element that the menu-surface is anchored to.
   * @param {!HTMLElement} element
   */
  setAnchorElement(element) {
    this.menuSurface_.current.setMenuSurfaceAnchorElement(element);
  }

  get classes() {
    const {className} = this.props
    return cls("mdc-menu", className)
  }

  get adapter() {
    return Object.assign({
      addClassToElementAtIndex: (index, className) => {
        const list = this.items;
        list[index].classList.add(className);
      },
      removeClassFromElementAtIndex: (index, className) => {
        const list = this.items;
        list[index].classList.remove(className);
      },
      addAttributeToElementAtIndex: (index, attr, value) => {
        const list = this.items;
        list[index].setAttribute(attr, value);
      },
      removeAttributeFromElementAtIndex: (index, attr) => {
        const list = this.items;
        list[index].removeAttribute(attr);
      },
      elementContainsClass: (element, className) => element.classList.contains(className),
      closeSurface: () => { this.open = false; this.props.onClose() },
      getElementIndex: (element) => this.items.indexOf(element),
      getParentElement: (element) => element.parentElement,
      getSelectedElementIndex: (selectionGroup) => {
        return this.items.indexOf(selectionGroup.querySelector(`.${cssClasses.MENU_SELECTED_LIST_ITEM}`));
      },
      notifySelected: (evtData) => this.emit(strings.SELECTED_EVENT, {
        index: evtData.index,
        item: this.items[evtData.index],
      }),
    })
  }

  get otherProps() {
    const {
      as,
      className,
      fixed,
      innerRef,
      list,
      open,
      onClick,
      onClose,
      onKeyDown,
      onOpen,
      ...otherProps,
    } = this.props
    return otherProps
  }

  render() {
    const {
      as,
      fixed,
      innerRef,
      onClose,
      onOpen,
    } = this.props

    return (
      <MenuSurface
        {...this.otherProps}
        innerRef={(node) => {this.setRootRef(node); innerRef(node)}}
        ref={this.menuSurface_}
        as={as}
        className={this.classes}
        onClick={this.handleClick}
        onClose={onClose}
        onKeyDown={this.handleKeydown}
        onOpen={onOpen}
        fixed={fixed}
        tabIndex="-1"
      >
        {this.renderList()}
      </MenuSurface>
    )
  }

  renderList() {
    let {list} = this.props
    if (!list) {
      list = React.Children.only(this.props.children)
    }
    const props = Object.assign({
      ref: this.list_,
      role: "menu",
      "aria-hidden": true,
    }, list.props)
    return React.cloneElement(list, props)
  }
}

Menu.propTypes = {
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  className: PropTypes.string,
  fixed: PropTypes.bool,
  innerRef: PropTypes.func,
  list: PropTypes.element,
  open: PropTypes.bool,
  onClick: PropTypes.func,
  onClose: PropTypes.func,
  onKeyDown: PropTypes.func,
  onOpen: PropTypes.func,
}

Menu.defaultProps = {
  as: "div",
  className: '',
  fixed: false,
  innerRef: () => {},
  list: null,
  open: false,
  onClick: () => {},
  onClose: () => {},
  onKeyDown: () => {},
  onOpen: () => {},
}

Menu.Anchor = MenuSurface.Anchor
Menu.SelectionGroup = MenuSelectionGroup
Menu.SelectionGroupIcon = MenuSelectionGroupIcon

export default Menu
