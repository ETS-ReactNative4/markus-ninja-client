import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {isEmpty} from 'utils'

import "./styles.css"

class Icon extends React.PureComponent {
  get classes() {
    const {className} = this.props
    return cls("Icon material-icons", className)
  }

  get icon() {
    const {children, icon} = this.props
    switch (icon.toLowerCase()) {
      case "":
        return children
      case "asset":
        return "image"
      case "email":
        return "email"
      case "comment":
        return "comment"
      case "course":
        return "library_books"
      case "label":
        return "label"
      case "lesson":
        return "subject"
      case "reference":
        return "attach_money"
      case "study":
        return "local_library"
      case "topic":
        return "bookmark"
      case "user":
        return "person"
      default:
        return icon
    }
  }

  get label() {
    const {icon, label} = this.props
    if (!isEmpty(label)) {
      return label
    }
    switch (icon) {
      case "asset":
        return "Asset"
      case "email":
        return "Email"
      case "course":
        return "Course"
      case "comment":
        return "Comment"
      case "label":
        return "Label"
      case "lesson":
        return "Lesson"
      case "reference":
        return "Reference"
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
  label: PropTypes.string,
}

Icon.defaultProps = {
  as: "i",
  className: "",
  children: null,
  icon: "",
  label: "",
}

export default Icon
