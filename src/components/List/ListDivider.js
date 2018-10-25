import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'

const ListDivider = (props) => {
  const {
    as: Component,
    children,
    className,
    inset,
    padded,
    ...otherProps
  } = props

  const classes = cls("mdc-list-divider", className, {
    "mdc-list-divider--inset": inset,
    "mdc-list-divider--padded": padded,
  })

  return (
    <Component {...otherProps} className={classes} role="separator">
      {children}
    </Component>
  )
}

ListDivider.propTypes = {
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  children: PropTypes.node,
  className: PropTypes.string,
  inset: PropTypes.bool,
  padded: PropTypes.bool,
}

ListDivider.defaultProps = {
  as: "li",
  children: null,
  className: "",
  inset: false,
  padded: false,
}

export default ListDivider
