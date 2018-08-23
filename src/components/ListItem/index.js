import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {recursiveReactChildrenMap} from 'utils'

class ListItem extends React.Component {

  state = {
    classList: new Set(),
  }

  constructor(props) {
    super(props)

    this.focusables_ = new Map()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tabIndex !== this.props.tabIndex) {
      this.focusables_.forEach((v, k) => v.setAttribute('tabindex', this.props.tabIndex))
    }
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
      as,
      className,
      disabled,
      innerRef,
      selected,
      tabIndex,
      ...otherProps,
    } = this.props

    return otherProps
  }

  get tabIndex() {
    const {tabIndex} = this.props
    return this.isSelected ? 0 : tabIndex
  }

  render() {
    const tabIndex = this.tabIndex
    const {as: Component, children, innerRef} = this.props
    return (
      // eslint-disable-next-line jsx-a11y/role-supports-aria-props
      <Component
        {...this.otherProps}
        className={this.classes}
        aria-selected={this.isSelected}
        tabIndex={tabIndex}
        ref={innerRef}
      >
        {recursiveReactChildrenMap(children, (child, i) => {
          if (!React.isValidElement(child)) {
            return child
          }

          return React.cloneElement(child, {innerRef: (node) => {
            if (node && (node.localName === 'a' || node.localName === 'button')) {
              this.focusables_.set(i, node)
            }
          }}, child.props.children)
        })}
      </Component>
    )
  }
}

ListItem.propTypes = {
  activated: PropTypes.bool,
  as: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  selected: PropTypes.bool,
  tabIndex: PropTypes.number,
}

ListItem.defaultProps = {
  activated: false,
  as: 'li',
  className: '',
  disabled: false,
  selected: false,
  tabIndex: -1,
}

export default ListItem
