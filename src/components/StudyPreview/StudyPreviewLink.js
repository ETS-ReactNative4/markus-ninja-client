import * as React from 'react'
import cls from 'classnames'
import {Link} from 'react-router-dom'
import {get} from 'utils'

class StudyPreviewLink extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("StudyPreviewLink", className)
  }

  render() {
    const study = get(this.props, "study", {})
    return (
      <Link className={this.classes} to={study.resourcePath}>
        {study.name}
      </Link>
    )
  }
}

export default StudyPreviewLink
