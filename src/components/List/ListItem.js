import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'

class ListItem extends React.Component {
  constructor(props) {
    super(props)

    this.root_ = null

    this.setRootRef = (element) => {
      this.root_ = element;
    }
  }

  get classes() {
    const {
      activated,
      className,
      disabled,
      selected,
    } = this.props
    return cls("mdc-list-item", className, {
      'mdc-list-item--activated': activated,
      'mdc-list-item--disabled': disabled,
      'mdc-list-item--selected': selected,
    })
  }

  get otherProps() {
    const {
      activated,
      as,
      children,
      className,
      innerRef,
      ...otherProps,
    } = this.props
    return otherProps
  }

  render() {
    const {
      as: Component,
      children,
      innerRef,
    } = this.props

    return (
      <Component
        {...this.otherProps}
        ref={(node) => {this.setRootRef(node); innerRef(node)}}
        className={this.classes}
      >
        {children}
      </Component>
    )
  }
}

ListItem.propTypes = {
  activated: PropTypes.bool,
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  innerRef: PropTypes.func,
  selected: PropTypes.bool,
}

ListItem.defaultProps = {
  activated: false,
  as: "li",
  children: null,
  className: '',
  disabled: false,
  innerRef: () => {},
  selected: false,
}

export default ListItem
