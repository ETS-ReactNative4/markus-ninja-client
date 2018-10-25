import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {MDCListFoundation} from '@material/list/dist/mdc.list'
import {matches} from '@material/dom/ponyfill'

import ListDivider from './ListDivider'
import ListItem from './ListItem'

const {cssClasses, strings} = MDCListFoundation

class List extends React.Component {
  foundation_ = null

  constructor(props) {
    super(props)

    this.root_ = null

    this.setRootRef = (element) => {
      this.root_ = element;
    }
  }

  componentDidMount() {
    this.foundation_ = new MDCListFoundation(this.adapter)

    this.layout()
  }

  componentDidUpdate() {
    // List items need to have at least tabindex=-1 to be focusable.
    [].slice.call(this.root_.querySelectorAll('.mdc-list-item:not([tabindex])'))
      .forEach((ele) => {
        ele.setAttribute('tabindex', -1);
    });

    if (this.props.role === 'menu') {
      // List items need to have at least tabindex=-1 to be focusable.
      [].slice.call(this.root_.querySelectorAll('.mdc-list-item'))
        .forEach((ele) => {
          ele.setAttribute('role', 'menuitem');
      });
    }

    // Child button/a elements are not tabbable until the list item is focused.
    [].slice.call(this.root_.querySelectorAll(strings.FOCUSABLE_CHILD_ELEMENTS))
      .forEach((ele) => ele.setAttribute('tabindex', -1));
  }

  componentWillUnmount() {
    this.foundation_.destroy()
  }

  layout() {
    this.vertical = !this.props.horizontal
  }

  getListItemIndex_ = (e) => {
    let eventTarget = e.target
    let index = -1

    // Find the first ancestor that is a list item or the list.
    while (!eventTarget.classList.contains(cssClasses.LIST_ITEM_CLASS)
    && !eventTarget.classList.contains(cssClasses.ROOT)) {
      eventTarget = eventTarget.parentElement;
    }

    // Get the index of the element if it is a list item.
    if (eventTarget.classList.contains(cssClasses.LIST_ITEM_CLASS)) {
      index = this.listElements.indexOf(eventTarget);
    }

    return index;
  }

  handleFocus = (e) => {
    const index = this.getListItemIndex_(e)
    this.foundation_.handleFocusIn(e, index)
  }

  handleBlur = (e) => {
    const index = this.getListItemIndex_(e)
    this.foundation_.handleFocusOut(e, index)
  }

  handleKeydown = (e) => {
    const index = this.getListItemIndex_(e)

    if (index >= 0) {
      this.foundation_.handleKeydown(e, e.target.classList.contains(cssClasses.LIST_ITEM_CLASS), index)
    }
  }

  handleClick = (e) => {
    const index = this.getListItemIndex_(e)

    // Toggle the checkbox only if it's not the target of the event, or the checkbox will have 2 change events.
    const toggleCheckbox = !matches(e.target, strings.CHECKBOX_RADIO_SELECTOR)
    this.foundation_.handleClick(index, toggleCheckbox)
  }

  initializeListType() {
    // Automatically set single selection if selected/activated classes are present.
    const preselectedElement =
      this.root_.querySelector(`.${cssClasses.LIST_ITEM_ACTIVATED_CLASS}, .${cssClasses.LIST_ITEM_SELECTED_CLASS}`);

    if (preselectedElement) {
      if (preselectedElement.classList.contains(cssClasses.LIST_ITEM_ACTIVATED_CLASS)) {
        this.foundation_.setUseActivatedClass(true);
      }

      this.singleSelection = true;
      this.selectedIndex = this.listElements.indexOf(preselectedElement);
    }
  }

  set vertical(value) {
    this.foundation_.setVerticalOrientation(value);
  }

  get listElements() {
    return [].slice.call(this.root_.querySelectorAll(strings.ENABLED_ITEMS_SELECTOR))
  }

