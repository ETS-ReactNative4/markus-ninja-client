import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'

import "./styles.css"

class Icon extends React.PureComponent {
  get classes() {
    const {className} = this.props
    return cls("Icon material-icons", className)
  }

  get icon() {
    const {children, icon} = this.props
    switch (icon) {
      case "asset":
        return "image"
      case "course":
        return "library_books"
      case "lesson":
        return "subject"
      case "study":
        return "local_library"
      case "topic":
        return "bookmark"
      case "user":
        return "person"
      default:
        return children
    }
  }

  get label() {
    const {icon} = this.props
    switch (icon) {
      case "asset":
        return "Asset"
      case "course":
        return "Course"
      case "lesson":
        return "Lesson"
      case "study":
        return "Study"
      case "topic":
        return "Topic"
      case "user":
        return "User"
      default:
        return ""
    }
  }

  render() {
    const { as: Component } = this.props
    return (
      <Component
        className={this.classes}
        aria-hidden="true"
        aria-label={this.label}
        title={this.label}
      >
        {this.icon}
      </Component>
    )
  }
}

Icon.propTypes = {
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  className: PropTypes.string,
  children: PropTypes.node,
  icon: PropTypes.string,
}

Icon.defaultProps = {
  as: "i",
  className: "",
  children: null,
  icon: "",
}

export default Icon