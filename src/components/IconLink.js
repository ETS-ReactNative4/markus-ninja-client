import * as React from 'react'
import cls from 'classnames'
import {Link} from 'react-router-dom'

class IconLink extends React.PureComponent {
  get classes() {
    const {className} = this.props
    return cls('material-icons', className)
  }

  get otherProps() {
    const {children, className, ...otherProps} = this.props
    return otherProps
  }

  render() {
    const {children} = this.props
    return (
      <Link
        {...this.otherProps}
        className={this.classes}
      >
        {children}
      </Link>
    )
  }
}

export default IconLink
