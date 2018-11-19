import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'

class DialogContent extends React.Component {
  render() {
    const {
      className,
      children,
      ...otherProps
    } = this.props
    const classes = cls('mdc-dialog__content', className)

    return (
      <div
        className={classes}
        {...otherProps}
      >
        {children}
      </div>
    )
  }
}

DialogContent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}

DialogContent.defaultProps = {
  children: null,
  className: '',
}

export default DialogContent
