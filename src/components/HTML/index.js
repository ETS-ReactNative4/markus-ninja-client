import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import convert from 'htmr'

import './styles.css'

class HTML extends React.PureComponent {
  get classes() {
    const {className} = this.props
    return cls("HTML", className)
  }

  get otherProps() {
    const {
      className,
      html,
      ...otherProps,
    } = this.props
    return otherProps
  }

  render() {
    const {html} = this.props

    if (html === null) {
      return null
    }

    return (
      <div {...this.otherProps} className={this.classes}>
        {convert(html)}
      </div>
    )
  }
}

HTML.propTypes = {
  className: PropTypes.string,
  html: PropTypes.string,
}

HTML.defaultProps = {
  className: "",
  html: "",
}

export default HTML
