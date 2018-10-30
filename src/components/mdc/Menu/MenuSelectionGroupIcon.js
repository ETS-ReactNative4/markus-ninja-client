import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'

const MenuSelectionGroupIcon = (props) => {
  const {
    as: Component,
    children,
    className,
    ...otherProps
  } = props

  const classes = cls("mdc-menu__selection-group-icon", className)

  return (
    <Component {...otherProps} className={classes}>
      {children}
    </Component>
  )
}

MenuSelectionGroupIcon.propTypes = {
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  children: PropTypes.node,
  className: PropTypes.string,
}

MenuSelectionGroupIcon.defaultProps = {
  as: "span",
  children: null,
  className: "",
}

export default MenuSelectionGroupIcon
