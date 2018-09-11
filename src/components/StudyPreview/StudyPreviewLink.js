import * as React from 'react'
import cls from 'classnames'
import StudyLink from 'components/StudyLink'
import {get} from 'utils'

class StudyPreviewLink extends React.Component {
  get classes() {
    const {className} = this.props
    return cls("StudyPreviewLink", className)
  }

  render() {
    const study = get(this.props, "study", {})
    return <StudyLink className={this.classes} study={study} />
  }
}

export default StudyPreviewLink
