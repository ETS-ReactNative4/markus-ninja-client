import * as React from 'react'
import cls from 'classnames'

class Tab extends React.PureComponent {
  get classes() {
    const {
      active,
      className,
      minWidth,
      stacked,
    } = this.props
    return cls("mdc-tab", className, {
      "mdc-tab--active": active,
      "mdc-tab--stacked": stacked,
      "mdc-tab--min-width": minWidth,
    })
  }

  get indicatorClasses() {
    const {
      active,
    } = this.props
    return cls("mdc-tab-indicator", {
      "mdc-tab-indicator--active": active,
    })
  }

  get otherProps() {
    const {
      active,
      className,
      minWidth,
      stacked,
      ...otherProps,
    } = this.props
    return otherProps
  }

  render() {
    const {active, as: Component = 'div', children} = this.props

    return (
      <Component
        {...this.otherProps}
        className={this.classes}
        role="tab"
        aria-selected={active ? "true" : "false" }
        tabIndex="0"
      >
        {children}
        <span className={this.indicatorClasses}>
          <span className="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
        </span>
      </Component>
    )
  }
}

export default Tab
