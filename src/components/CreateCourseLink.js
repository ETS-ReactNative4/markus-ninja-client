import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { Link } from 'react-router-dom'
import { get } from 'utils'

class CreateCourseLink extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("CreateCourseLink", className)
  }

  render() {
    const study = get(this.props, "study", {})
    return (
      <Link className={this.classes} to={study.resourcePath + "/courses/new"}>
        {this.props.children}
      </Link>
    )
  }
}

export default createFragmentContainer(CreateCourseLink, graphql`
  fragment CreateCourseLink_study on Study {
    resourcePath
  }
`)
