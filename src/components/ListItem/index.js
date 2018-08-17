import * as React from 'react'
import cls from 'classnames'

class ListItem extends React.PureComponent {
  render() {
    const { active, as: Component, children, className, ...props } = this.props

    return (
      <Component
        className={cls("mdc-list-item", className, { "mdc-list-item--activated": active })}
        aria-selected={active ? "true" : "false" }
        tabIndex="0"
        {...props}
      >
        {children}
      </Component>
    )
  }
}

export default ListItem
