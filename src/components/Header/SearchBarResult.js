import * as React from 'react'
import cls from 'classnames'

class SearchBarResult extends React.PureComponent {
  get classes() {
    const {className, selected} = this.props
    return cls("mdc-list-item", className, {
      "mdc-list-item--selected": selected
    })
  }

  render() {
    const { selected, as: Component, children, className, ...props } = this.props

    return (
      <Component
        className={this.classes}
        aria-selected={selected}
        tabIndex="-1"
        {...props}
      >
        {children}
      </Component>
    )
  }
}

export default SearchBarResult
