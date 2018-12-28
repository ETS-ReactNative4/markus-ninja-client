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
      case "user_asset":
        return "image"
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

  get otherProps() {
    const {
      as,
      className,
      children,
      icon,
      label,
      withLabel,
      ...otherProps
    } = this.props
    return otherProps
  }

  render() {
    const {as: Component, label: labelProp, withLabel} = this.props
    const label = labelProp ? this.label : withLabel ? this.label : null

    return (
      <Component
        {...this.otherProps}
        className={this.classes}
        aria-hidden="true"
        aria-label={label}
        title={label}
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
  withLabel: PropTypes.bool,
}

Icon.defaultProps = {
  as: "i",
  className: "",
  children: null,
  icon: "",
  label: "",
  withLabel: false,
}

export default Icon
