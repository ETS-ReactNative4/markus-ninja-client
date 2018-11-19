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
    this.props.onClick(lesson.id)
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
        <span className="mdc-list-item__graphic" icon="lesson">#{lesson.number}</span>
        <span className="mdc-list-item__text">
          {lesson.title}
        </span>
      </li>
    )
  }
}

SelectLessonPreview.propTypes = {
  lesson: PropTypes.shape({
    id: PropTypes.string.isRequired,
    number: PropTypes.number.isRequired,
    resourcePath: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }),
  onClick: PropTypes.func.isRequired,
  selected: PropTypes.bool,
}

SelectLessonPreview.defaultProps = {
  lesson: {
    id: "",
    number: 0,
    resourcePath: "",
    title: "",
  },
  onClick: () => {},
  selected: false,
}

export default createFragmentContainer(SelectLessonPreview, graphql`
  fragment SelectLessonPreview_lesson on Lesson {
    id
    number
    resourcePath
    title
  }
`)
