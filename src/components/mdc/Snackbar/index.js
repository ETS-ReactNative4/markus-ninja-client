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

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {getCorrectEventName} from '@material/animation';

import {MDCSnackbarFoundation} from '@material/snackbar';

export default class Snackbar extends Component {
  foundation_ = null;
  snackbarElement_ = React.createRef();
  actionElement_ = React.createRef();

  state = {
    actionHidden: false,
    classList: new Set(),
    onBlurAction: () => {},
    onClickAction: () => {},
    onTransitionEnd: () => {},
    snackbarHidden: false,
  };

  componentDidMount() {
    this.foundation_ = new MDCSnackbarFoundation(this.adapter);
    this.foundation_.init();

    this.foundation_.setDismissOnAction(this.props.dismissesOnAction)
  }

  componentDidUpdate(prevProps) {
    const {message, show} = this.props
    if ((!prevProps.show && show) || (show && prevProps.message !== message)) {
      this.foundation_.show(this.data)
    }
  }

  componentWillUnmount() {
    this.foundation_.destroy();
  }

  handleBlurAction_ = (e) => {
    this.state.onBlurAction(e)
  }

  handleClickAction_ = (e) => {
    this.state.onClickAction(e)
  }

  handleTransitionEnd_ = (e) => {
    this.state.onTransitionEnd(e)
  }

  get classes() {
    const {classList} = this.state;
    const {actionOnBottom, alignStart, className, multiline} = this.props;
    return classnames('mdc-snackbar', Array.from(classList), className, {
      'mdc-snackbar--action-on-bottom': actionOnBottom,
      'mdc-snackbar--align-start': alignStart,
      'mdc-snackbar--multiline': multiline,
    });
  }

  get data() {
    const {
      actionText,
      actionHandler,
      actionOnBottom,
      message,
      multiline,
      timeout,
    } = this.props
    return {
      actionHandler,
      actionOnBottom,
      actionText,
      message,
      multiline,
      timeout,
    }
  }

  get adapter() {
    return {
      addClass: (className) => {
        const classList = new Set(this.state.classList);
        classList.add(className);
        this.setState({classList});
      },
      removeClass: (className) => {
        const classList = new Set(this.state.classList);
        classList.delete(className);
        this.setState({classList});
      },
      setAriaHidden: () => this.setState({snackbarHidden: true}),
      unsetAriaHidden: () => this.setState({snackbarHidden: false}),
      setActionAriaHidden: () => this.setState({actionHidden: true}),
      unsetActionAriaHidden: () => this.setState({actionHidden: false}),
      setFocus: () => {
        const actionElement = this.actionElement_ && this.actionElement_.current
        actionElement && actionElement.focus()
      },
      isFocused: () => {
        const actionElement = this.actionElement_ && this.actionElement_.current
        return document.activeElement === actionElement
      },
      visibilityIsHidden: () => document.hidden,
      registerCapturedBlurHandler: (handler) => this.setState({onBlurAction: handler}),
      deregisterCapturedBlurHandler: (handler) => this.setState({onBlurAction: () => {}}),
      registerVisibilityChangeHandler: (handler) => document.addEventListener('visibilitychange', handler),
      deregisterVisibilityChangeHandler: (handler) => document.removeEventListener('visibilitychange', handler),
      registerCapturedInteractionHandler: (evt, handler) =>
        document.body.addEventListener(evt, handler, true),
      deregisterCapturedInteractionHandler: (evt, handler) =>
        document.body.removeEventListener(evt, handler, true),
      registerActionClickHandler: (handler) => this.setState({onClickAction: handler}),
      deregisterActionClickHandler: (handler) => this.setState({onClickAction: () => {}}),
      registerTransitionEndHandler: (handler) => {
        const snackbarElement = this.snackbarElement_ && this.snackbarElement_.current
        snackbarElement.addEventListener(getCorrectEventName(window, 'transitionend'), handler)
      },
      deregisterTransitionEndHandler: (handler) => {
        const snackbarElement = this.snackbarElement_ && this.snackbarElement_.current
        snackbarElement.removeEventListener(getCorrectEventName(window, 'transitionend'), handler)
      },
      notifyShow: this.props.handleShow,
      notifyHide: this.props.handleHide,
    };
  }

  get otherProps() {
    const {
      actionClassName,
      actionHandler,
      actionOnBottom,
      actionText,
      alignStart,
      className,
      dismissesOnAction,
      handleHide,
      handleShow,
      message,
      multiline,
      show,
      timeout,
      ...otherProps
    } = this.props;
    return otherProps
  }

  render() {
    const {
      actionClassName,
      actionText,
      message,
    } = this.props
    const {
      actionHidden,
      snackbarHidden,
    } = this.state

    return (
      <div
        className={this.classes}
        aria-live="assertive"
        aria-atomic="true"
        aria-hidden={snackbarHidden ? "true" : null}
        ref={this.snackbarElement_}
        {...this.otherProps}
      >
        <div className="mdc-snackbar__text">{message}</div>
        <div className="mdc-snackbar__action-wrapper">
          <button
            type="button"
            className={classnames(actionClassName, "mdc-snackbar__action-button")}
            aria-hidden={actionHidden ? "true" : null}
            onBlur={this.handleBlurAction_}
            onClick={this.handleClickAction_}
            ref={this.actionElement_}
          >
            {actionText}
          </button>
        </div>
      </div>
    );
  }
}

Snackbar.propTypes = {
  actionClassName: PropTypes.string,
  actionHandler: PropTypes.func,
  actionOnBottom: PropTypes.bool,
  actionText: PropTypes.string,
  alignStart: PropTypes.bool,
  className: PropTypes.string,
  dismissesOnAction: PropTypes.bool,
  handleHide: PropTypes.func,
  handleShow: PropTypes.func,
  message: PropTypes.string,
  multiline: PropTypes.bool,
  show: PropTypes.bool,
  timeout: PropTypes.number,
};

Snackbar.defaultProps = {
  actionClassName: "",
  actionHandler: () => {},
  actionOnBottom: false,
  actionText: "",
  alignStart: false,
  className: '',
  dismissesOnAction: true,
  handleHide: () => {},
  handleShow: () => {},
  message: "",
  multiline: false,
  show: false,
  timeout: 2750,
};
