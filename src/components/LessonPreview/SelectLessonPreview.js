import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'

class SelectLessonPreview extends React.Component {
  handleClick = (e) => {
    const {lesson} = this.props
    this.props.onClick(lesson)
  }

  get classes() {
    const {className, selected} = this.props

    return cls("SelectLessonPreview mdc-list-item pointer", className, {
      "mdc-list-item--selected": selected,
    })
  }

  get otherProps() {
    const {
      children,
      className,
      innerRef,
      lesson,
      selected,
      twoLine,
      ...otherProps
    } = this.props

    return otherProps
  }

  render() {
    const {innerRef, lesson} = this.props

    if (!lesson) {
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
    const {lesson, twoLine} = this.props
    if (twoLine) {
      return (
        <span className="mdc-list-item__text">
          <span className="mdc-list-item__primary-text">
            {lesson.title}
          </span>
          <span className="mdc-list-item__secondary-text">
            {lesson.study.nameWithOwner}#{lesson.number}
          </span>
        </span>
      )
    }

    return (
      <span className="mdc-list-item__text">
        {lesson.title}
      </span>
    )
  }
}

SelectLessonPreview.propTypes = {
  lesson: PropTypes.shape({
    id: PropTypes.string.isRequired,
    number: PropTypes.number.isRequired,
    resourcePath: PropTypes.string.isRequired,
    study: PropTypes.shape({
      nameWithOwner: PropTypes.string.isRequired,
    }),
    title: PropTypes.string.isRequired,
  }),
  onClick: PropTypes.func.isRequired,
  selected: PropTypes.bool,
  twoLine: PropTypes.bool,
}

SelectLessonPreview.defaultProps = {
  lesson: {
    id: "",
    number: 0,
    resourcePath: "",
    study: {
      nameWithOwner: "",
    },
    title: "",
  },
  onClick: () => {},
  selected: false,
  twoLine: false,
}

export default createFragmentContainer(SelectLessonPreview, graphql`
  fragment SelectLessonPreview_lesson on Lesson {
    id
    number
    resourcePath
    study {
      nameWithOwner
    }
    title
  }
`)