  set wrapFocus(value) {
    this.foundation_.setWrapFocus(value)
  }

  set singleSelection(isSingleSelectionList) {
    this.foundation_.setSingleSelectio(isSingleSelectionList)
  }

  set selectedIndex(index) {
    this.foundation_.setSelectedIndex(index)
  }

  get classes() {
    const {className} = this.props
    return cls('mdc-list', className)
  }

  get adapter() {
    return {
      getListItemCount: () => this.listElements.length,
      getFocusedElementIndex: () => this.listElements.indexOf(document.activeElement),
      setAttributeForElementIndex: (index, attr, value) => {
        const element = this.listElements[index];
        if (element) {
          element.setAttribute(attr, value);
        }
      },
      removeAttributeForElementIndex: (index, attr) => {
        const element = this.listElements[index];
        if (element) {
          element.removeAttribute(attr);
        }
      },
      addClassForElementIndex: (index, className) => {
        const element = this.listElements[index];
        if (element) {
          element.classList.add(className);
        }
      },
      removeClassForElementIndex: (index, className) => {
        const element = this.listElements[index];
        if (element) {
          element.classList.remove(className);
        }
      },
      focusItemAtIndex: (index) => {
        const element = this.listElements[index];
        if (element) {
          element.focus();
        }
      },
      setTabIndexForListItemChildren: (listItemIndex, tabIndexValue) => {
        const element = this.listElements[listItemIndex];
        const listItemChildren = [].slice.call(element.querySelectorAll(strings.CHILD_ELEMENTS_TO_TOGGLE_TABINDEX));
        listItemChildren.forEach((ele) => ele.setAttribute('tabindex', tabIndexValue));
      },
      followHref: (index) => {
        const listItem = this.listElements[index];
        if (listItem && listItem.href) {
          listItem.click();
        }
      },
      toggleCheckbox: (index) => {
        let checkboxOrRadioExists = false;
        const listItem = this.listElements[index];
        const elementsToToggle =
          [].slice.call(listItem.querySelectorAll(strings.CHECKBOX_RADIO_SELECTOR));
        elementsToToggle.forEach((element) => {
          const event = document.createEvent('Event');
          event.initEvent('change', true, true);

          if (!element.checked || element.type !== 'radio') {
            element.checked = !element.checked;
            element.dispatchEvent(event);
          }
          checkboxOrRadioExists = true;
        });
        return checkboxOrRadioExists;
      },
    }
  }

  get otherProps() {
    const {
      as,
      children,
      className,
      horizontal,
      innerRef,
      role,
      ...otherProps,
    } = this.props
    return otherProps
  }

  get orientation() {
    const {horizontal} = this.props
    return horizontal ? "horizontal" : "vertical"
  }

  render() {
    const {
      as: Component,
      children,
      innerRef,
      role,
    } = this.props

    return (
      // eslint-disable-next-line jsx-a11y/role-supports-aria-props
      <Component
        {...this.otherProps}
        ref={(node) => {this.setRootRef(node); innerRef(node)}}
        className={this.classes}
        aria-orientation={this.orientation}
        role={role}
        onClick={this.handleClick}
        onKeyDown={this.handleKeydown}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
      >
        {children}
      </Component>
    )
  }
}

List.propTypes = {
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  children: PropTypes.node,
  className: PropTypes.string,
  horizontal: PropTypes.bool,
  innerRef: PropTypes.func,
  role: PropTypes.string,
  onBlur: PropTypes.func,
  onClick: PropTypes.func,
  onFocus: PropTypes.func,
  onKeyDown: PropTypes.func,
}

List.defaultProps = {
  as: "ul",
  children: null,
  className: '',
  horizontal: false,
  innerRef: () => {},
  onBlur: () => {},
  onClick: () => {},
  onFocus: () => {},
  onKeyDown: () => {},
}

List.Divider = ListDivider
List.Item = ListItem

export default List
