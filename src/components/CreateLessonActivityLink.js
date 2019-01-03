import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { Link } from 'react-router-dom'
import { get } from 'utils'

class CreateLessonActivityLink extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("CreateLessonActivityLink", className)
  }

  render() {
    const lesson = get(this.props, "lesson", {})
    return (
      <Link className={this.classes} to={lesson.resourcePath + "/activities/new"}>
        {this.props.children}
      </Link>
    )
  }
}

export default createFragmentContainer(CreateLessonActivityLink, graphql`
  fragment CreateLessonActivityLink_lesson on Lesson {
    resourcePath
  }
`)
