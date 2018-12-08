import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import hljs from 'highlightjs'
import ReactHtmlParser from 'react-html-parser'

import './styles.css'

hljs.configure({languages: []})

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
    if (this.node && this.node.current) {
      const nodes = this.node.current.querySelectorAll('pre code');

      for (let i = 0; i < nodes.length; i++) {
        hljs.highlightBlock(nodes[i])
      }
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
      ...otherProps
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
        className={this.classes}
        {...this.otherProps}
      >
        {ReactHtmlParser(html)}
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
