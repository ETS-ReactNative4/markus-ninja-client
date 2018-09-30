import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import hljs from 'highlightjs'
import convert from 'htmr'

import './styles.css'

class HTML extends React.Component {
  constructor(props) {
    super(props)

    this.node = React.createRef()
  }

  componentDidMount() {
    this.highlightCode()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.html !== this.props.html) {
      this.highlightCode()
    }
  }

  highlightCode() {
    const nodes = this.node.current.querySelectorAll('pre code');

    for (let i = 0; i < nodes.length; i++) {
      hljs.highlightBlock(nodes[i])
    }
  }

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
      <div
        ref={this.node}
        {...this.otherProps}
        className={this.classes}
      >
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
