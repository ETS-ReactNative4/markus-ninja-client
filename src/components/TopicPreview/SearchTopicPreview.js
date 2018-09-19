import React, { Component } from 'react'
import cls from 'classnames'
import { Link } from 'react-router-dom'
import { get } from 'utils'

class SearchTopicPreview extends Component {
  get classes() {
    const {className} = this.props
    return cls("SearchTopicPreview flex flex-column items-center", className)
  }

  render() {
    const topic = get(this.props, "topic", {})
    return (
      <Link className={this.classes} to={topic.resourcePath}>
        <h5>{topic.name}</h5>
        <div>{topic.description}</div>
      </Link>
    )
  }
}

export default SearchTopicPreview
