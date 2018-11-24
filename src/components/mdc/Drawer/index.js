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

import * as React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import FocusTrap from 'focus-trap-react'
import {MDCListFoundation} from '@material/list/dist/mdc.list'
import {
  MDCDismissibleDrawerFoundation,
  MDCModalDrawerFoundation,
} from '@material/drawer/dist/mdc.drawer';

import DrawerAppContent from './DrawerAppContent'
import DrawerContent from './DrawerContent'
import DrawerHeader from './DrawerHeader'
import DrawerSubtitle from './DrawerSubtitle'
import DrawerTitle from './DrawerTitle'

const {cssClasses: listCssClasses} = MDCListFoundation

class Drawer extends React.Component {
  drawer_ = React.createRef()
  previousFocus_ = null
  foundation_ = null

  state = {
    activeFocusTrap: false,
    classList: new Set(),
  };

  componentDidMount() {
    const {dismissible, modal, open} = this.props
    if (dismissible) {
      this.foundation_ = new MDCDismissibleDrawerFoundation(this.adapter)
      this.foundation_.init()
    } else if (modal) {
      this.foundation_ = new MDCModalDrawerFoundation(this.adapter)
      this.foundation_.init()
    }

    if (open && this.foundation_) {
      this.foundation_.open()
    }
  }

  componentDidUpdate(prevProps) {
    const {dismissible, modal, open} = this.props
    if (!(dismissible || modal)) return;

    if (open !== prevProps.open) {
      open ? this.foundation_.open() : this.foundation_.close()
    }
  }

  componentWillUnmount() {
    if (!this.foundation_) return;
    this.foundation_.destroy();
  }

  get classes() {
    const {classList} = this.state;
    const {className, dismissible, modal} = this.props;
    return classnames('mdc-drawer', Array.from(classList), className, {
      'mdc-drawer--dismissible': dismissible,
      'mdc-drawer--modal': modal,
    });
  }

  get adapter() {
    return {
      addClass: (className) => {
        const {classList} = this.state
        classList.add(className);
        this.setState({classList});
      },
      removeClass: (className) => {
        const {classList} = this.state
        classList.delete(className);
        this.setState({classList});
      },
      hasClass: (className) => this.classes.split(' ').includes(className),
      elementHasClass: (element, className) => element.classList.contains(className),
      saveFocus: () => {
        this.previousFocus_ = document.activeElement;
      },
      restoreFocus: () => {
        const hasPreviousFocus = this.previousFocus_ && this.previousFocus_.focus;
        const drawerElement = this.drawer_ && this.drawer_.current
        if (drawerElement && hasPreviousFocus && drawerElement.contains(document.activeElement)) {
          this.previousFocus_.focus();
        }
      },
      focusActiveNavigationItem: () => {
        const drawerElement = this.drawer_ && this.drawer_.current
        if (!drawerElement) return;
        const activeNavItemEl = this.drawer_.current.querySelector(`.${listCssClasses.LIST_ITEM_ACTIVATED_CLASS}`);
        if (activeNavItemEl) {
          activeNavItemEl.focus();
        }
      },
      notifyClose: this.props.onClose,
      notifyOpen: this.props.onOpen,
      trapFocus: () => this.setState({activeFocusTrap: true}),
      releaseFocus: () => this.setState({activeFocusTrap: false}),
    };
  }

  handleScrimClick_ = (evt) => {
    this.props.onScrimClick(evt);
    if (!this.foundation_ || !this.foundation_.handleScrimClick) return;
    this.foundation_.handleScrimClick();
  }

  handleKeyDown_ = (evt) => {
    this.props.onKeyDown(evt);
    if (!this.foundation_ || !this.foundation_.handleKeyDown) return;
    this.foundation_.handleKeyDown(evt);
  }

  handleTransitionEnd_ = (evt) => {
    this.props.onTransitionEnd(evt);
    if (!this.foundation_ || !this.foundation_.handleTransitionEnd) return;
    this.foundation_.handleTransitionEnd(evt);
  }

  get otherProps() {
    const {
      className,
      children,
      dismissible,
      header,
      modal,
      onClose,
      onKeyDown,
      onOpen,
      onScrimClick,
      onTransitionEnd,
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
    const {
      children,
      modal,
    } = this.props;

    return (
      <React.Fragment>
        <aside
          className={this.classes}
          onKeyDown={this.handleKeyDown_}
          onTransitionEnd={this.handleTransitionEnd_}
          ref={this.drawer_}
          {...this.otherProps}
        >
          {activeFocusTrap && Boolean(children)
          ? <FocusTrap focusTrapOptions={this.focusTrapOptions}>
              {children}
            </FocusTrap>
          : children}
        </aside>
        {modal && this.renderScrim()}
      </React.Fragment>
    );
  }

  renderScrim() {
    return (
      <div
        className="mdc-drawer-scrim"
        onClick={this.handleScrimClick_}
      ></div>
    )
  }
}

Drawer.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  dismissible: PropTypes.bool,
  header: PropTypes.element,
  modal: PropTypes.bool,
  onClose: PropTypes.func,
  onKeyDown: PropTypes.func,
  onOpen: PropTypes.func,
  onScrimClick: PropTypes.func,
  onTransitionEnd: PropTypes.func,
  open: PropTypes.bool,
};

Drawer.defaultProps = {
  className: '',
  children: null,
  dismissible: false,
  header: null,
  modal: false,
  onClose: () => {},
  onKeyDown: () => {},
  onOpen: () => {},
  onScrimClick: () => {},
  onTransitionEnd: () => {},
  open: false,
};

Drawer.AppContent = DrawerAppContent
Drawer.Content = DrawerContent
Drawer.Header = DrawerHeader
Drawer.Subtitle = DrawerSubtitle
Drawer.Title = DrawerTitle

export default Drawer
