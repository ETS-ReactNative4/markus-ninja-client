import * as React from 'react'
import cls from 'classnames'

class Tab extends React.PureComponent {
  render() {
    const { active, as: Component = 'div', children, className, ...props } = this.props

    return (
      <Component
        className={cls("mdc-tab", className, { "mdc-tab--active": active })}
        role="tab"
        aria-selected={active ? "true" : "false" }
        tabIndex="0"
        {...props}
      >
        {children}
        <span className={cls("mdc-tab-indicator", { "mdc-tab-indicator--active": active })}>
          <span className="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
        </span>
      </Component>
    )
  }
}

export default Tab
