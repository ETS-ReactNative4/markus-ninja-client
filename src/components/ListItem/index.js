import * as React from 'react'
import cls from 'classnames'

class ListItem extends React.PureComponent {
  constructor(props) {
    super(props)

    this.listItem = React.createRef()
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.active && this.props.active) {
      // this.listItem.focus()
    }
  }

  render() {
    const { active, as: Component, children, className, ...props } = this.props

    return (
      <Component
        innerRef={node => this.listItem = node}
        className={cls("mdc-list-item", className, { "mdc-list-item--activated": active })}
        aria-selected={active ? "true" : "false" }
        tabIndex="-1"
        {...props}
      >
        {children}
      </Component>
    )
  }
}

export default ListItem
