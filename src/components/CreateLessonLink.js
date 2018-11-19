import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { Link } from 'react-router-dom'
import { get } from 'utils'

class CreateLessonLink extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("CreateLessonLink", className)
  }

  render() {
    const study = get(this.props, "study", {})
    return (
      <Link className={this.classes} to={study.resourcePath + "/lessons/new"}>
        {this.props.children}
      </Link>
    )
  }
}

export default createFragmentContainer(CreateLessonLink, graphql`
  fragment CreateLessonLink_study on Study {
    resourcePath
  }
`)
