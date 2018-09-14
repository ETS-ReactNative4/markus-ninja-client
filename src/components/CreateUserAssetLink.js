import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import { get } from 'utils'

class CreateUserAssetLink extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("CreateUserAssetLink", className)
  }

  render() {
    const study = get(this.props, "study", {})
    return (
      <Link className={this.classes} to={study.resourcePath + "/assets/new"}>
        {this.props.children}
      </Link>
    )
  }
}

export default createFragmentContainer(CreateUserAssetLink, graphql`
  fragment CreateUserAssetLink_study on Study {
    resourcePath
  }
`)
