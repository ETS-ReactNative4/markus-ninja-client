import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'

class SelectCoursePreview extends React.Component {
  handleClick = (e) => {
    const {course} = this.props
    this.props.onClick(course)
  }

  get classes() {
    const {className, selected} = this.props

    return cls("SelectCoursePreview mdc-list-item pointer", className, {
      "mdc-list-item--selected": selected,
    })
  }

  get otherProps() {
    const {
      children,
      className,
      innerRef,
      course,
      selected,
      twoLine,
      ...otherProps
    } = this.props

    return otherProps
  }

  render() {
    const {innerRef, course} = this.props

    if (!course) {
      return null
    }

    return (
      <li
        {...this.otherProps}
        ref={innerRef}
        className={this.classes}
        onClick={this.handleClick}
      >
        {this.renderText()}
      </li>
    )
  }

  renderText() {
    const {course, twoLine} = this.props
    if (twoLine) {
      return (
        <span className="mdc-list-item__text">
          <span className="mdc-list-item__primary-text">
            {course.name}
          </span>
          <span className="mdc-list-item__secondary-text">
            {course.study.nameWithOwner}#{course.number}
          </span>
        </span>
      )
    }

    return (
      <span className="mdc-list-item__text">
        {course.name}
      </span>
    )
  }
}

SelectCoursePreview.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    number: PropTypes.number.isRequired,
    resourcePath: PropTypes.string.isRequired,
    study: PropTypes.shape({
      nameWithOwner: PropTypes.string.isRequired,
    }),
  }),
  onClick: PropTypes.func.isRequired,
  selected: PropTypes.bool,
  twoLine: PropTypes.bool,
}

SelectCoursePreview.defaultProps = {
  course: {
    id: "",
    name: "",
    number: 0,
    resourcePath: "",
    study: {
      nameWithOwner: "",
    },
  },
  onClick: () => {},
  selected: false,
  twoLine: false,
}

export default createFragmentContainer(SelectCoursePreview, graphql`
  fragment SelectCoursePreview_course on Course {
    id
    name
    number
    resourcePath
    study {
      nameWithOwner
    }
  }
`)
