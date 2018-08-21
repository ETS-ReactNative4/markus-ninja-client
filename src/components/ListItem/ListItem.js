import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import { recursiveReactChildrenMap } from 'utils'

class ListItem extends React.Component {

  state = {
    classList: new Set(),
  }

  get classes() {
    const {classList} = this.state
    const {
      activated,
      className,
      disabled,
      selected,
    } = this.props

    return cls('mdc-list-item', Array.from(classList), className, {
      'mdc-list-item--activated': activated,
      'mdc-list-item--disabled': disabled,
      'mdc-list-item--selected': selected,
    })
  }

  get isSelected() {
    const {activated, selected} = this.props
    return activated || selected
  }

  get otherProps() {
    const {
      activated,
      className,
      disabled,
      innerRef,
      selected,
      ...otherProps,
    } = this.props

    return otherProps
  }

  get tabIndex() {
    const {tabIndex} = this.props
    return this.isSelected ? 0 : tabIndex
  }

  render() {
    const {children, innerRef, tabIndex} = this.props
    return (
      // eslint-disable-next-line jsx-a11y/role-supports-aria-props
      <li
        {...this.otherProps}
        className={this.classes}
        aria-selected={this.isSelected}
        tabIndex={tabIndex}
        ref={innerRef}
      >
        {recursiveReactChildrenMap(children, (child) => {
          if (child.type === 'a' || child.type === 'button') {
            const updatedProps = {
              ...child.props,
              tabIndex,
            }

            return React.cloneElement(child, updatedProps)
          }
        })}
      </li>
    )
  }
}

ListItem.propTypes = {
  activated: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  selected: PropTypes.bool,
  tabIndex: PropTypes.number,
}

ListItem.defaultProps = {
  activated: false,
  className: '',
  disabled: false,
  selected: false,
  tabIndex: -1,
}

export default ListItem
