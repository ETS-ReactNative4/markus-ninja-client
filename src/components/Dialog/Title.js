import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'

const DialogTitle = (props) => {
  const {
    className,
    children,
    ...otherProps
  } = props
  const classes = cls('mdc-dialog__title', className)

  return (
    <div
      className={classes}
      {...otherProps}
    >
      {children}
    </div>
  )
}

DialogTitle.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}

DialogTitle.defaultProps = {
  children: null,
  className: '',
}

export default DialogTitle
