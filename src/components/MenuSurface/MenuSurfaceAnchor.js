import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'

const MenuSurfaceAnchor = (props) => {
  const {
    as: Component,
    children,
    className,
    ...otherProps
  } = props

  const classes = cls("mdc-menu-surface--anchor", className)

  return (
    <Component {...otherProps} className={classes}>
      {children}
    </Component>
  )
}

MenuSurfaceAnchor.propTypes = {
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  children: PropTypes.node,
  className: PropTypes.string,
}

MenuSurfaceAnchor.defaultProps = {
  as: "div",
  children: null,
  className: "",
}

export default MenuSurfaceAnchor
