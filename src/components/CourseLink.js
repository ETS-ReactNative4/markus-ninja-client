import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { Link } from 'react-router-dom'
import { get } from 'utils'

class CourseLink extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("CourseLink", className)
  }

  render() {
    const course = get(this.props, "course", {})
    const { innerRef, ...props } = this.props
    return (
      <Link innerRef={innerRef} className={this.classes} to={course.resourcePath} {...props}>
        {course.name}
      </Link>
    )
  }
}

export default createFragmentContainer(CourseLink, graphql`
  fragment CourseLink_course on Course {
    id
    name
    resourcePath
  }
`)
