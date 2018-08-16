import * as React from 'react'
import cls from 'classnames'

class TabBar extends React.PureComponent {
  render() {
    return (
      <div
        className={cls("mdc-tab-bar", this.props.className)}
        role="tablist"
      >
        <div className="mdc-tab-scroller">
          <div className="mdc-tab-scroller__scroll-area">
            <div className="mdc-tab-scroller__scroll-content">
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default TabBar
