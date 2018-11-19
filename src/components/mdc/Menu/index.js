// The MIT License
//
// Copyright (c) 2018 Google, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {MDCMenuFoundation} from '@material/menu/dist/mdc.menu'
import MenuSurface, {Corner} from 'components/mdc/MenuSurface'

import MenuSelectionGroup from './MenuSelectionGroup'
import MenuSelectionGroupIcon from './MenuSelectionGroupIcon'

class Menu extends React.Component {
  listElement_ = React.createRef()
  foundation_ = null

  state = {
    open: false,
  }

  componentDidMount() {
    this.foundation_ = new MDCMenuFoundation(this.adapter)
    this.foundation_.init()

    this.open = this.props.open
  }

  componentDidUpdate(prevProps) {
    const {open} = this.props
    if (open !== prevProps.open) {
      this.open = open
    }
  }

  componentWillUnmount() {
    this.foundation_.destroy()
  }

  set open(isOpen) {
    this.setState({open: isOpen})
  }

  handleOpen_ = () => {
    const listElement = this.listElement_ && this.listElement_.current;
    if (!listElement) return;

    if (listElement.adapter.getListItemCount > 0) {
      listElement.adapter.focusItemAtIndex(0);
    }
    this.props.onOpen()
  }

  handleKeydown_ = (e) => {
    this.foundation_.handleKeydown(e)
    this.props.onKeyDown(e)
  }

  handleClick_ = (e) => {
    this.foundation_.handleClick(e)
    this.props.onClick(e)
  }

  get classes() {
    const {className} = this.props
    return cls("mdc-menu", className)
  }

  get adapter() {
    return Object.assign({
      addClassToElementAtIndex: (index, className) => {
        if (this.listElement_ && this.listElement_.current) {
          this.listElement_.current.addClassForElementIndex(index, className)
        }
      },
      removeClassFromElementAtIndex: (index, className) => {
        if (this.listElement_ && this.listElement_.current) {
          this.listElement_.current.removeClassForElementIndex(index, className)
        }
      },
      addAttributeToElementAtIndex: (index, attr, value) => {
        if (this.listElement_ && this.listElement_.current) {
          this.listElement_.current.setAttributeForElementIndex(index, attr, value)
        }
      },
      removeAttributeFromElementAtIndex: (index, attr) => {
        if (this.listElement_ && this.listElement_.current) {
          this.listElement_.current.removeAttributeForElementIndex(index, attr)
        }
      },
      elementContainsClass: (element, className) => element.classList.contains(className),
      closeSurface: () => { this.open = false; this.props.onClose() },
      // getElementIndex: (element) => this.items.indexOf(element),
      getParentElement: (element) => element.parentElement,
      getSelectedElementIndex: (selectionGroup) => {
        if (this.listElement_ && this.listElement_.current) {
          return this.listElement_.current.props.selectedIndex
        }
      },
      notifySelected: (evtData) => this.props.onSelected(evtData.index),
    })
  }

  get otherProps() {
    const {
      anchorCorner,
      anchorElement,
      anchorMargin,
      as,
      children,
      className,
      coordinates,
      fixed,
      list,
      open,
      onClick,
      onClose,
      onKeyDown,
      onOpen,
      onSelected,
      quickOpen,
      ...otherProps,
    } = this.props
    return otherProps
  }

  render() {
    const {
      anchorCorner,
      anchorElement,
      anchorMargin,
      as,
      coordinates,
      fixed,
      onClose,
      open,
      quickOpen
    } = this.props

    return (
      <MenuSurface
        {...this.otherProps}
        anchorCorner={anchorCorner}
        anchorElement={anchorElement}
        anchorMargin={anchorMargin}
        as={as}
        className={this.classes}
        coordinates={coordinates}
        fixed={fixed}
        tabIndex="-1"
        onClick={this.handleClick_}
        onClose={onClose}
        onKeyDown={this.handleKeydown_}
        onOpen={this.handleOpen_}
        open={open}
        quickOpen={quickOpen}
      >
        {this.renderList()}
      </MenuSurface>
    )
  }

  renderList() {
    const list = React.Children.only(this.props.children)
    const props = Object.assign({
      ref: this.listElement_,
      role: "menu",
      "aria-hidden": true,
    }, list.props)
    return React.cloneElement(list, props)
  }
}

Menu.propTypes = {
  anchorElement: PropTypes.object,
  anchorCorner: PropTypes.number,
  anchorMargin: PropTypes.object,
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  children: function(props, propName, componentName) {
    const prop = props[propName];
    const child = React.Children.only(prop)
    let error = null;
    if (child && child.type.name !== 'List') {
      error = new Error('`' + componentName + '` only child should be of type `List`.');
    }
    return error;
  },
  className: PropTypes.string,
  coordinates: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  fixed: PropTypes.bool,
  open: PropTypes.bool,
  onClick: PropTypes.func,
  onClose: PropTypes.func,
  onKeyDown: PropTypes.func,
  onOpen: PropTypes.func,
  onSelected: PropTypes.func,
  quickOpen: PropTypes.bool,
}

Menu.defaultProps = {
  anchorElement: null,
  anchorCorner: 0,
  anchorMargin: {},
  as: "div",
  className: '',
  coordinates: null,
  fixed: false,
  open: false,
  onClick: () => {},
  onClose: () => {},
  onKeyDown: () => {},
  onOpen: () => {},
  onSelected: () => {},
  quickOpen: false,
}

Menu.Anchor = MenuSurface.Anchor
Menu.SelectionGroup = MenuSelectionGroup
Menu.SelectionGroupIcon = MenuSelectionGroupIcon

export default Menu
export {
  Corner,
}
