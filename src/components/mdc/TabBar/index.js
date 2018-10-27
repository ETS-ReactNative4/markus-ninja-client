import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Tab from 'components/mdc/Tab';
import TabScroller from 'components/mdc/TabScroller';
import {MDCTabBarFoundation} from '@material/tab-bar/dist/mdc.tabBar';

export default class TabBar extends Component {
  constructor(props) {
    super(props);

    this.tabBarElement_ = null;
    this.tabList_ = React.Children.map(
      this.props.children,
      (child) => child ? React.createRef() : null,
    );
    this.tabList_.filter(Boolean);
    this.tabScroller_ = React.createRef();
  }

  componentDidMount() {
    this.foundation_ = new MDCTabBarFoundation(this.adapter);
    this.foundation_.init();

    this.focusOnActivate = this.props.focusOnActivate;
    this.useAutomaticActivation = this.props.useAutomaticActivation;

    for (let i = 0; i < this.tabList_.length; i++) {
      if (this.tabList_[i].current.active) {
        this.scrollIntoView(i);
        break;
      }
    }
  }

  componentWillUnmount() {
    this.foundation_.destroy();
  }

  init = (el) => {
    const {innerRef} = this.props;
    this.tabBarElement_ = el;
    innerRef(el);
  }

  set focusOnActivate(focusOnActivate) {
    this.tabList_.forEach((tab) => tab.current.focusOnActivate = focusOnActivate);
  }

  set useAutomaticActivation(useAutomaticActivation) {
    this.foundation_.setUseAutomaticActivation(useAutomaticActivation);
  }

  get classes() {
    const {className} = this.props;
    return classnames('mdc-tab-bar', className);
  }

  get otherProps() {
    const {
      children,
      className,
      focusOnActivate,
      innerRef,
      onClickTab,
      onKeyDown,
      onTabActivated,
      useAutomaticActivation,
      ...otherProps
    } = this.props;
    return otherProps
  }

  get adapter() {
    return {
      scrollTo: (scrollX) => this.tabScroller_.current && this.tabScroller_.current.scrollTo(scrollX),
      incrementScroll: (scrollXIncrement) => this.tabScroller_.current && this.tabScroller_.current.incrementScroll(scrollXIncrement),
      getScrollPosition: () => this.tabScroller_.current && this.tabScroller_.current.getScrollPosition(),
      getScrollContentWidth: () => this.tabScroller_.current && this.tabScroller_.current.getScrollContentWidth(),
      getOffsetWidth: () => this.tabBarElement_.offsetWidth,
      isRTL: () => window.getComputedStyle(this.tabBarElement_).getPropertyValue('direction') === 'rtl',
      setActiveTab: (index) => this.foundation_.activateTab(index),
      activateTabAtIndex: (index, clientRect) => {
        const tab = this.tabList_[index]
        return tab && tab.current && tab.current.activate(clientRect);
      },
      deactivateTabAtIndex: (index) => {
        const tab = this.tabList_[index]
        return tab && tab.current && tab.current.deactivate();
      },
      focusTabAtIndex: (index) => {
        const tab = this.tabList_[index]
        return tab && tab.current && tab.current.focus();
      },
      getTabIndicatorClientRectAtIndex: (index) => {
        const tab = this.tabList_[index]
        return tab && tab.current && tab.current.computeIndicatorClientRect();
      },
      getTabDimensionsAtIndex: (index) => {
        const tab = this.tabList_[index]
        return tab && tab.current && tab.current.computeDimensions();
      },
      getPreviousActiveTabIndex: () => {
        for (let i = 0; i < this.tabList_.length; i++) {
          if (this.tabList_[i].current && this.tabList_[i].current.active) {
            return i;
          }
        }
        return -1;
      },
      getFocusedTabIndex: () => {
        const tabElements = this.getTabElements_();
        const activeElement = document.activeElement;
        return tabElements.indexOf(activeElement);
      },
      getIndexOfTab: (tabToFind) => {
        const tabElements = this.getTabElements_();
        return tabElements.indexOf(tabToFind);
      },
      getTabListLength: () => this.tabList_.length,
      notifyTabActivated: this.props.onTabActivated,
    };
  }

  activateTab = (index) => {
    this.foundation_.activateTab(index);
  }

  scrollIntoView = (index) => {
    this.foundation_.scrollIntoView(index);
  }

  getTabElements_ = () => {
    return this.tabList_.map((tab) => tab.current && tab.current.tabElement_.current);
  }

  handleTabInteraction_ = (evt) => {
    this.props.onClickTab(evt)
    this.foundation_.handleTabInteraction(Object.assign({}, evt, {
      detail: {
        tab: evt.target,
      }
    }))
  }

  handleKeyDown_ = (evt) => {
    this.props.onKeyDown(evt);
    this.foundation_.handleKeyDown(evt);
  }

  render() {
    return (
      <div
        className={this.classes}
        onKeyDown={this.handleKeyDown_}
        ref={this.init}
        {...this.otherProps}
      >
        <TabScroller ref={this.tabScroller_}>
          {this.renderTabs()}
        </TabScroller>
      </div>
    );
  }

  renderTabs() {
    return React.Children.map(this.props.children, (tab, index) => {
      if (!tab) return  null
      const props = Object.assign({}, tab.props, {
        ref: this.tabList_[index],
        onClick: this.handleTabInteraction_,
      });
      return React.cloneElement(tab, props)
    })
  }
}

TabBar.propTypes = {
  children: function(props, propName, componentName) {
    const prop = props[propName];

    let error = null;
    React.Children.forEach(prop, function(child) {
      if (child && child.type !== Tab) {
        error = new Error('`' + componentName + '` children should be of type `Tab`.');
      }
    })
    return error;
  },
  className: PropTypes.string,
  focusOnActivate: PropTypes.bool,
  innerRef: PropTypes.func,
  onClickTab: PropTypes.func,
  onKeyDown: PropTypes.func,
  onTabActivated: PropTypes.func,
  useAutomaticActivation: PropTypes.bool,
};

TabBar.defaultProps = {
  className: '',
  children: null,
  focusOnActivate: false,
  innerRef: () => {},
  onClickTab: () => {},
  onKeyDown: () => {},
  onTabActivated: () => {},
  useAutomaticActivation: false,
};
