import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'

class ErrorText extends React.PureComponent {
  get classes() {
    const {className, error} = this.props
    return cls("rn-error-text", className, {
      "rn-error-text--show": Boolean(error),
    })
  }

  render() {
    return (
      <p className={this.classes}>
        {this.props.error}
      </p>
    )
  }
}

ErrorText.propTypes = {
  className: PropTypes.string,
  error: PropTypes.string,
}

ErrorText.defaultProps = {
  className: "",
  error: undefined,
}

export default ErrorText
