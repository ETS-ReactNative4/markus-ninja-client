import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {MDCTabFoundation} from '@material/menu/dist/mdc.menu'

const {cssClasses, strings} = MDCTabFoundation

class Tab extends React.Component {
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
    this.foundation_ = new MDCTabFoundation(this.adapter)
    this.foundation_.init()

    this.list_.current.wrapFocus = true
    this.open = this.props.open
  }

  componentDidUpdate(prevProps) {
    if (prevProps.open !== this.props.open) {
      this.open = this.props.open
    }
  }

  componentWillUnmount() {
    this.foundation_.destroy()
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

  hoistTabToBody() {
    this.menuSurface_.current.hoistTabToBody();
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
    this.menuSurface_.current.anchorElement = element;
  }

  get classes() {
    const {className} = this.props
    return cls("mdc-tab", className)
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
      innerRef,
      ...otherProps,
    } = this.props
    return otherProps
  }

  render() {
    const {
      as: Component,
      innerRef,
    } = this.props

    return (
      <Component
        {...this.otherProps}
        ref={(node) => {this.setRootRef(node); innerRef(node)}}
        className={this.classes}
        role="tab"
        aria-selected={false}
        tabIndex="-1"
      >
        {this.renderList()}
      </Component>
    )
  }
}

Tab.propTypes = {
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  className: PropTypes.string,
  innerRef: PropTypes.func,
}

Tab.defaultProps = {
  as: "button",
  className: '',
  innerRef: () => {},
}

export default Tab
