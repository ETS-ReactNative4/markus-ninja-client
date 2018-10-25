import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'

const MenuSelectionGroup = (props) => {
  const {
    as: Component,
    children,
    className,
    ...otherProps
  } = props

  const classes = cls("mdc-menu__selection-group", className)

  return (
    <Component {...otherProps} className={classes}>
      {children}
    </Component>
  )
}

MenuSelectionGroup.propTypes = {
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  children: PropTypes.node,
  className: PropTypes.string,
}

MenuSelectionGroup.defaultProps = {
  as: "ul",
  children: null,
  className: "",
}

export default MenuSelectionGroup
