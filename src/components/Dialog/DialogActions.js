import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'

class DialogActions extends React.Component {
  addButtonClassToChildren = () => {
    return React.Children.map(this.props.children, (item) => {
      const className = cls(
        item.props.className, 'mdc-dialog__button',
      )
      const props = Object.assign({}, item.props, {className})
      return React.cloneElement(item, props)
    })
  }

  get classes() {
    const {className} = this.props
    return cls('mdc-dialog__actions', className)
  }

  get otherProps() {
    const {
      className,
      children,
      ...otherProps,
    } = this.props
    return otherProps
  }

  render() {
    return (
      <footer
        className={this.classes}
        {...this.otherProps}
      >
        {this.addButtonClassToChildren()}
      </footer>
    )
  }
}

DialogActions.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}

DialogActions.defaultProps = {
  children: null,
  className: '',
}

export default DialogActions
